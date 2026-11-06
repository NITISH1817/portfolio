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
            const words = [
                { text: 'NITISH', rowOffset: 1.6 },
                { text: 'PRIYAN', rowOffset: - 1.6 }
            ]

            // Center of the landing identity monument in world coordinates
            const monumentCenter = new THREE.Vector3(44.2, 0.5, 41.2)
            const monumentAngle = - 0.44 // Facing southwest toward vehicle spawn
            const monumentQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), monumentAngle)

            // Warm stylized peach-gold gradient material matching Screenshot 2
            const letterMaterial = this.game.materials.createGradient(
                'monumentGoldGradient',
                '#FFF5EB',
                '#FF8A60'
            )

            // Architectural Plinth Base
            const plinthGeom = new THREE.BoxGeometry(12.5, 0.45, 5.2)
            const plinthMat = new THREE.MeshStandardMaterial({
                color: 0x2A1F2C,
                roughness: 0.35,
                metalness: 0.25
            })
            const plinthMesh = new THREE.Mesh(plinthGeom, plinthMat)
            plinthMesh.position.copy(monumentCenter)
            plinthMesh.position.y = 0.22
            plinthMesh.quaternion.copy(monumentQuat)
            plinthMesh.receiveShadow = true
            plinthMesh.castShadow = true
            this.game.scene.add(plinthMesh)

            // Plinth fixed physical collider
            this.game.objects.add(
                null,
                {
                    type: 'fixed',
                    position: plinthMesh.position,
                    rotation: plinthMesh.quaternion,
                    friction: 0.7,
                    colliders: [
                        { shape: 'cuboid', parameters: [ 6.25, 0.23, 2.6 ] }
                    ]
                }
            )

            // Build letters for each word
            words.forEach(({ text, rowOffset }) =>
            {
                const letterGeometries = []
                let wordWidth = 0
                const charSpacing = 0.35

                for (let i = 0; i < text.length; i++)
                {
                    const char = text[i]
                    const geom = new TextGeometry(char, {
                        font: font,
                        size: 1.7,
                        depth: 0.55,
                        curveSegments: 3,
                        bevelEnabled: true,
                        bevelThickness: 0.08,
                        bevelSize: 0.05,
                        bevelSegments: 2
                    })
                    geom.computeBoundingBox()
                    geom.center()
                    const box = geom.boundingBox
                    const sizeX = box.max.x - box.min.x
                    const sizeY = box.max.y - box.min.y
                    const sizeZ = box.max.z - box.min.z
                    letterGeometries.push({ char, geom, sizeX, sizeY, sizeZ })
                    wordWidth += sizeX + (i < text.length - 1 ? charSpacing : 0)
                }

                let currentX = - wordWidth * 0.5
                letterGeometries.forEach(({ geom, sizeX, sizeY, sizeZ }) =>
                {
                    const charLocalPos = new THREE.Vector3(
                        currentX + sizeX * 0.5,
                        0.45 + sizeY * 0.5,
                        rowOffset
                    )
                    currentX += sizeX + charSpacing

                    // Rotate into world orientation
                    const charWorldPos = charLocalPos.clone().applyQuaternion(monumentQuat).add(monumentCenter)

                    const letterMesh = new THREE.Mesh(geom, letterMaterial)
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
                            position: charWorldPos,
                            rotation: monumentQuat,
                            friction: 0.7,
                            mass: 0.25,
                            sleeping: true,
                            colliders: [
                                { shape: 'cuboid', parameters: [ sizeX * 0.5, sizeY * 0.5, sizeZ * 0.5 ] }
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
                        letterObject.physical.colliders[0].setContactForceEventThreshold(5)
                    }
                })
            })
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