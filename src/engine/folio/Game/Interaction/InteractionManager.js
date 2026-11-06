import * as THREE from 'three/webgpu';
import { Game } from '../Game.js';
import { InteractivePoints } from '../InteractivePoints.js';
import gsap from 'gsap';

export class InteractionManager {
    static instance = null;

    static getInstance() {
        return InteractionManager.instance;
    }

    constructor() {
        InteractionManager.instance = this;
        this.game = Game.getInstance();

        this.interactiveObjects = new Map();
        this.activeInteraction = null;
        this.isSittingOnBench = false;
        this.benchCameraPreviousTarget = null;

        this.setKeyboardInputs();
        this.setLanternsInteraction();
        this.setBenchesInteraction();
        this.setGarageInteraction();
    }

    setKeyboardInputs() {
        // Handle ESC to close active interactions / stand up from bench
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isSittingOnBench) {
                    this.standUpFromBench();
                }
            } else if (e.key === 'f' || e.key === 'F') {
                // Secondary interaction key
                this.triggerSecondaryInteraction();
            }
        });
    }

    /**
     * Trigger secondary interaction if vehicle is near a bench or lantern
     */
    triggerSecondaryInteraction() {
        if (this.isSittingOnBench) {
            this.standUpFromBench();
            return;
        }

        const vehiclePos = this.game.physicalVehicle?.position;
        if (!vehiclePos) return;

        // Check nearest bench or lantern within 4.5 meters
        for (const [id, item] of this.interactiveObjects.entries()) {
            if (item.type === 'bench' || item.type === 'lantern') {
                const dist = Math.hypot(item.position.x - vehiclePos.x, item.position.z - vehiclePos.z);
                if (dist < 4.5) {
                    item.onInteract();
                    break;
                }
            }
        }
    }

    /**
     * Functional Lanterns: allows players to toggle lights on/off with sound & animation
     */
    setLanternsInteraction() {
        // Locate prominent lanterns near central plaza and pedestrian routes
        const lanternPositions = [
            new THREE.Vector3(34.5, 1.2, 39.0),
            new THREE.Vector3(45.2, 1.2, 38.0),
            new THREE.Vector3(39.0, 1.2, 32.5),
            new THREE.Vector3(48.5, 1.2, 43.5)
        ];

        lanternPositions.forEach((pos, idx) => {
            let isLightOn = true;

            // Create dynamic Three.js PointLight attached to lantern
            const pointLight = new THREE.PointLight(0xFFB347, 2.8, 12);
            pointLight.position.copy(pos).add(new THREE.Vector3(0, 0.4, 0));
            this.game.scene.add(pointLight);

            // Small glowing halo bulb
            const bulbGeo = new THREE.SphereGeometry(0.12, 12, 12);
            const bulbMat = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
            const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
            bulbMesh.position.copy(pointLight.position);
            this.game.scene.add(bulbMesh);

            const toggleLight = () => {
                isLightOn = !isLightOn;

                // Animate light intensity smoothly
                gsap.to(pointLight, {
                    intensity: isLightOn ? 2.8 : 0,
                    duration: 0.35,
                    ease: 'power2.out'
                });

                // Animate bulb glow
                bulbMat.color.setHex(isLightOn ? 0xFFA500 : 0x221A10);

                // Play audio switch feedback
                try {
                    this.game.audio?.groups?.get('hitMetal')?.playRandomNext(3, pos);
                } catch (e) {
                    // Fallback sound safe
                }

                // Dispatch toast feedback event
                window.dispatchEvent(new CustomEvent('interaction-feedback', {
                    detail: {
                        title: isLightOn ? '💡 Lantern Switched ON' : '🌑 Lantern Switched OFF',
                        subtitle: `Warm street illuminator #${idx + 1} toggled`,
                        type: 'light'
                    }
                }));
            };

            const interactivePoint = this.game.interactivePoints.create(
                pos.clone().add(new THREE.Vector3(0, 1.2, 0)),
                'Lantern (Toggle Light)',
                InteractivePoints.ALIGN_RIGHT,
                InteractivePoints.STATE_CONCEALED,
                () => {
                    this.game.inputs.interactiveButtons.clearItems();
                    toggleLight();
                },
                () => {
                    this.game.inputs.interactiveButtons.addItems(['interact']);
                },
                () => {
                    this.game.inputs.interactiveButtons.removeItems(['interact']);
                },
                () => {
                    this.game.inputs.interactiveButtons.removeItems(['interact']);
                }
            );

            this.interactiveObjects.set(`lantern-${idx}`, {
                id: `lantern-${idx}`,
                type: 'lantern',
                position: pos,
                interactivePoint,
                onInteract: toggleLight
            });
        });
    }

    /**
     * Functional Benches: allows visitors to "Sit & Observe" scenic vistas
     */
    setBenchesInteraction() {
        const benchPositions = [
            {
                pos: new THREE.Vector3(34.2, 0.8, 43.8),
                title: 'Central Plaza Bench',
                lore: 'Overlooking the NITISH PRIYAN identity monument and peaceful cherry blossom grove.',
                quote: '“Code is poetry written with logic and architecture.”'
            },
            {
                pos: new THREE.Vector3(42.0, 0.8, 30.5),
                title: 'Lakeside Waterside Bench',
                lore: 'A quiet vantage over the reflective water surface and stone bridges.',
                quote: '“Simplicity and modularity are the foundations of resilient distributed systems.”'
            }
        ];

        benchPositions.forEach((bench, idx) => {
            const sitOnBench = () => {
                if (this.isSittingOnBench) {
                    this.standUpFromBench();
                    return;
                }

                this.isSittingOnBench = true;

                // Stop vehicle smoothly
                if (this.game.physicalVehicle?.chassis?.physical?.body) {
                    this.game.physicalVehicle.chassis.physical.body.setLinvel({ x: 0, y: 0, z: 0 });
                    this.game.physicalVehicle.chassis.physical.body.setAngvel({ x: 0, y: 0, z: 0 });
                }

                // Dispatch scenic observation mode to React HUD
                window.dispatchEvent(new CustomEvent('bench-sit', {
                    detail: {
                        title: bench.title,
                        lore: bench.lore,
                        quote: bench.quote,
                        benchIndex: idx
                    }
                }));

                // Camera transition towards scenic elevation
                if (this.game.view) {
                    gsap.to(this.game.view.camera, {
                        zoom: 1.15,
                        duration: 1.2,
                        ease: 'power2.inOut',
                        onUpdate: () => this.game.view.camera.updateProjectionMatrix()
                    });
                }
            };

            const interactivePoint = this.game.interactivePoints.create(
                bench.pos.clone().add(new THREE.Vector3(0, 1.2, 0)),
                'Bench (Sit & Observe)',
                InteractivePoints.ALIGN_RIGHT,
                InteractivePoints.STATE_CONCEALED,
                () => {
                    this.game.inputs.interactiveButtons.clearItems();
                    sitOnBench();
                },
                () => {
                    this.game.inputs.interactiveButtons.addItems(['interact']);
                },
                () => {
                    this.game.inputs.interactiveButtons.removeItems(['interact']);
                },
                () => {
                    this.game.inputs.interactiveButtons.removeItems(['interact']);
                }
            );

            this.interactiveObjects.set(`bench-${idx}`, {
                id: `bench-${idx}`,
                type: 'bench',
                position: bench.pos,
                interactivePoint,
                onInteract: sitOnBench
            });
        });
    }

    /**
     * Stand up from sitting on a bench and restore driving camera
     */
    standUpFromBench() {
        if (!this.isSittingOnBench) return;
        this.isSittingOnBench = false;

        window.dispatchEvent(new CustomEvent('bench-stand'));

        if (this.game.view) {
            gsap.to(this.game.view.camera, {
                zoom: 1.0,
                duration: 0.8,
                ease: 'power2.out',
                onUpdate: () => this.game.view.camera.updateProjectionMatrix()
            });
        }
    }

    /**
     * Functional Garage / Vehicle Workshop on the plaza
     */
    setGarageInteraction() {
        const garagePos = new THREE.Vector3(44.0, 0.7, 46.5);

        // Place a stylized garage workshop podium
        const podiumGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.15, 32);
        const podiumMat = new THREE.MeshStandardMaterial({
            color: 0x141026,
            roughness: 0.4,
            metalness: 0.8
        });
        const podiumMesh = new THREE.Mesh(podiumGeo, podiumMat);
        podiumMesh.position.copy(garagePos);
        this.game.scene.add(podiumMesh);

        // Glowing neon ring around garage podium
        const ringGeo = new THREE.RingGeometry(1.5, 1.58, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xFF9900, side: THREE.DoubleSide });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = -Math.PI * 0.5;
        ringMesh.position.copy(garagePos).add(new THREE.Vector3(0, 0.08, 0));
        this.game.scene.add(ringMesh);

        // Add interactive prompt for Garage
        const interactivePoint = this.game.interactivePoints.create(
            garagePos.clone().add(new THREE.Vector3(0, 1.5, 0)),
            'Garage (Vehicle Customizer)',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () => {
                this.game.inputs.interactiveButtons.clearItems();
                window.dispatchEvent(new CustomEvent('open-garage-modal'));
            },
            () => {
                this.game.inputs.interactiveButtons.addItems(['interact']);
            },
            () => {
                this.game.inputs.interactiveButtons.removeItems(['interact']);
            },
            () => {
                this.game.inputs.interactiveButtons.removeItems(['interact']);
            }
        );

        this.interactiveObjects.set('garage', {
            id: 'garage',
            type: 'garage',
            position: garagePos,
            interactivePoint,
            onInteract: () => window.dispatchEvent(new CustomEvent('open-garage-modal'))
        });
    }

    update() {
        // Can be called per-tick if needed
    }
}

