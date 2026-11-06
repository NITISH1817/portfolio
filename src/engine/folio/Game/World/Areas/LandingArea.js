import * as THREE from 'three/webgpu'
import { color, float, Fn, instancedArray, mix, normalWorld, positionGeometry, step, texture, uniform, uv, vec2, vec3, vec4 } from 'three/tsl'
import { Inputs } from '../../Inputs/Inputs.js'
import { InteractivePoints } from '../../InteractivePoints.js'
import { Area } from './Area.js'
import gsap from 'gsap'
import { MeshDefaultMaterial } from '../../Materials/MeshDefaultMaterial.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

export class LandingArea extends Area
{
    constructor(model)
    {
        super(model)

        this.localTime = uniform(0)

        this.setLetters()
        this.setDeveloperAvatar()
        this.setKiosk()
        this.setControls()
        this.setBonfire()
        this.setAchievement()
    }

    setLetters()
    {
        // 1. Hide and disable original reference letters
        const references = this.references.items.get('letters')
        if (references)
        {
            for(const reference of references)
            {
                if (reference.userData?.object?.visual?.object3D)
                {
                    reference.userData.object.visual.object3D.visible = false
                }
                if (reference.userData?.object?.physical?.body)
                {
                    reference.userData.object.physical.body.setEnabled(false)
                }
            }
        }

        // 2. Build custom 3D typography landmark "NITISH PRIYAN"
        this.createIdentityMonument()
    }

    createIdentityMonument()
    {
        const fontLoader = new FontLoader()
        fontLoader.load('/folio-assets/fonts/helvetiker_bold.typeface.json', (font) =>
        {
            // Words: NITISH and PRIYAN
            const word1 = 'NITISH'
            const word2 = 'PRIYAN'

            // Direction vector along authentic plaza edge matching camera perspective (from LEFT to RIGHT)
            // Left edge in camera view is near [49.6, 0.75, 39.0], Right edge is near [38.4, 0.75, 44.2]
            const startPos = new THREE.Vector3(49.6, 0.75, 39.0)
            const endPos = new THREE.Vector3(38.4, 0.75, 44.2)
            const lineDir = endPos.clone().sub(startPos)
            lineDir.normalize()

            // Facing toward the vehicle spawn & main plaza
            const letterQuat = new THREE.Quaternion(0, 0.2164, 0, 0.9763)

            // Signature ruby-to-crimson gradient material (authentic Bruno Simon Folio aesthetic)
            const letterMaterial = this.game.materials.getFromName('redGradient') || this.game.materials.createGradient(
                'nameRedGradient',
                '#FF4444',
                '#721551'
            )

            // Refined letter geometry: sleek depth, smooth curved bevels
            const createLetterGeom = (char) =>
            {
                const geom = new TextGeometry(char, {
                    font: font,
                    size: 1.25,
                    depth: 0.32,
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 0.045,
                    bevelSize: 0.035,
                    bevelSegments: 3
                })
                geom.computeBoundingBox()
                geom.center()
                const box = geom.boundingBox
                return {
                    geom,
                    sizeX: box.max.x - box.min.x,
                    sizeY: box.max.y - box.min.y,
                    sizeZ: box.max.z - box.min.z
                }
            }

            const word1Data = word1.split('').map(createLetterGeom)
            const word2Data = word2.split('').map(createLetterGeom)

            const charSpacing = 0.88
            const wordGap = 1.35

            let currentDist = 0

            const placeLetter = (data) =>
            {
                const pos = startPos.clone().addScaledVector(lineDir, currentDist)
                pos.y = 0.55 + data.sizeY * 0.5

                const letterMesh = new THREE.Mesh(data.geom, letterMaterial)
                letterMesh.castShadow = true
                letterMesh.receiveShadow = true

                const letterObject = this.game.objects.add(
                    {
                        model: letterMesh,
                        updateMaterials: false,
                        castShadow: true,
                        receiveShadow: true
                    },
                    {
                        type: 'dynamic',
                        position: pos,
                        rotation: letterQuat,
                        friction: 0.8,
                        mass: 0.35,
                        sleeping: true,
                        colliders: [
                            { shape: 'cuboid', parameters: [ data.sizeX * 0.5, data.sizeY * 0.5, data.sizeZ * 0.5 ] }
                        ],
                        onCollision: (force, position) =>
                        {
                            this.game.audio?.groups?.get('hitBrick')?.playRandomNext(force, position)
                        }
                    }
                )

                if (letterObject?.physical?.colliders?.[0])
                {
                    letterObject.physical.colliders[0].setActiveEvents(this.game.RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS)
                    letterObject.physical.colliders[0].setContactForceEventThreshold(4)
                }

                currentDist += charSpacing
            }

            // Place 'NITISH'
            word1Data.forEach(placeLetter)

            // Inter-word gap
            currentDist += wordGap - charSpacing

            // Place 'PRIYAN'
            word2Data.forEach(placeLetter)
        })
    }

    setDeveloperAvatar()
    {
        const avatarGroup = new THREE.Group()

        // 1. Pedestal Base
        const pedestalBaseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.12, 32)
        const pedestalBaseMat = new MeshDefaultMaterial({
            colorNode: color(0x120F24),
            hasWater: false,
            hasLightBounce: true
        })
        const pedestalBaseMesh = new THREE.Mesh(pedestalBaseGeo, pedestalBaseMat)
        pedestalBaseMesh.position.y = 0.06
        avatarGroup.add(pedestalBaseMesh)

        // Pedestal Glowing Rings
        const ringCyanGeo = new THREE.RingGeometry(0.78, 0.84, 32)
        const ringCyanMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, side: THREE.DoubleSide })
        const ringCyanMesh = new THREE.Mesh(ringCyanGeo, ringCyanMat)
        ringCyanMesh.rotation.x = -Math.PI * 0.5
        ringCyanMesh.position.y = 0.125
        avatarGroup.add(ringCyanMesh)

        const ringOrangeGeo = new THREE.RingGeometry(0.54, 0.58, 32)
        const ringOrangeMat = new THREE.MeshBasicMaterial({ color: 0xFF7A29, side: THREE.DoubleSide })
        const ringOrangeMesh = new THREE.Mesh(ringOrangeGeo, ringOrangeMat)
        ringOrangeMesh.rotation.x = -Math.PI * 0.5
        ringOrangeMesh.position.y = 0.126
        avatarGroup.add(ringOrangeMesh)

        // 2. Avatar Character Root Group
        const characterGroup = new THREE.Group()
        characterGroup.position.y = 0.12
        avatarGroup.add(characterGroup)

        // Materials
        const skinMat = new MeshDefaultMaterial({ colorNode: color(0xF2C29E), hasWater: false, hasLightBounce: true })
        const hoodieMat = new MeshDefaultMaterial({ colorNode: color(0x161324), hasWater: false, hasLightBounce: true })
        const hairMat = new MeshDefaultMaterial({ colorNode: color(0x191526), hasWater: false, hasLightBounce: true })
        const pantsMat = new MeshDefaultMaterial({ colorNode: color(0x1E192E), hasWater: false, hasLightBounce: true })
        const sneakerMat = new MeshDefaultMaterial({ colorNode: color(0xFFFFFF), hasWater: false, hasLightBounce: true })
        const cyanBasicMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF })
        const orangeBasicMat = new THREE.MeshBasicMaterial({ color: 0xFF7A29 })
        const purpleBasicMat = new THREE.MeshBasicMaterial({ color: 0x8B5CF6 })

        // Torso Group (for breathing animation)
        const torsoGroup = new THREE.Group()
        torsoGroup.position.set(0, 1.15, 0)
        characterGroup.add(torsoGroup)

        // Hoodie body
        const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.6, 0.34), hoodieMat)
        torsoMesh.castShadow = true
        torsoGroup.add(torsoMesh)

        // Hoodie cyan zipper
        const zipperMesh = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.56, 0.01), cyanBasicMat)
        zipperMesh.position.set(0, 0, 0.175)
        torsoGroup.add(zipperMesh)

        // Hoodie orange side accents
        const accentLeft = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.48, 0.2), orangeBasicMat)
        accentLeft.position.set(-0.27, 0, 0.08)
        torsoGroup.add(accentLeft)

        const accentRight = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.48, 0.2), orangeBasicMat)
        accentRight.position.set(0.27, 0, 0.08)
        torsoGroup.add(accentRight)

        // Folded hood on back
        const hoodMesh = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.2, 0.16), hoodieMat)
        hoodMesh.position.set(0, 0.22, -0.16)
        hoodMesh.rotation.x = 0.35
        torsoGroup.add(hoodMesh)

        // Head Group (for subtle tracking/bobbing)
        const headGroup = new THREE.Group()
        headGroup.position.set(0, 1.72, 0)
        characterGroup.add(headGroup)

        // Neck
        const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.14, 12), skinMat)
        neckMesh.position.set(0, -0.22, 0)
        headGroup.add(neckMesh)

        // Cranium
        const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.36), skinMat)
        headMesh.castShadow = true
        headGroup.add(headMesh)

        // Hair
        const hairMesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.4), hairMat)
        hairMesh.position.set(0, 0.16, -0.02)
        headGroup.add(hairMesh)

        const fringeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.14), hairMat)
        fringeMesh.position.set(0, 0.22, 0.16)
        fringeMesh.rotation.x = 0.2
        headGroup.add(fringeMesh)

        // Smart Glasses (Cyan glow)
        const glassesFrameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.02), cyanBasicMat)
        glassesFrameLeft.position.set(-0.1, 0.02, 0.19)
        headGroup.add(glassesFrameLeft)

        const glassesFrameRight = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.02), cyanBasicMat)
        glassesFrameRight.position.set(0.1, 0.02, 0.19)
        headGroup.add(glassesFrameRight)

        const glassesBridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), cyanBasicMat)
        glassesBridge.position.set(0, 0.03, 0.19)
        headGroup.add(glassesBridge)

        // Headphones around neck
        const headphoneArch = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.03, 8, 24, Math.PI), hoodieMat)
        headphoneArch.rotation.x = Math.PI * 0.5
        headphoneArch.position.set(0, -0.24, 0)
        headGroup.add(headphoneArch)

        const earcupLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 16), purpleBasicMat)
        earcupLeft.position.set(-0.28, -0.22, 0)
        earcupLeft.rotation.z = Math.PI * 0.5
        headGroup.add(earcupLeft)

        const earcupRight = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 16), cyanBasicMat)
        earcupRight.position.set(0.28, -0.22, 0)
        earcupRight.rotation.z = Math.PI * 0.5
        headGroup.add(earcupRight)

        // Arms & Hands
        const armLeft = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42, 0.16), hoodieMat)
        armLeft.position.set(-0.35, 1.05, 0.1)
        armLeft.rotation.x = 0.4
        characterGroup.add(armLeft)

        const armRight = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42, 0.16), hoodieMat)
        armRight.position.set(0.35, 1.05, 0.16)
        armRight.rotation.x = 0.7
        characterGroup.add(armRight)

        // Hands
        const handLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.06), skinMat)
        handLeft.position.set(-0.34, 0.85, 0.24)
        characterGroup.add(handLeft)

        const handRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.06), skinMat)
        handRight.position.set(0.34, 0.9, 0.32)
        characterGroup.add(handRight)

        // Legs
        const legLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.2), pantsMat)
        legLeft.position.set(-0.15, 0.45, 0)
        characterGroup.add(legLeft)

        const legRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.2), pantsMat)
        legRight.position.set(0.15, 0.45, 0)
        characterGroup.add(legRight)

        // Modern Sneakers
        const sneakerLeft = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.28), sneakerMat)
        sneakerLeft.position.set(-0.15, 0.05, 0.04)
        characterGroup.add(sneakerLeft)

        const sneakerRight = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.28), sneakerMat)
        sneakerRight.position.set(0.15, 0.05, 0.04)
        characterGroup.add(sneakerRight)

        // 3. Floating Levitating Holographic Tablet
        const hologramGroup = new THREE.Group()
        hologramGroup.position.set(0, 1.25, 0.44)
        characterGroup.add(hologramGroup)

        const tabletGlassMat = new THREE.MeshBasicMaterial({
            color: 0x00E5FF,
            transparent: true,
            opacity: 0.55,
            side: THREE.DoubleSide
        })
        const tabletMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.34), tabletGlassMat)
        tabletMesh.rotation.x = -0.3
        hologramGroup.add(tabletMesh)

        // Rotating Cyber Rings
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.008, 8, 32), cyanBasicMat)
        hologramGroup.add(ring1)

        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.006, 8, 32), purpleBasicMat)
        hologramGroup.add(ring2)

        // 4. Place into Game World & Rapier Physics
        const avatarWorldPos = new THREE.Vector3(37.2, 0.55, 44.2)
        const avatarQuat = new THREE.Quaternion(0, 0.2164, 0, 0.9763)

        this.game.objects.add(
            {
                model: avatarGroup,
                updateMaterials: false,
                castShadow: true,
                receiveShadow: true
            },
            {
                type: 'fixed',
                position: avatarWorldPos,
                rotation: avatarQuat,
                colliders: [
                    { shape: 'cylinder', parameters: [ 0.6, 0.95 ] }
                ]
            }
        )

        // 5. Interactive Proximity Marker
        this.game.interactivePoints.create(
            avatarWorldPos.clone().add(new THREE.Vector3(0, 2.1, 0)),
            'Developer (Dossier)',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                window.dispatchEvent(new CustomEvent('open-recruiter-modal'))
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )

        // 6. Animation updater
        this.avatarAnimation = {
            time: 0,
            update: (delta) =>
            {
                this.avatarAnimation.time += delta
                const t = this.avatarAnimation.time

                // Natural idle breathing
                torsoGroup.position.y = 1.15 + Math.sin(t * 1.8) * 0.025
                headGroup.position.y = 1.72 + Math.sin(t * 1.8) * 0.02
                headGroup.rotation.y = Math.sin(t * 0.8) * 0.12

                // Levitating tablet & rotating hologram rings
                hologramGroup.position.y = 1.25 + Math.sin(t * 2.2) * 0.035
                ring1.rotation.z += delta * 0.7
                ring1.rotation.x += delta * 0.3
                ring2.rotation.z -= delta * 0.5
                ring2.rotation.y += delta * 0.4
            }
        }
    }

    setKiosk()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('kioskInteractivePoint')[0].position,
            'World Map',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                window.dispatchEvent(new CustomEvent('open-world-map'))
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    setControls()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('controlsInteractivePoint')[0].position,
            'Controls & Commands',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                window.dispatchEvent(new CustomEvent('open-command-palette'))
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )

        // Menu instance
        const menuInstance = this.game.menu?.items?.get('controls')

        if(menuInstance?.events)
        {
            menuInstance.events.on('close', () =>
            {
                interactivePoint.show()
            })

            menuInstance.events.on('open', () =>
            {
                if(this.game.inputs.mode === Inputs.MODE_GAMEPAD)
                    menuInstance.tabs.goTo('gamepad')
                else if(this.game.inputs.mode === Inputs.MODE_MOUSEKEYBOARD)
                    menuInstance.tabs.goTo('mouse-keyboard')
                else if(this.game.inputs.mode === Inputs.MODE_TOUCH)
                    menuInstance.tabs.goTo('touch')
            })
        }
    }

    setBonfire()
    {
        const position = this.references.items.get('bonfireHashes')[0].position

        // Particles
        let particles = null
        {
            const emissiveMaterial = this.game.materials.getFromName('emissiveOrangeRadialGradient')
    
            const count = 30
            const elevation = uniform(5)
            const positions = new Float32Array(count * 3)
            const scales = new Float32Array(count)
    
    
            for(let i = 0; i < count; i++)
            {
                const i3 = i * 3
    
                const angle = Math.PI * 2 * Math.random()
                const radius = Math.pow(Math.random(), 1.5) * 1
                positions[i3 + 0] = Math.cos(angle) * radius
                positions[i3 + 1] = Math.random()
                positions[i3 + 2] = Math.sin(angle) * radius
    
                scales[i] = 0.02 + Math.random() * 0.06
            }
            
            const positionAttribute = instancedArray(positions, 'vec3').toAttribute()
            const scaleAttribute = instancedArray(scales, 'float').toAttribute()
    
            const material = new THREE.SpriteNodeMaterial()
            material.outputNode = emissiveMaterial.outputNode
    
            const progress = float(0).toVar()
    
            material.positionNode = Fn(() =>
            {
                const newPosition = positionAttribute.toVar()
                progress.assign(newPosition.y.add(this.localTime.mul(newPosition.y)).fract())
    
                newPosition.y.assign(progress.mul(elevation))
                newPosition.xz.addAssign(this.game.wind.direction.mul(progress))
    
                const progressHide = step(0.8, progress).mul(100)
                newPosition.y.addAssign(progressHide)
                
                return newPosition
            })()
            material.scaleNode = Fn(() =>
            {
                const progressScale = progress.remapClamp(0.5, 1, 1, 0)
                return scaleAttribute.mul(progressScale)
            })()
    
            const geometry = new THREE.CircleGeometry(0.5, 8)
    
            particles = new THREE.Mesh(geometry, material)
            particles.visible = false
            particles.position.copy(position)
            particles.count = count
            this.game.scene.add(particles)
        }

        // Hashes
        {
            const alphaNode = Fn(() =>
            {
                const baseUv = uv(1)
                const distanceToCenter = baseUv.sub(0.5).length()
    
                const voronoi = texture(
                    this.game.noises.voronoi,
                    baseUv
                ).g
    
                voronoi.subAssign(distanceToCenter.remap(0, 0.5, 0.3, 0))
    
                return voronoi
            })()
    
            const material = new MeshDefaultMaterial({
                colorNode: color(0x6F6A87),
                alphaNode: alphaNode,
                hasWater: false,
                hasLightBounce: false
            })
    
            const mesh = this.references.items.get('bonfireHashes')[0]
            mesh.material = material
        }

        // Burn
        const burn = this.references.items.get('bonfireBurn')[0]
        burn.visible = false

        // Interactive point
        this.game.interactivePoints.create(
            this.references.items.get('bonfireInteractivePoint')[0].position,
            'Res(e)t',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.reset()

                gsap.delayedCall(2, () =>
                {
                    // Bonfire
                    particles.visible = true
                    burn.visible = true
                    this.game.ticker.wait(2, () =>
                    {
                        particles.geometry.boundingSphere.center.y = 2
                        particles.geometry.boundingSphere.radius = 2
                    })

                    // Sound
                    this.game.audio.groups.get('campfire').items[0].positions.push(position)
                })
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'landing')
        })
        this.events.on('boundingOut', () =>
        {
            this.game.achievements.setProgress('landingLeave', 1)
        })
    }

    update()
    {
        this.localTime.value += this.game.ticker.deltaScaled * 0.1

        if (this.avatarAnimation)
        {
            this.avatarAnimation.update(this.game.ticker.deltaScaled)
        }
    }
}