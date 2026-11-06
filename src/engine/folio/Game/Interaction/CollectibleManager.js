import * as THREE from 'three/webgpu';
import { Game } from '../Game.js';
import gsap from 'gsap';

export class CollectibleManager {
    constructor() {
        this.game = Game.getInstance();
        this.crystals = [];
        this.collectedIds = new Set();

        // Load persisted collected crystals from localStorage
        try {
            const saved = localStorage.getItem('portfolio_collected_crystals');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    this.collectedIds = new Set(parsed);
                }
            }
        } catch (e) {
            console.warn('LocalStorage access warning:', e);
        }

        this.initCrystals();

        // Check vehicle collision / proximity each tick
        this.game.ticker.events.on('tick', () => {
            this.update();
        }, 10);
    }

    initCrystals() {
        const crystalDefinitions = [
            {
                id: 'crystal-01',
                name: 'Genesis Core',
                district: 'Developer City',
                color: '#8B5CF6',
                emissive: '#7C3AED',
                pos: new THREE.Vector3(48.5, 1.2, 45.0),
                description: 'Unlocks Developer Story & Origins'
            },
            {
                id: 'crystal-02',
                name: 'Algorithmic Prism',
                district: 'Engineering District',
                color: '#EC4899',
                emissive: '#DB2777',
                pos: new THREE.Vector3(36, 1.4, -2),
                description: 'Unlocks Java SE 17 & 250+ LeetCode DSA'
            },
            {
                id: 'crystal-03',
                name: 'Production Matrix',
                district: 'Project Universe',
                color: '#3B82F6',
                emissive: '#2563EB',
                pos: new THREE.Vector3(0, 1.4, -36),
                description: 'Unlocks GovScheme, NEXORA & MLOps Pipelines'
            },
            {
                id: 'crystal-04',
                name: 'Honor Shard',
                district: 'Achievement Arena',
                color: '#F59E0B',
                emissive: '#D97706',
                pos: new THREE.Vector3(34, 1.4, 31),
                description: 'Unlocks Oracle Java & AWS Cloud Credentials'
            },
            {
                id: 'crystal-05',
                name: 'Credential Token',
                district: 'Resume Archives',
                color: '#06B6D4',
                emissive: '#0891B2',
                pos: new THREE.Vector3(36, 1.4, -31),
                description: 'Unlocks Direct Verified Resume PDF Download'
            },
            {
                id: 'crystal-06',
                name: 'Transmission Beacon',
                district: 'Contact Spaceport',
                color: '#10B981',
                emissive: '#059669',
                pos: new THREE.Vector3(-42, 1.4, -8),
                description: 'Unlocks Direct Recruiter Dispatch & Messaging'
            }
        ];

        crystalDefinitions.forEach((def) => {
            const isAlreadyCollected = this.collectedIds.has(def.id);

            // 3D Crystal Mesh (Faceted Octahedron, sleek collectible size)
            const geom = new THREE.OctahedronGeometry(0.28, 0);
            const mat = new THREE.MeshStandardMaterial({
                color: def.color,
                emissive: def.emissive,
                emissiveIntensity: 0.8,
                roughness: 0.2,
                metalness: 0.9,
                wireframe: false
            });

            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.copy(def.pos);
            mesh.visible = !isAlreadyCollected;
            this.game.scene.add(mesh);

            // Orbiting cyber ring around crystal
            const ringGeo = new THREE.TorusGeometry(0.42, 0.015, 8, 24);
            const ringMat = new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.7 });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.position.copy(def.pos);
            ringMesh.visible = !isAlreadyCollected;
            this.game.scene.add(ringMesh);

            // Subtle point light for atmospheric glow
            const light = new THREE.PointLight(def.color, 1.8, 6);
            light.position.copy(def.pos);
            light.visible = !isAlreadyCollected;
            this.game.scene.add(light);

            this.crystals.push({
                ...def,
                mesh,
                ringMesh,
                light,
                collected: isAlreadyCollected,
                baseY: def.pos.y,
                time: Math.random() * 10
            });
        });
    }

    update() {
        const vehiclePos = this.game.physicalVehicle?.position;
        const delta = this.game.ticker.deltaScaled;

        for (const crystal of this.crystals) {
            if (crystal.collected) continue;

            crystal.time += delta;

            // Continuous floating levitation and slow rotation
            crystal.mesh.position.y = crystal.baseY + Math.sin(crystal.time * 2.5) * 0.15;
            crystal.mesh.rotation.y += delta * 1.2;
            crystal.mesh.rotation.x = Math.sin(crystal.time * 1.5) * 0.2;

            crystal.ringMesh.position.y = crystal.mesh.position.y;
            crystal.ringMesh.rotation.z += delta * 0.8;
            crystal.ringMesh.rotation.x += delta * 0.4;

            // Distance check to vehicle
            if (vehiclePos) {
                const dist = Math.hypot(crystal.pos.x - vehiclePos.x, crystal.pos.z - vehiclePos.z);
                const heightDiff = Math.abs(crystal.mesh.position.y - vehiclePos.y);

                // Collect when car is within 2.8 meters
                if (dist < 2.8 && heightDiff < 3.0) {
                    this.collect(crystal);
                }
            }
        }
    }

    collect(crystal) {
        if (crystal.collected) return;
        crystal.collected = true;
        this.collectedIds.add(crystal.id);

        // Save to localStorage
        try {
            localStorage.setItem('portfolio_collected_crystals', JSON.stringify([...this.collectedIds]));
        } catch (e) {
            console.warn('LocalStorage save error:', e);
        }

        // Celebratory collection animation: scale up, flash and float away
        gsap.to(crystal.mesh.scale, {
            x: 2.2,
            y: 2.2,
            z: 2.2,
            duration: 0.35,
            ease: 'back.out(2)'
        });
        gsap.to(crystal.mesh.position, {
            y: crystal.mesh.position.y + 3.0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
                crystal.mesh.visible = false;
                crystal.ringMesh.visible = false;
                crystal.light.visible = false;
            }
        });

        // Audio feedback chime
        try {
            this.game.audio?.groups?.get('coin')?.playRandomNext(1, crystal.pos);
        } catch (e) {
            // Safe fallback
        }

        // Dispatch collection event to React HUD & GameStore
        window.dispatchEvent(new CustomEvent('crystal-collected', {
            detail: {
                id: crystal.id,
                name: crystal.name,
                district: crystal.district,
                description: crystal.description,
                totalCollected: this.collectedIds.size,
                maxCrystals: this.crystals.length
            }
        }));

        // Trigger in-game notification
        if (this.game.notifications?.show) {
            this.game.notifications.show(
                `<div class="top"><div class="title">💎 ${crystal.name} Discovered!</div></div><div class="bottom"><div class="description">${crystal.district} // ${crystal.description}</div></div>`,
                'collectible',
                3
            );
        }
    }
}

