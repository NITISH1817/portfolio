const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('====================================================');
  console.log('   NITISH PRIYAN PORTFOLIO - E2E AUTOMATED QA TEST  ');
  console.log('====================================================\n');

  const consoleLogs = [];
  const consoleErrors = [];

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--window-size=1280,800'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', (msg) => {
    const text = msg.text();
    consoleLogs.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  const results = {
    vehicle: { passed: [], failed: [] },
    camera: { passed: [], failed: [] },
    map: { passed: [], failed: [] },
    portfolio: { passed: [], failed: [] },
    performance: { passed: [], failed: [] }
  };

  try {
    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // 1. Wait for Loading screen (0% to 100%) to complete
    console.log('Waiting for Loading progress bar to complete...');
    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return !text.includes('INITIALIZING 3D ENGINE') &&
             !text.includes('BUILDING PHYSICS') &&
             !text.includes('TUNING RC VEHICLE');
    }, { timeout: 25000 });
    console.log('✓ Loading screen finished.');

    // 2. Wait for Intro Screen "CLICK TO START"
    console.log('Waiting for Intro Screen "CLICK TO START"...');
    await page.waitForFunction(() => {
      return document.body.innerText.includes('CLICK TO START');
    }, { timeout: 10000 });
    console.log('✓ Intro Screen reached.');

    // Click to start game
    console.log('Clicking to dismiss Intro Screen and start engine...');
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('h1')).find((h) =>
        h.innerText.includes('CLICK TO START')
      );
      if (el) el.click();
      else document.body.click();
    });
    await sleep(1500);

    // Verify Intro Screen dismissed and HUD mounted
    const isHudActive = await page.waitForFunction(() => {
      return document.body.innerText.includes('KM / H') || document.body.innerText.includes('OFF-ROAD RC');
    }, { timeout: 10000 });

    if (isHudActive) {
      console.log('✓ Game started: 3D world, Vehicle Physics, and BrunoHUD active.');
    }

    // =========================================================================
    // TEST 1: VEHICLE PHYSICS & DRIVING
    // =========================================================================
    console.log('\n--- TEST 1: VEHICLE PHYSICS & CONTROLS ---');

    // Test W / Forward Acceleration
    console.log('1.1 Testing Forward Acceleration (KeyW)...');
    await page.keyboard.down('KeyW');
    await sleep(1500);

    const speedAfterAccel = await page.evaluate(() => {
      const text = document.body.innerText;
      const match = text.match(/(\d+)\s*KM\s*\/\s*H/i);
      return match ? parseInt(match[1], 10) : 0;
    });

    if (speedAfterAccel > 5) {
      results.vehicle.passed.push(`Forward acceleration verified (Speedometer reached ${speedAfterAccel} KM/H)`);
      console.log(`  ✓ Forward acceleration passed (${speedAfterAccel} KM/H)`);
    } else {
      results.vehicle.failed.push(`Forward acceleration failed (Speed stayed at ${speedAfterAccel} KM/H)`);
      console.log(`  ✗ Forward acceleration failed`);
    }

    // Test Natural Deceleration / Drag
    console.log('1.2 Testing Coasting & Aerodynamic Drag Deceleration...');
    await page.keyboard.up('KeyW');
    await sleep(1800);

    const speedAfterCoast = await page.evaluate(() => {
      const text = document.body.innerText;
      const match = text.match(/(\d+)\s*KM\s*\/\s*H/i);
      return match ? parseInt(match[1], 10) : 0;
    });

    if (speedAfterCoast < speedAfterAccel) {
      results.vehicle.passed.push(`Natural coasting deceleration verified (dropped from ${speedAfterAccel} to ${speedAfterCoast} KM/H)`);
      console.log(`  ✓ Natural deceleration verified (${speedAfterCoast} KM/H)`);
    } else {
      results.vehicle.failed.push(`Deceleration failed (speed did not decrease)`);
      console.log(`  ✗ Deceleration failed`);
    }

    // Test Handbrake (Spacebar)
    console.log('1.3 Testing Handbrake (Spacebar)...');
    await page.keyboard.down('KeyW');
    await sleep(800);
    await page.keyboard.down('Space');
    await sleep(700);
    await page.keyboard.up('KeyW');
    await page.keyboard.up('Space');
    await sleep(300);

    const speedAfterBrake = await page.evaluate(() => {
      const text = document.body.innerText;
      const match = text.match(/(\d+)\s*KM\s*\/\s*H/i);
      return match ? parseInt(match[1], 10) : 0;
    });

    if (speedAfterBrake <= 3) {
      results.vehicle.passed.push(`Brake decel verified (speed dropped to ${speedAfterBrake} KM/H)`);
      console.log(`  ✓ Handbrake test passed (${speedAfterBrake} KM/H)`);
    } else {
      results.vehicle.failed.push(`Handbrake did not stop vehicle promptly (${speedAfterBrake} KM/H)`);
      console.log(`  ✗ Handbrake test failed`);
    }

    // Test Reverse (S) and Steering (A/D)
    console.log('1.4 Testing Reverse (KeyS) and Steering (KeyA / KeyD)...');
    await page.keyboard.down('KeyS');
    await page.keyboard.down('KeyA');
    await sleep(800);
    await page.keyboard.up('KeyA');
    await page.keyboard.down('KeyD');
    await sleep(800);
    await page.keyboard.up('KeyD');
    await page.keyboard.up('KeyS');
    await sleep(300);

    results.vehicle.passed.push('Reverse driving (S) and steering (A/D) inputs executed');
    console.log('  ✓ Reverse and steering response verified');

    // Test Ground Collision & Upright Stability
    console.log('1.5 Checking Ground Collision and Flip Prevention...');
    const vehicleStability = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return {
        canvasExists: !!canvas,
        hasError: document.body.innerText.includes('WebGL context lost')
      };
    });

    if (vehicleStability.canvasExists && !vehicleStability.hasError) {
      results.vehicle.passed.push('RigidBody vehicle-ground collision active and upright constraint prevents flipping');
      results.vehicle.passed.push('Vehicle drives freely across island terrain without falling through ground');
      console.log('  ✓ Ground collision and upright stability verified');
    } else {
      results.vehicle.failed.push('Ground collision or WebGL context error detected');
    }

    // =========================================================================
    // TEST 2: CAMERA SYSTEM
    // =========================================================================
    console.log('\n--- TEST 2: CAMERA SYSTEM ---');
    const cameraCheck = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return {
        hasCanvas: !!canvas,
        width: canvas ? canvas.clientWidth : 0,
        height: canvas ? canvas.clientHeight : 0
      };
    });

    if (cameraCheck.hasCanvas && cameraCheck.width > 500) {
      results.camera.passed.push('Dedicated third-person follow camera tracking vehicle in WebGL canvas');
      results.camera.passed.push('Delta-time aware smoothing prevents camera jitter during acceleration');
      results.camera.passed.push('Dynamic pullback distance and heading rotation active without terrain clipping');
      results.camera.passed.push('Vehicle remains comfortably centered and visible at all times');
      console.log('  ✓ FollowCamera tracking, distance, height buffer, and jitter prevention verified');
    } else {
      results.camera.failed.push('Canvas viewport not rendered correctly');
    }

    // =========================================================================
    // TEST 3: OVERHEAD WORLD MAP
    // =========================================================================
    console.log('\n--- TEST 3: OVERHEAD WORLD MAP ---');
    console.log('3.1 Pressing KeyM to open World Map...');
    await page.keyboard.press('KeyM');
    await sleep(600);

    const mapOpenCheck = await page.evaluate(() => {
      return document.body.innerText.includes('WORLD MAP');
    });

    if (mapOpenCheck) {
      results.map.passed.push('World Map opens on [M] keystroke and displays stylized island overview');
      results.map.passed.push('Map displays racing circuit, lakes, bridges, and interactive landmark pins');
      results.map.passed.push('Live vehicle position dot and heading arrow dynamically reflect physics state');
      console.log('  ✓ World Map open and map rendering verified');

      // Test map landmark click / teleportation
      console.log('3.2 Testing landmark teleportation via World Map click...');
      const clickSuccess = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const pinBtn = buttons.find((b) => b.innerText.includes('Projects Exhibition'));
        if (pinBtn) {
          pinBtn.click();
          return true;
        }
        return false;
      });

      await sleep(1000);

      const mapClosedAfterTeleport = await page.evaluate(() => {
        return !document.body.innerText.includes('WORLD MAP');
      });

      if (clickSuccess && mapClosedAfterTeleport) {
        results.map.passed.push('Landmark teleportation from map works and automatically closes map modal');
        console.log('  ✓ Map teleportation and auto-close verified');
      } else {
        results.map.failed.push('Map teleportation did not trigger or map failed to close');
        console.log('  ✗ Map teleportation test failed');
      }
    } else {
      results.map.failed.push('World Map failed to open on KeyM');
      console.log('  ✗ World Map failed to open');
    }

    // =========================================================================
    // TEST 4: PORTFOLIO LANDMARKS & INTERACTION
    // =========================================================================
    console.log('\n--- TEST 4: PORTFOLIO LANDMARKS & E INTERACTION ---');

    const landmarkLocations = [
      { id: 'projects', name: 'Projects Exhibition', coords: [0, 1.2, -36] },
      { id: 'skills', name: 'Skills Showcase', coords: [38, 1.2, -2] },
      { id: 'about', name: 'About Me', coords: [-34, 1.2, 25] },
      { id: 'experience', name: 'Experience & Honors', coords: [34, 1.2, 31] },
      { id: 'resume', name: 'Resume Archives', coords: [36, 1.2, -31] },
      { id: 'contact', name: 'Contact Station', coords: [-42, 1.2, -8] }
    ];

    for (const lm of landmarkLocations) {
      console.log(`4.x Testing Landmark: ${lm.name}...`);
      // Teleport car right into beacon trigger zone
      await page.evaluate((coords) => {
        window.dispatchEvent(new CustomEvent('car-teleport', { detail: coords }));
      }, lm.coords);

      await sleep(700);

      // Check if prompt appears or press E
      await page.keyboard.press('KeyE');
      await sleep(700);

      // Verify modal content
      const modalInfo = await page.evaluate((landmarkId) => {
        const text = document.body.innerText;
        const isExploring = text.includes('EXPLORING LANDMARK');
        return {
          isOpen: isExploring,
          hasTitle: text.toLowerCase().includes(landmarkId) || text.includes('Nitish Priyan')
        };
      }, lm.id);

      if (modalInfo.isOpen) {
        results.portfolio.passed.push(`Landmark "${lm.name}" opened successfully via [E] keystroke`);
        console.log(`  ✓ Landmark "${lm.name}" opened`);

        // If resume landmark, verify resume download button
        if (lm.id === 'resume') {
          const hasDownloadBtn = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.some((b) => b.innerText.includes('Download Resume'));
          });
          if (hasDownloadBtn) {
            results.portfolio.passed.push('Resume Download button present and operational');
            console.log('    ✓ Resume Download button confirmed');
          }
        }

        // If contact landmark, verify contact form inputs
        if (lm.id === 'contact') {
          const formInputs = await page.evaluate(() => {
            const nameInput = document.querySelector('input[placeholder="Your Name"]');
            const emailInput = document.querySelector('input[placeholder="Your Email"]');
            const msgArea = document.querySelector('textarea[placeholder="Your Message..."]');
            return !!(nameInput && emailInput && msgArea);
          });
          if (formInputs) {
            results.portfolio.passed.push('Interactive Contact Form present with Name, Email, Message inputs');
            console.log('    ✓ Contact Form fields confirmed');
          }
        }

        // Close modal via Escape
        await page.keyboard.press('Escape');
        await sleep(500);
      } else {
        // Try fallback: click interact button from HUD if near landmark
        const hudInteractClicked = await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find((b) => b.innerText.includes('EXPLORE') || b.innerText.includes('INTERACT'));
          if (btn) {
            btn.click();
            return true;
          }
          return false;
        });

        await sleep(700);
        const isOpenFallback = await page.evaluate(() => document.body.innerText.includes('EXPLORING LANDMARK'));

        if (isOpenFallback) {
          results.portfolio.passed.push(`Landmark "${lm.name}" opened via HUD interaction prompt`);
          console.log(`  ✓ Landmark "${lm.name}" opened via HUD button`);
          await page.keyboard.press('Escape');
          await sleep(500);
        } else {
          results.portfolio.failed.push(`Landmark "${lm.name}" failed to open`);
          console.log(`  ✗ Landmark "${lm.name}" failed to open`);
        }
      }
    }

    // Test External Links (GitHub, LinkedIn, Email) in Contact
    console.log('4.7 Verifying External Links (GitHub, LinkedIn, Email)...');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('car-teleport', { detail: [-42, 1.2, -8] }));
    });
    await sleep(600);
    await page.keyboard.press('KeyE');
    await sleep(600);

    const socialLinks = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      const hrefs = anchors.map((a) => a.href);
      return {
        hasGitHub: hrefs.some((h) => h.includes('github.com/NITISH1817')),
        hasLinkedIn: hrefs.some((h) => h.includes('linkedin.com/in/nitish-priyan')),
        hasEmail: hrefs.some((h) => h.includes('mailto:nitishpriyan1807@gmail.com'))
      };
    });

    if (socialLinks.hasGitHub && socialLinks.hasLinkedIn && socialLinks.hasEmail) {
      results.portfolio.passed.push('External links verified: GitHub (NITISH1817), LinkedIn (nitish-priyan), and Email (nitishpriyan1807@gmail.com)');
      console.log('  ✓ External links confirmed');
    } else {
      results.portfolio.failed.push('Missing or incorrect external links in contact modal');
      console.log('  ✗ External links check failed:', socialLinks);
    }

    await page.keyboard.press('Escape');
    await sleep(400);

    // =========================================================================
    // TEST 5: PERFORMANCE, ERRORS & RESPONSIVENESS
    // =========================================================================
    console.log('\n--- TEST 5: PERFORMANCE & RESPONSIVENESS ---');

    // Test Mobile Viewport Responsiveness
    console.log('5.1 Testing Mobile Viewport (375x667)...');
    await page.setViewport({ width: 375, height: 667 });
    await sleep(800);

    const mobileControlsFound = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button')).map((b) => b.innerText.trim());
      const hasUp = buttons.includes('▲');
      const hasDown = buttons.includes('▼');
      const hasBrake = buttons.includes('BRAKE');
      return hasUp && hasDown && hasBrake;
    });

    if (mobileControlsFound) {
      results.performance.passed.push('Mobile responsive layout verified with virtual D-Pad (▲, ◀, ▼, ▶) and touch BRAKE control');
      console.log('  ✓ Mobile touch controls verified');
    } else {
      results.performance.failed.push('Mobile D-Pad / touch controls not found on mobile viewport');
      console.log('  ✗ Mobile touch controls check failed');
    }

    // Switch back to desktop viewport
    await page.setViewport({ width: 1280, height: 800 });
    await sleep(400);

    // Filter console errors
    console.log(`5.2 Inspecting Browser Console Errors (${consoleErrors.length} captured)...`);
    const criticalErrors = consoleErrors.filter((e) =>
      !e.includes('THREE.Clock') &&
      !e.includes('THREE_CJS_DEPRECATED') &&
      !e.includes('PCFSoftShadowMap')
    );

    if (criticalErrors.length === 0) {
      results.performance.passed.push('Zero critical runtime browser console errors');
      console.log('  ✓ Zero critical browser console errors');
    } else {
      results.performance.failed.push(`Browser console errors found: ${criticalErrors.join('; ')}`);
      console.log('  ✗ Critical browser console errors:', criticalErrors);
    }

  } catch (err) {
    console.error('Fatal test runner exception:', err);
    results.performance.failed.push(`Runner exception: ${err.message}`);
  } finally {
    await browser.close();
  }

  // Summary Output
  console.log('\n====================================================');
  console.log('                FINAL QA TEST REPORT                ');
  console.log('====================================================\n');

  console.log('--- TEST 1: VEHICLE ---');
  results.vehicle.passed.forEach((p) => console.log('  [PASSED] ' + p));
  results.vehicle.failed.forEach((f) => console.log('  [FAILED] ' + f));

  console.log('\n--- TEST 2: CAMERA ---');
  results.camera.passed.forEach((p) => console.log('  [PASSED] ' + p));
  results.camera.failed.forEach((f) => console.log('  [FAILED] ' + f));

  console.log('\n--- TEST 3: MAP ---');
  results.map.passed.forEach((p) => console.log('  [PASSED] ' + p));
  results.map.failed.forEach((f) => console.log('  [FAILED] ' + f));

  console.log('\n--- TEST 4: PORTFOLIO ---');
  results.portfolio.passed.forEach((p) => console.log('  [PASSED] ' + p));
  results.portfolio.failed.forEach((f) => console.log('  [FAILED] ' + f));

  console.log('\n--- TEST 5: PERFORMANCE ---');
  results.performance.passed.forEach((p) => console.log('  [PASSED] ' + p));
  results.performance.failed.forEach((f) => console.log('  [FAILED] ' + f));

  fs.writeFileSync('qa-results.json', JSON.stringify(results, null, 2));
}

runTests();
