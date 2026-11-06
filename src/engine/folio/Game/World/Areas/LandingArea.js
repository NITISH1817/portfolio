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

            // Direction vector along the authentic plaza edge (matching original Bruno Simon line)
            // Stretches from LEFT to RIGHT in the camera's view: from [39.5, 0.75, 43.7] to [49.8, 0.75, 38.9]
            const startPos = new THREE.Vector3(39.5, 0.75, 43.7)
            const endPos = new THREE.Vector3(49.8, 0.75, 38.9)
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

    setKiosk()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('kioskInteractivePoint')[0].position,
            'Map',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.modals.open('map')
                // interactivePoint.hide()
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

        // this.game.map.items.get('map').events.on('close', () =>
        // {
        //     interactivePoint.show()
        // })
    }

    setControls()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('controlsInteractivePoint')[0].position,
            'Controls',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.menu.open('controls')
                interactivePoint.hide()
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
    }
}