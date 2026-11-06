// Procedural Web Audio API Sound System for Bruno Simon Style Portfolio
// Zero external audio files required, instant load, ultra-low latency

class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // start muted by default for browser autoplay policy, prompt user with sound icon
    this.engineGain = null;
    this.engineOsc = null;
    this.engineFilter = null;
    this.subOsc = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Engine Synthesizer: 2 oscillators + low pass filter for warm toy car hum
      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'triangle';
      this.subOsc.frequency.setValueAtTime(27.5, this.ctx.currentTime);

      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.engineOsc.connect(this.engineFilter);
      this.subOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.masterGain);

      this.engineOsc.start();
      this.subOsc.start();

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  unlock() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = false;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0.6, this.ctx.currentTime, 0.05);
    }
  }

  toggleMute() {
    if (!this.isInitialized) {
      this.unlock();
      return false; // unmuted
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : 0.6;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  updateEngine(speedRatio, isAccelerating) {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const clampedSpeed = Math.min(Math.max(speedRatio, 0), 1.5);

    // Engine pitch revs with speed & throttle
    const baseFreq = 50 + (isAccelerating ? 25 : 0);
    const targetFreq = baseFreq + clampedSpeed * 120;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.subOsc.frequency.setTargetAtTime(targetFreq * 0.5, now, 0.08);

    // Filter opens up as car speeds up
    const filterFreq = 260 + clampedSpeed * 700 + (isAccelerating ? 150 : 0);
    this.engineFilter.frequency.setTargetAtTime(filterFreq, now, 0.08);

    // Slight volume boost on acceleration
    const vol = 0.05 + clampedSpeed * 0.09 + (isAccelerating ? 0.04 : 0);
    this.engineGain.gain.setTargetAtTime(vol, now, 0.08);
  }

  playHorn() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const hornGain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';

      // Cute dual-tone car horn (F4 & A4)
      osc1.frequency.setValueAtTime(349.23, now);
      osc2.frequency.setValueAtTime(440.0, now);

      hornGain.gain.setValueAtTime(0, now);
      hornGain.gain.linearRampToValueAtTime(0.25, now + 0.03);
      hornGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(hornGain);
      osc2.connect(hornGain);
      hornGain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (e) {
      // ignore
    }
  }

  playCrash(intensity = 1) {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const clampedInt = Math.min(Math.max(intensity, 0.2), 2);

      // Low frequency thud
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(140, now);
      thudOsc.frequency.exponentialRampToValueAtTime(30, now + 0.18);

      thudGain.gain.setValueAtTime(0.3 * clampedInt, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      thudOsc.connect(thudGain);
      thudGain.connect(this.masterGain);
      thudOsc.start(now);
      thudOsc.stop(now + 0.22);
    } catch (e) {
      // ignore
    }
  }

  playChime() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {
      // ignore
    }
  }

  playNitro() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // White noise buffer for rocket thrust whoosh
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.35);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 0.42);
    } catch (e) {}
  }

  playWoosh() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.3);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.28);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.3);
    } catch (e) {}
  }

  playDrift() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High pitch tire squeal burst
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.linearRampToValueAtTime(620, now + 0.25);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.Q.setValueAtTime(5.0, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playCrystal() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 4-note sparkling ascending arpeggio: C6 (1046Hz), E6 (1318Hz), G6 (1567Hz), C7 (2093Hz)
      const notes = [1046.5, 1318.5, 1567.98, 2093.0];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + i * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) {}
  }

  playAchievement() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Heroic victory fanfare chord sequence
      const chords = [
        [523.25, 659.25], // C5 + E5
        [659.25, 783.99], // E5 + G5
        [783.99, 1046.5]  // G5 + C6
      ];
      chords.forEach((chord, step) => {
        const t = now + step * 0.12;
        chord.forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + 0.5);
        });
      });
    } catch (e) {}
  }
}

export const carAudio = new SoundController();

