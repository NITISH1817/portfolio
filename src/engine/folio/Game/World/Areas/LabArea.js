import * as THREE from 'three/webgpu'
import { Game } from '../../Game.js'
import { InteractivePoints } from '../../InteractivePoints.js'
import gsap from 'gsap'
import labData from '../../../data/lab.js'
import { TextCanvas } from '../../TextCanvas.js'
import { add, color, float, Fn, If, luminance, mix, mul, normalWorld, positionGeometry, positionWorld, sin, step, texture, uniform, uv, vec2, vec3, vec4 } from 'three/tsl'
import { remapClamp, safeMod, signedModDelta } from '../../utilities/maths.js'
import { Inputs } from '../../Inputs/Inputs.js'
import { MeshDefaultMaterial } from '../../Materials/MeshDefaultMaterial.js'
import { Area } from './Area.js'

function createLabGraphicTexture(title = 'AI & DSA SIMULATOR', isMini = false)
{
    const width = isMini ? 512 : 1024
    const height = isMini ? 288 : 576
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if(!ctx) return new THREE.Texture()

    // 1. Dark futuristic background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    bgGrad.addColorStop(0, '#060B14')
    bgGrad.addColorStop(0.5, '#0B1428')
    bgGrad.addColorStop(1, '#040711')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // 2. Blueprint cyber grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)'
    ctx.lineWidth = 1
    const step = isMini ? 32 : 48
    for(let x = 0; x < width; x += step)
    {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
    }
    for(let y = 0; y < height; y += step)
    {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
    }

    // 3. Top system status bar
    const barH = isMini ? 36 : 56
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
    ctx.fillRect(0, 0, width, barH)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)'
    ctx.beginPath()
    ctx.moveTo(0, barH)
    ctx.lineTo(width, barH)
    ctx.stroke()

    // Pulse dot + label
    ctx.fillStyle = '#10B981'
    ctx.beginPath()
    ctx.arc(isMini ? 18 : 28, isMini ? 18 : 28, isMini ? 4 : 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.font = isMini ? 'bold 11px monospace' : 'bold 15px monospace'
    ctx.fillStyle = '#38BDF8'
    ctx.fillText('NITISH PRIYAN // AI & DSA LAB', isMini ? 30 : 44, isMini ? 22 : 34)

    ctx.fillStyle = '#F59E0B'
    ctx.textAlign = 'right'
    ctx.fillText('ONLINE', width - (isMini ? 16 : 24), isMini ? 22 : 34)
    ctx.textAlign = 'left'

    // 4. Center visual based on project title
    const tLower = (title || '').toLowerCase()
    const cx = width / 2
    const cy = height * 0.52

    if(tLower.includes('binary search') || tLower.includes('search') || tLower.includes('tree') || tLower.includes('dsa'))
    {
        // Draw Binary Search Tree
        const nodes = [
            { x: cx, y: cy - (isMini ? 40 : 70), label: '35', found: false },
            { x: cx - (isMini ? 75 : 140), y: cy - (isMini ? 6 : 10), label: '18', found: false },
            { x: cx + (isMini ? 75 : 140), y: cy - (isMini ? 6 : 10), label: '52', found: false },
            { x: cx - (isMini ? 115 : 210), y: cy + (isMini ? 30 : 50), label: '09', found: false },
            { x: cx - (isMini ? 40 : 70), y: cy + (isMini ? 30 : 50), label: '24', found: true },
            { x: cx + (isMini ? 40 : 70), y: cy + (isMini ? 30 : 50), label: '42', found: false },
            { x: cx + (isMini ? 115 : 210), y: cy + (isMini ? 30 : 50), label: '76', found: false },
        ]
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'
        ctx.lineWidth = isMini ? 1.5 : 2
        const drawLine = (n1, n2) =>
        {
            ctx.beginPath()
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.stroke()
        }
        drawLine(nodes[0], nodes[1])
        drawLine(nodes[0], nodes[2])
        drawLine(nodes[1], nodes[3])
        drawLine(nodes[1], nodes[4])
        drawLine(nodes[2], nodes[5])
        drawLine(nodes[2], nodes[6])

        nodes.forEach(n =>
        {
            ctx.beginPath()
            ctx.arc(n.x, n.y, isMini ? 13 : 22, 0, Math.PI * 2)
            ctx.fillStyle = n.found ? 'rgba(245, 158, 11, 0.25)' : 'rgba(6, 182, 212, 0.15)'
            ctx.fill()
            ctx.lineWidth = n.found ? 2.5 : 1.5
            ctx.strokeStyle = n.found ? '#F59E0B' : '#38BDF8'
            ctx.stroke()

            ctx.font = isMini ? 'bold 9px monospace' : 'bold 14px monospace'
            ctx.fillStyle = n.found ? '#FCD34D' : '#E0F2FE'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(n.label, n.x, n.y)
        })

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
        ctx.strokeStyle = '#F59E0B'
        ctx.lineWidth = 1
        const boxW = isMini ? 260 : 420
        const boxH = isMini ? 26 : 40
        ctx.fillRect(cx - boxW / 2, height - (isMini ? 36 : 58), boxW, boxH)
        ctx.strokeRect(cx - boxW / 2, height - (isMini ? 36 : 58), boxW, boxH)
        ctx.font = isMini ? 'bold 9px monospace' : 'bold 13px monospace'
        ctx.fillStyle = '#F59E0B'
        ctx.textAlign = 'center'
        ctx.fillText('TARGET: 24  |  MID MATCH  |  O(log N)', cx, height - (isMini ? 23 : 38))
    }
    else if(tLower.includes('gradient') || tLower.includes('descent') || tLower.includes('loss'))
    {
        for(let r = 5; r >= 1; r--)
        {
            ctx.beginPath()
            ctx.ellipse(cx, cy, r * (isMini ? 32 : 58), r * (isMini ? 18 : 32), 0, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.15 + r * 0.14})`
            ctx.lineWidth = isMini ? 1.5 : 2
            ctx.stroke()
        }
        ctx.strokeStyle = '#F59E0B'
        ctx.lineWidth = isMini ? 2 : 3
        ctx.beginPath()
        ctx.moveTo(cx - (isMini ? 90 : 160), cy - (isMini ? 50 : 90))
        ctx.lineTo(cx - (isMini ? 45 : 80), cy - (isMini ? 25 : 45))
        ctx.lineTo(cx - (isMini ? 18 : 35), cy - (isMini ? 8 : 16))
        ctx.lineTo(cx, cy)
        ctx.stroke()

        ctx.font = isMini ? 'bold 10px monospace' : 'bold 13px monospace'
        ctx.fillStyle = '#FCD34D'
        ctx.textAlign = 'center'
        ctx.fillText('LOSS: 0.0018  •  EPOCHS: 250  •  ADAM', cx, height - (isMini ? 23 : 38))
    }
    else if(tLower.includes('vision') || tLower.includes('retinopathy') || tLower.includes('clahe') || tLower.includes('backbone'))
    {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(cx, cy, isMini ? 45 : 85, 0, Math.PI * 2)
        ctx.stroke()
        ctx.strokeStyle = '#10B981'
        ctx.lineWidth = 2
        ctx.strokeRect(cx - (isMini ? 30 : 55), cy - (isMini ? 30 : 55), isMini ? 60 : 110, isMini ? 60 : 110)

        ctx.font = isMini ? 'bold 10px monospace' : 'bold 13px monospace'
        ctx.fillStyle = '#34D399'
        ctx.textAlign = 'center'
        ctx.fillText('CLAHE 8x8  •  ACC: 94.6%  •  EFFICIENTNET', cx, height - (isMini ? 23 : 38))
    }
    else if(tLower.includes('chromadb') || tLower.includes('vector') || tLower.includes('hnsw'))
    {
        for(let i = 0; i < 20; i++)
        {
            const angle = (i / 20) * Math.PI * 2
            const dist = (isMini ? 30 : 50) + Math.sin(i * 3) * (isMini ? 35 : 60)
            const px = cx + Math.cos(angle) * dist
            const py = cy + Math.sin(angle) * (dist * 0.6)
            ctx.beginPath()
            ctx.arc(px, py, isMini ? 2.5 : 4, 0, Math.PI * 2)
            ctx.fillStyle = i % 2 === 0 ? '#A855F7' : '#06B6D4'
            ctx.fill()
        }
        ctx.font = isMini ? 'bold 10px monospace' : 'bold 13px monospace'
        ctx.fillStyle = '#C084FC'
        ctx.textAlign = 'center'
        ctx.fillText('COSINE SIMILARITY: 0.941  •  HNSW INDEX', cx, height - (isMini ? 23 : 38))
    }
    else
    {
        for(let l = 0; l < 4; l++)
        {
            const lx = cx - (isMini ? 80 : 150) + l * (isMini ? 55 : 100)
            for(let n = 0; n < 3; n++)
            {
                const ny = cy - (isMini ? 30 : 50) + n * (isMini ? 30 : 50)
                ctx.beginPath()
                ctx.arc(lx, ny, isMini ? 4 : 6, 0, Math.PI * 2)
                ctx.fillStyle = '#38BDF8'
                ctx.fill()
            }
        }
        ctx.font = isMini ? 'bold 10px monospace' : 'bold 13px monospace'
        ctx.fillStyle = '#38BDF8'
        ctx.textAlign = 'center'
        ctx.fillText('NEURAL ARCHITECTURE PIPELINE  •  OPTIMIZED', cx, height - (isMini ? 23 : 38))
    }

    // Title banner
    ctx.textAlign = 'center'
    ctx.font = isMini ? 'bold 13px sans-serif' : 'bold 22px sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText((title || '').toUpperCase(), cx, isMini ? 56 : 86)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = false
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.needsUpdate = true
    return texture
}

export class LabArea extends Area
{
    static DIRECTION_PREVIOUS = 1
    static DIRECTION_NEXT = 2
    static STATE_OPEN = 3
    static STATE_OPENING = 4
    static STATE_CLOSED = 5
    static STATE_CLOSING = 6

    constructor(model)
    {
        super(model)

        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: '🧪 Lab',
                expanded: false,
            })
        }
        
        this.state = LabArea.STATE_CLOSED

        this.setSounds()
        this.setInteractivePoint()
        this.setInputs()
        this.setCinematic()
        this.setShadeMix()
        this.setTexts()
        this.setHover()
        this.setNavigation()
        this.setImages()
        this.setAdjacents()
        this.setTitle()
        this.setUrl()
        this.setScroller()
        this.setPendulum()
        this.setBlackBoard()
        this.setCandleFlames()
        this.setCauldron()
        this.setAchievement()

        this.changeProject(0, null, true)
        this.scroller.progress = this.scroller.targetProgress

        this.scroller.animate()

        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel.addButton({ title: 'open', label: 'open' }).on('click', () => { this.open() })
            this.debugPanel.addButton({ title: 'close', label: 'close' }).on('click', () => { this.close() })
        }
    }

    setSounds()
    {
        this.sounds = {}
        
        this.sounds.scroll = this.game.audio.register({
            path: 'sounds/mecanism/05947 light wooden cart riding on cobblestone - looping.mp3',
            autoplay: true,
            loop: true,
            volume: 0.5,
            positions: this.references.items.get('mecanism')[0].position,
            onPlaying: (item) =>
            {
                const absoluteSpeed = Math.abs(this.scroller.speed)
                item.volume = remapClamp(absoluteSpeed, 0, 6, 0, 0.5)
                item.rate = remapClamp(absoluteSpeed, 0, 6, 0.95, 1.05)
            }
        })

    }

    setInteractivePoint()
    {
        this.interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('interactivePoint')[0].position,
            'Lab',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.open()
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

    setInputs()
    {
        // this.game.inputs.events.on('backward', () =>
        // {
        //     this.close()
        // })

        this.game.inputs.events.on('left', (action) =>
        {
            if(action.active)
                this.previous()
        })

        this.game.inputs.events.on('right', (action) =>
        {
            if(action.active)
                this.next()
        })

        this.game.inputs.events.on('forward', (action) =>
        {
            if(action.active && !action.activeKeys.has('Gamepad.r2'))
                this.previous()
        })

        this.game.inputs.events.on('backward', (action) =>
        {
            if(action.active && !action.activeKeys.has('Gamepad.l2'))
                this.next()
        })

        this.game.inputs.events.on('interact', (action) =>
        {
            if(!action.active && this.state === LabArea.STATE_OPEN)
                this.url.open()
        })

        this.game.inputs.interactiveButtons.events.on('previous', () =>
        {
            if(this.state === LabArea.STATE_OPEN)
                this.previous()
        })

        this.game.inputs.interactiveButtons.events.on('next', () =>
        {
            if(this.state === LabArea.STATE_OPEN)
                this.next()
        })

        this.game.inputs.interactiveButtons.events.on('open', () =>
        {
            if(this.state === LabArea.STATE_OPEN)
                this.url.open()
        })

        this.game.inputs.interactiveButtons.events.on('close', () =>
        {
            if(this.state === LabArea.STATE_OPEN)
                this.close()
        })
    }

    setCinematic()
    {
        this.cinematic = {}
        
        this.cinematic.position = new THREE.Vector3()
        this.cinematic.positionOffset = new THREE.Vector3(4.35, 4.0, 4)
        
        this.cinematic.target = new THREE.Vector3()
        this.cinematic.targetOffset = new THREE.Vector3(-1.75, 1.9, -3)

        const applyPositionAndTarget = () =>
        {
            const flatPosition = this.references.items.get('interactivePoint')[0].position.clone()
            flatPosition.y = 0
            this.cinematic.position.copy(flatPosition).add(this.cinematic.positionOffset)
            this.cinematic.target.copy(flatPosition).add(this.cinematic.targetOffset)
        }
        applyPositionAndTarget()

        // Debug
        if(this.game.debug.active)
        {
            const debugPanel = this.debugPanel.addFolder({
                title: 'cinematic',
                expanded: false,
            })
            debugPanel.addBinding(this.cinematic.positionOffset, 'x', { label: 'positionX', min: - 10, max: 10, step: 0.05 }).on('change', applyPositionAndTarget)
            debugPanel.addBinding(this.cinematic.positionOffset, 'y', { label: 'positionY', min: 0, max: 10, step: 0.05 }).on('change', applyPositionAndTarget)
            debugPanel.addBinding(this.cinematic.positionOffset, 'z', { label: 'positionZ', min: - 10, max: 10, step: 0.05 }).on('change', applyPositionAndTarget)
            debugPanel.addBinding(this.cinematic.targetOffset, 'x', { label: 'targetX', min: - 10, max: 10, step: 0.05 }).on('change', applyPositionAndTarget)
            debugPanel.addBinding(this.cinematic.targetOffset, 'y', { label: 'targetY', min: 0, max: 10, step: 0.05 }).on('change', applyPositionAndTarget)
            debugPanel.addBinding(this.cinematic.targetOffset, 'z', { label: 'targetZ', min: - 10, max: 10, step: 0.05 }).on('change', applyPositionAndTarget)
        }
    }

    setShadeMix()
    {
        this.shadeMix = {}

        this.shadeMix.images = {}
        this.shadeMix.images.min = 0.1
        this.shadeMix.images.max = 0.65
        this.shadeMix.images.mixUniform = uniform(this.shadeMix.images.min)

        this.shadeMix.texts = {}
        this.shadeMix.texts.min = 0.1
        this.shadeMix.texts.max = 0.3
        this.shadeMix.texts.mixUniform = uniform(this.shadeMix.texts.min)

        // Debug
        if(this.game.debug.active)
        {
            const debugPanel = this.debugPanel.addFolder({
                title: 'Shader mix',
                expanded: true,
            })

            const debugUpdate = () =>
            {
                if(this.state === LabArea.STATE_OPEN || this.state === LabArea.STATE_OPENING)
                {
                    this.shadeMix.images.mixUniform.value = this.shadeMix.images.max
                    this.shadeMix.texts.mixUniform.value = this.shadeMix.texts.max
                }
                else
                {
                    this.shadeMix.images.mixUniform.value = this.shadeMix.images.min
                    this.shadeMix.texts.mixUniform.value = this.shadeMix.texts.min
                }
            }
            
            debugPanel.addBinding(this.shadeMix.images, 'min', { label: 'imagesMin', min: 0, max: 1, step: 0.001 }).on('change', debugUpdate)
            debugPanel.addBinding(this.shadeMix.images, 'max', { label: 'imagesMax', min: 0, max: 1, step: 0.001 }).on('change', debugUpdate)
            debugPanel.addBinding(this.shadeMix.texts, 'min', { label: 'textsMin', min: 0, max: 1, step: 0.001 }).on('change', debugUpdate)
            debugPanel.addBinding(this.shadeMix.texts, 'max', { label: 'textsMax', min: 0, max: 1, step: 0.001 }).on('change', debugUpdate)
        }
    }

    setTexts()
    {
        this.texts = {}
        
        this.texts.density = 200
        this.texts.fontFamily = 'Amatic SC'
        this.texts.fontWeight = 700
        this.texts.fontSizeMultiplier = 1
        this.texts.baseColor = color('#ffffff')

        this.texts.createMaterialOnMesh = (mesh, textTexture) =>
        {
            const material = new MeshDefaultMaterial({
                hasWater: false,
                alphaNode: texture(textTexture).r,
                transparent: true
            })
            
            const baseOutput = material.outputNode
            
            material.outputNode = Fn(() =>
            {
                return vec4(
                    mix(
                        baseOutput.rgb,
                        this.texts.baseColor,
                        this.shadeMix.texts.mixUniform
                    ),
                    baseOutput.a
                )
            })()

            // Mesh
            mesh.castShadow = false
            mesh.receiveShadow = false
            mesh.material = material
        }
    }

    setHover()
    {
        this.hover = {}
        this.hover.baseColor = color('#ffffff')

        // Default
        this.hover.inactiveMaterial = new MeshDefaultMaterial({
            colorNode: this.hover.baseColor,
            hasWater: false
        })
        
        const baseOutput = this.hover.inactiveMaterial.outputNode
        
        this.hover.inactiveMaterial.outputNode = Fn(() =>
        {
            return vec4(
                mix(
                    baseOutput.rgb,
                    this.texts.baseColor,
                    this.shadeMix.texts.mixUniform
                ),
                1
            )
        })()

        // Active
        this.hover.activeMaterial = new THREE.MeshBasicNodeMaterial({ transparent: true })
        this.hover.activeMaterial.outputNode = vec4(this.hover.baseColor.mul(1.5), float(1))
    }

    setNavigation()
    {
        this.navigation = {}
        this.navigation.index = -1
        this.navigation.current = null
        this.navigation.next = null
        this.navigation.previous = null
        this.navigation.direction = LabArea.DIRECTION_NEXT
    }

    setImages()
    {
        this.images = {}
        this.images.initiated = false
        this.images.width = 1920 * 0.5
        this.images.height = 1080 * 0.5
        this.images.resources = new Map()
        this.images.loadProgress = uniform(0)
        this.images.animationProgress = uniform(0)
        this.images.animationDirection = uniform(0)

        // Mesh
        this.images.mesh = this.references.items.get('images')[0]
        this.images.mesh.receiveShadow = true
        this.images.mesh.castShadow = false
        this.images.mesh.visible = false // Wait for first load to display

        // Finishing initiating and use first image as default resource
        this.images.init = (key) =>
        {
            this.images.initiated = true

            this.images.mesh.visible = true
            const resource = this.images.resources.get(key)

            this.images.textureOld = resource.texture.clone()
            this.images.textureNew = resource.texture.clone()

            // Color node
            const colorNode = Fn(() =>
            {
                const uvOld = uv().toVar()
                const uvNew = uv().toVar()

                // Parallax (add an offset according to progress)
                uvNew.x.addAssign(this.images.animationProgress.oneMinus().mul(-0.25).mul(this.images.animationDirection))
                uvOld.x.addAssign(this.images.animationProgress.mul(0.25).mul(this.images.animationDirection))

                // Textures
                const textureOldColor = texture(this.images.textureOld, uvOld).rgb
                const textureNewColor = texture(this.images.textureNew, uvNew).rgb

                // Load mix
                textureNewColor.assign(mix(color('#333333'), textureNewColor, this.images.loadProgress))

                // Reveal
                const reveal = uv().x.toVar()
                If(this.images.animationDirection.greaterThan(0), () =>
                {
                    reveal.assign(reveal.oneMinus())
                })
                const threshold = step(this.images.animationProgress, reveal)

                const textureColor = mix(textureNewColor, textureOldColor, threshold)
                return textureColor

            })()
            
            // Material
            this.images.material = new MeshDefaultMaterial({
                colorNode: colorNode,
                hasWater: false
            })

            const baseOutput = this.images.material.outputNode
            
            this.images.material.outputNode = Fn(() =>
            {
                return vec4(
                    mix(
                        baseOutput.rgb,
                        colorNode,
                        this.shadeMix.images.mixUniform
                    ),
                    baseOutput.a
                )
            })()
            
            this.images.mesh.material = this.images.material
        }

        // Load ended
        this.images.loadEnded = (key) =>
        {
            // If first image => init
            if(!this.images.initiated)
                this.images.init(key)

            // Current image => Reveal
            if(this.navigation.current.image === key)
            {
                const resource = this.images.getResourceAndLoad(key)
                this.images.textureNew.copy(resource.texture)
                this.images.textureNew.needsUpdate = true
                gsap.to(this.images.loadProgress, { value: 1, duration: 1, overwrite: true })

                this.images.loadSibling()
            }
        }

        // Load sibling
        this.images.loadSibling = () =>
        {
            let projectIndex = this.navigation.index

            if(this.navigation.direction === LabArea.DIRECTION_PREVIOUS)
                projectIndex -= 1
            else
                projectIndex += 1

            if(projectIndex < 0)
                projectIndex = labData.length - 1

            if(projectIndex > labData.length - 1)
                projectIndex = 0

            const key = labData[projectIndex].image
            const resource = this.images.getResourceAndLoad(key)
        }

        // Get resource and load
        this.images.getResourceAndLoad = (key) =>
        {
            // Try to retrieve resource
            let resource = this.images.resources.get(key)

            // Resource not found => Create
            if(!resource)
            {
                resource = {}
                resource.loaded = true

                const project = labData.find((p) => p.image === key || p.imageMini === key) || { title: key || 'Lab Project' }
                resource.texture = createLabGraphicTexture(project.title, false)
                resource.colorSpace = THREE.SRGBColorSpace
                resource.flipY = false
                resource.magFilter = THREE.LinearFilter
                resource.minFilter = THREE.LinearFilter
                resource.generateMipmaps = false

                // Save
                this.images.resources.set(key, resource)

                // Trigger load ended
                setTimeout(() =>
                {
                    this.images.loadEnded(key)
                }, 0)
            }

            return resource
        }

        // Update
        this.images.update = () =>
        {
            // Get resource
            const key = this.navigation.current.image
            const resource = this.images.getResourceAndLoad(key)

            if(resource.loaded)
            {
                this.images.loadSibling()
                this.images.loadProgress.value = 1
            }
            else
            {
                this.images.loadProgress.value = 0
            }

            // Update textures
            if(this.images.initiated)
            {
                this.images.textureOld.copy(this.images.textureNew)
                this.images.textureOld.needsUpdate = true

                if(resource.loaded)
                {
                    this.images.textureNew.copy(resource.texture)
                    this.images.textureNew.needsUpdate = true
                }
            }

            // Animate right away
            gsap.fromTo(this.images.animationProgress, { value: 0 }, { value: 1, duration: 1, ease: 'power2.inOut', overwrite: true })
            this.images.animationDirection.value = this.navigation.direction === LabArea.DIRECTION_NEXT ? 1 : -1
        }
    }

    setAdjacents()
    {
        this.adjacents = {}

        /**
         * Previous
         */
        // Arrow
        const arrowPrevious = this.references.items.get('arrowPrevious')[0]
        arrowPrevious.material = this.hover.inactiveMaterial
        
        // Intersect
        const intersectPrevious = this.references.items.get('intersectPrevious')[0]
        const intersectPreviousPosition = new THREE.Vector3()
        intersectPrevious.getWorldPosition(intersectPreviousPosition)

        this.adjacents.previousIntersect = this.game.rayCursor.addIntersect({
            active: false,
            shape: new THREE.Sphere(intersectPreviousPosition, intersectPrevious.scale.x),
            onClick: () =>
            {
                this.previous(true)
            },
            onEnter: () =>
            {
                arrowPrevious.material = this.hover.activeMaterial
            },
            onLeave: () =>
            {
                arrowPrevious.material = this.hover.inactiveMaterial
            }
        })

        /**
         * Next
         */
        // Arrow
        const arrowNext = this.references.items.get('arrowNext')[0]
        arrowNext.material = this.hover.inactiveMaterial
        
        // Intersect
        const intersectNext = this.references.items.get('intersectNext')[0]

        const intersectNextPosition = new THREE.Vector3()
        intersectNext.getWorldPosition(intersectNextPosition)

        this.adjacents.nextIntersect = this.game.rayCursor.addIntersect({
            active: false,
            shape: new THREE.Sphere(intersectNextPosition, intersectNext.scale.x),
            onClick: () =>
            {
                this.next()
            },
            onEnter: () =>
            {
                arrowNext.material = this.hover.activeMaterial
            },
            onLeave: () =>
            {
                arrowNext.material = this.hover.inactiveMaterial
            }
        })
    }

    setTitle()
    {
        this.title = {}
        this.title.status = 'hidden'
        this.title.group = this.references.items.get('title')[0]
        this.title.inner = this.title.group.children[0]
        this.title.textMesh = this.title.inner.children.find(_child => _child.name.startsWith('text'))
        this.title.textCanvas = new TextCanvas(
            this.texts.fontFamily,
            this.texts.fontWeight,
            this.texts.fontSizeMultiplier * 0.4,
            4,
            0.6,
            this.texts.density,
            'center'
        )
        this.texts.createMaterialOnMesh(this.title.textMesh, this.title.textCanvas.texture)

        this.title.update = (direction) =>
        {
            if(this.title.status === 'hiding')
                return

            this.title.status = 'hiding'

            const rotationDirection = direction === LabArea.DIRECTION_NEXT ? - 1 : 1

            this.title.inner.rotation.x = 0
            gsap.to(this.title.inner.rotation, { x: Math.PI * rotationDirection, duration: 1, delay: 0, ease: 'power2.in', overwrite: true, onComplete: () =>
            {
                this.title.status = 'visible'

                gsap.to(this.title.inner.rotation, { x: Math.PI * 2 * rotationDirection, duration: 1, delay: 0, ease: 'back.out(2)', overwrite: true })

                this.title.textCanvas.updateText(this.navigation.current.title)
            } })
        }
    }

    setUrl()
    {
        this.url = {}
        this.url.status = 'hidden'
        this.url.group = this.references.items.get('url')[0]
        this.url.inner = this.url.group.children[0]

        // Text
        this.url.textMesh = this.url.inner.children.find(_child => _child.name.startsWith('text'))
        this.url.panel = this.url.inner.children.find(_child => _child.name.startsWith('panel'))
        this.url.textCanvas = new TextCanvas(
            this.texts.fontFamily,
            this.texts.fontWeight,
            this.texts.fontSizeMultiplier * 0.23,
            4,
            0.2,
            this.texts.density,
            'center'
        )
        this.url.mixStrength = uniform(0)

        // Material
        const material = new MeshDefaultMaterial({
            colorNode: this.texts.baseColor,
            hasWater: false,
            alphaNode: texture(this.url.textCanvas.texture).r,
            transparent: true
        })
        
        const baseOutput = material.outputNode
        
        material.outputNode = Fn(() =>
        {
            return vec4(
                mix(
                    mix(
                        baseOutput.rgb,
                        this.texts.baseColor,
                        this.shadeMix.texts.mixUniform
                    ),
                    this.texts.baseColor.mul(1.5),
                    this.url.mixStrength
                ),
                baseOutput.a
            )
        })()

        // Mesh
        this.url.textMesh.castShadow = false
        this.url.textMesh.receiveShadow = false
        this.url.textMesh.material = material

        // Intersect
        const intersect = this.references.items.get('intersectUrl')[0]
        intersect.visible = false
 
        this.url.intersect = this.game.rayCursor.addIntersect({
            active: false,
            shape: intersect,
            onClick: () =>
            {
                this.url.open()
            },
            onEnter: () =>
            {
                this.url.mixStrength.value = 1
            },
            onLeave: () =>
            {
                this.url.mixStrength.value = 0
            }
        })

        // Update
        this.url.update = (direction) =>
        {
            if(this.url.status === 'hiding')
                return

            this.url.status = 'hiding'

            const rotationDirection = direction === LabArea.DIRECTION_NEXT ? - 1 : 1

            this.url.inner.rotation.x = 0
            gsap.to(this.url.inner.rotation, { x: Math.PI * rotationDirection, duration: 1, delay: 0.3, ease: 'power2.in', overwrite: true, onComplete: () =>
            {
                this.url.status = 'visible'

                gsap.to(this.url.inner.rotation, { x: Math.PI * 2 * rotationDirection, duration: 1, delay: 0, ease: 'back.out(2)', overwrite: true })

                this.url.textCanvas.updateText(this.navigation.current.url.replace(/https?:\/\//, ''))

                const ratio = this.url.textCanvas.getMeasure().width / this.texts.density
                this.url.panel.scale.x = ratio + 0.2

            } })
        }

        // Open
        this.url.open = () =>
        {
            if(this.navigation.current.url)
            {
                window.open(this.navigation.current.url, '_blank')
            }
        }
    }

    setScroller()
    {
        this.scroller = {}
        this.scroller.repeatAmplitude = 0.5444
        this.scroller.chainLeft = this.references.items.get('chainLeft')[0]
        this.scroller.chainRight = this.references.items.get('chainRight')[0]
        this.scroller.chainPulley = this.references.items.get('chainPulley')[0]
        this.scroller.gearA = this.references.items.get('gearA')[0]
        this.scroller.gearB = this.references.items.get('gearB')[0]
        this.scroller.gearC = this.references.items.get('gearC')[0]
        this.scroller.progress = 0
        this.scroller.offset = 0
        this.scroller.targetProgress = 0
        this.scroller.wheelSensitivity = 0.1
        this.scroller.easing = 3
        this.scroller.speed = 0

        // Vertical chain material
        {
            const material = new MeshDefaultMaterial({
                colorNode: color('#6f6a87'),
                alphaNode: positionWorld.y.step(4).oneMinus(),
                hasWater: false,
                hasLightBounce: false
            })
            
            this.scroller.chainLeft.material = material
            this.scroller.chainRight.material = material
        }
        
        // Pulley chain material
        {
            const material = new MeshDefaultMaterial({
                colorNode: color('#6f6a87'),
                alphaNode: positionWorld.y.step(4),
                hasWater: false,
                hasLightBounce: false
            })

            this.scroller.chainPulley.material = material
        }

        // Minis
        {
            const groupTemplate = this.references.items.get('mini')[0]
            const parent = groupTemplate.parent
            groupTemplate.removeFromParent()
            
            this.scroller.minis = {}
            this.scroller.minis.inter = 0.9
            this.scroller.minis.items = []
            this.scroller.minis.total = labData.length * this.scroller.minis.inter
            this.scroller.minis.current = null
            this.scroller.minis.width = 1920 / 8
            this.scroller.minis.height = 1080 / 8

            let i = 0
            for(const project of labData)
            {
                const mini = {}
                mini.index = i
                mini.y = - i * this.scroller.minis.inter
                this.scroller.minis.items.push(mini)

                // Group
                mini.group = groupTemplate.clone(true)
                mini.group.position.y = mini.y
                mini.group.visible = true
                parent.add(mini.group)

                // Elements
                let imageMesh = null
                let textMesh = null
                let panelMesh = null
                let intersectMesh = null

                for(const child of mini.group.children)
                {
                    if(child.name.startsWith('image'))
                        imageMesh = child
                    if(child.name.startsWith('text'))
                        textMesh = child
                    if(child.name.startsWith('panel'))
                        panelMesh = child
                    if(child.name.startsWith('intersect'))
                        intersectMesh = child
                }

                // Image
                {
                    imageMesh.visible = false

                    // Load
                    mini.startedLoading = false
                    mini.startLoading = () =>
                    {
                        if(mini.startedLoading)
                            return

                        mini.startedLoading = true

                        const loadedTexture = createLabGraphicTexture(project.title, true)
                        const alpha = uniform(0)
                        const textureColor = texture(loadedTexture).rgb
                        gsap.to(alpha, { value: 1, duration: 1, overwrite: true })

                        const material = new MeshDefaultMaterial({
                            colorNode: textureColor,
                            hasWater: false,
                            hasLightBounce: false,
                            transparent: true
                        })

                        const baseOutput = material.outputNode
                        
                        material.outputNode = Fn(() =>
                        {
                            return vec4(
                                mix(
                                    baseOutput.rgb,
                                    textureColor,
                                    this.shadeMix.images.mixUniform
                                ),
                                alpha
                            )
                        })()

                        imageMesh.material = material
                        imageMesh.visible = true
                    }
                }

                // Text
                {
                    mini.textMixStrength = uniform(0)

                    const textCanvas = new TextCanvas(
                        this.texts.fontFamily,
                        this.texts.fontWeight,
                        this.texts.fontSizeMultiplier * 0.18,
                        1.5,
                        0.2,
                        this.texts.density,
                        'center',
                        0.2
                    )
                    textCanvas.updateText(project.title)

                    const ratio = textCanvas.getMeasure().width / this.texts.density
                    panelMesh.scale.x = ratio + 0.2

                    // Material
                    const material = new MeshDefaultMaterial({
                        colorNode: this.texts.baseColor,
                        hasWater: false,
                        hasLightBounce: false,
                        alphaNode: texture(textCanvas.texture).r,
                        transparent: true
                    })
                    
                    const baseOutput = material.outputNode
                    
                    material.outputNode = Fn(() =>
                    {
                        return vec4(
                            mix(
                                mix(
                                    baseOutput.rgb,
                                    this.texts.baseColor,
                                    this.shadeMix.texts.mixUniform
                                ),
                                this.texts.baseColor.mul(1.5),
                                mini.textMixStrength
                            ),
                            baseOutput.a
                        )
                    })()

                    // Mesh
                    textMesh.castShadow = false
                    textMesh.receiveShadow = false
                    textMesh.material = material
                }

                // Intersect
                intersectMesh.visible = false      
                mini.intersect = this.game.rayCursor.addIntersect({
                    active: false,
                    shape: intersectMesh,
                    onClick: () =>
                    {
                        this.changeProject(mini.index)
                    },
                    onEnter: () =>
                    {
                        mini.textMixStrength.value = 1
                    },
                    onLeave: () =>
                    {
                        if(mini.index === this.navigation.index)
                            mini.textMixStrength.value = 1
                        else
                            mini.textMixStrength.value = 0
                    }
                })

                i++
            }
        }

        this.scroller.gearA.rotation.reorder('YXZ')
        this.scroller.gearB.rotation.reorder('YXZ')
        this.scroller.gearC.rotation.reorder('YXZ')

        this.scroller.animate = () =>
        {
            const delta = (this.scroller.targetProgress - this.scroller.progress) * this.game.ticker.deltaScaled * this.scroller.easing
            this.scroller.progress += delta
            this.scroller.offset = this.scroller.progress * this.scroller.minis.inter

            this.scroller.speed = delta / this.game.ticker.delta

            this.scroller.chainLeft.position.y = - this.scroller.repeatAmplitude * 0.5 - this.scroller.offset % this.scroller.repeatAmplitude
            this.scroller.chainRight.position.y = - this.scroller.repeatAmplitude * 0.5 + (this.scroller.offset % this.scroller.repeatAmplitude)
            this.scroller.chainPulley.rotation.z = this.scroller.offset * 1.4

            this.scroller.gearA.rotation.x = - this.scroller.offset * 1.4
            this.scroller.gearB.rotation.x = - this.scroller.gearA.rotation.x * (6 / 12)
            this.scroller.gearC.rotation.x = - this.scroller.gearB.rotation.x * (6 / 12)

            for(const mini of this.scroller.minis.items)
            {
                mini.group.position.y = safeMod(mini.y - this.scroller.offset, this.scroller.minis.total) - 1

                const scale = remapClamp(mini.group.position.y, 3.3, 3.9, 1, 0)
                mini.group.scale.y = scale

                mini.group.visible = scale > 0
                mini.intersect.active = mini.group.visible && (this.state === LabArea.STATE_OPEN || this.state === LabArea.STATE_OPENING)

                if(mini.group.visible && !mini.startedLoading)
                {
                    mini.startLoading()
                }
            }
        }

        this.scroller.update = () =>
        {
            // Scroll
            const centeringOffset = labData.length - 3.25
            const closestProgress = Math.round((this.scroller.progress + this.navigation.index - centeringOffset) / labData.length) * labData.length - this.navigation.index + centeringOffset
            this.scroller.targetProgress = closestProgress

            // Active text
            if(this.scroller.minis.current)
                this.scroller.minis.current.textMixStrength.value = 0

            const mini = this.scroller.minis.items[this.navigation.index]
            mini.textMixStrength.value = 1
            this.scroller.minis.current = mini
        }

        // Inputs
        this.game.inputs.addActions([
            { name: 'labScroll', categories: [ 'cinematic' ], keys: [ 'Wheel.roll' ] }
        ])

        this.game.inputs.events.on('labScroll', (action) =>
        {
            this.scroller.targetProgress -= action.value * this.scroller.wheelSensitivity
        })
    }

    setPendulum()
    {
        this.references.items.get('balls')[0].rotation.reorder('YXZ')
        const timeline0 = gsap.timeline({ yoyo: true, repeat: -1 })
        timeline0.to(this.references.items.get('balls')[0].rotation, { x: 0.75, ease: 'power2.out', delay: 0.75, duration: 0.75 })
        
        const timeline1 = gsap.timeline({ yoyo: true, repeat: -1, delay: 1.5 })
        timeline1.to(this.references.items.get('balls')[1].rotation, { x: -0.75, ease: 'power2.out', delay: 0.75, duration: 0.75 })
    }

    setBlackBoard()
    {
        this.blackBoard = {}
        this.blackBoard.active = true
        this.blackBoard.group = this.references.items.get('blackBoard')[0]
        this.blackBoard.parent = this.blackBoard.group.parent

        // Jump timeline
        this.blackBoard.timeline = gsap.timeline({
            repeat: -1,
            repeatDelay: 5,
            paused: true,
            onRepeat: () =>
            {
                if(this.state === LabArea.STATE_CLOSED || this.state === LabArea.STATE_CLOSING || !this.blackBoard.active)
                    this.blackBoard.timeline.pause()
            }
        })

        this.blackBoard.timeline.to(this.blackBoard.group.position, { y: 0.25, ease: 'power2.out', duration: 0.7 }, 0 + 2)
        this.blackBoard.timeline.to(this.blackBoard.group.position, { y: 0, ease: 'power2.in', duration: 0.7 }, 0.7 + 2)

        this.blackBoard.timeline.to(this.blackBoard.group.rotation, { x: 0.1, duration: 0.15 }, 0 + 2)
        this.blackBoard.timeline.to(this.blackBoard.group.rotation, { x: -0.1, duration: 0.3 }, 0.15 + 2)
        this.blackBoard.timeline.to(this.blackBoard.group.rotation, { x: 0.1, duration: 0.3 }, 0.45 + 2)
        this.blackBoard.timeline.to(this.blackBoard.group.rotation, { x: -0.1, duration: 0.3 }, 0.75 + 2)
        this.blackBoard.timeline.to(this.blackBoard.group.rotation, { x: 0, duration: 0.3 }, 1.05 + 2)

        // Labels
        this.blackBoard.labelsGamepadPlaystation = this.references.items.get('blackboardLabelsGamepadPlaystation')[0]
        this.blackBoard.labelsGamepadXbox = this.references.items.get('blackboardLabelsGamepadXbox')[0]
        this.blackBoard.labelsMouseKeyboard = this.references.items.get('blackboardLabelsMouseKeyboard')[0]
        this.blackBoard.labelsGamepadPlaystation.castShadow = false
        this.blackBoard.labelsGamepadXbox.castShadow = false
        this.blackBoard.labelsMouseKeyboard.castShadow = false
        this.blackBoard.labelsGamepadPlaystation.visible = false
        this.blackBoard.labelsGamepadXbox.visible = false
        
        this.game.inputs.events.on('modeChange', () =>
        {
            if(this.game.inputs.mode === Inputs.MODE_GAMEPAD)
            {
                if(this.game.inputs.gamepad.type === 'xbox')
                {
                    this.blackBoard.labelsGamepadXbox.visible = true
                    this.blackBoard.labelsGamepadPlaystation.visible = false
                }
                else
                {
                    this.blackBoard.labelsGamepadXbox.visible = false
                    this.blackBoard.labelsGamepadPlaystation.visible = true
                }
                this.blackBoard.labelsMouseKeyboard.visible = false

                this.blackBoard.parent.add(this.blackBoard.group)
            }
            else if(this.game.inputs.mode === Inputs.MODE_MOUSEKEYBOARD)
            {
                this.blackBoard.labelsGamepadXbox.visible = false
                this.blackBoard.labelsGamepadPlaystation.visible = false
                this.blackBoard.labelsMouseKeyboard.visible = true
                this.blackBoard.parent.add(this.blackBoard.group)
            }
            else if(this.game.inputs.mode === Inputs.MODE_TOUCH)
            {
                this.blackBoard.parent.remove(this.blackBoard.group)
            }
        })

        this.game.inputs.gamepad.events.on('typeChange', () =>
        {
            if(this.game.inputs.mode === Inputs.MODE_GAMEPAD)
            {
                if(this.game.inputs.gamepad.type === 'xbox')
                {
                    this.blackBoard.labelsGamepadXbox.visible = true
                    this.blackBoard.labelsGamepadPlaystation.visible = false
                }
                else
                {
                    this.blackBoard.labelsGamepadXbox.visible = false
                    this.blackBoard.labelsGamepadPlaystation.visible = true
                }
            }
        })
    }

    setCandleFlames()
    {
        const meshes = this.references.items.get('candleFlame')

        const baseMaterial = this.game.materials.getFromName('emissiveOrangeRadialGradient')
        const material = new THREE.MeshBasicNodeMaterial({ transparent: true })
        material.outputNode = baseMaterial.outputNode
        material.positionNode = Fn(() =>
        {
            const newPosition = positionGeometry.toVar()

            const wave = sin(this.game.ticker.elapsedScaledUniform.mul(0.3).add(uv().y.mul(3)))
            const strength = uv().y.oneMinus().pow(2).mul(0.06)
            newPosition.x.addAssign(wave.mul(strength))

            return newPosition
        })()

        for(const mesh of meshes)
        {
            mesh.scale.setScalar(0)
            mesh.visible = false

            mesh.material = material
        }

        this.game.dayCycles.events.on('night', (inInterval) =>
        {
            if(inInterval)
            {
                for(const mesh of meshes)
                {
                    mesh.visible = true
                    gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 10, ease: 'power1.out', overwrite: true })
                }
            }
            else
            {
                for(const mesh of meshes)
                {
                    gsap.to(mesh.scale, { x: 0, y: 0, z: 0, duration: 10, ease: 'power1.in', overwrite: true, onComplete: () =>
                    {
                        mesh.visible = false
                    } })
                }
            }
        })
    }

    setCauldron()
    {
        this.cauldron = {}

        // Heat
        {
            const material = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide, transparent: true, depthTest: true, depthWrite: false })

            material.outputNode = Fn(() =>
            {
                const noiseUv = uv().mul(vec2(2, 0.2))
                noiseUv.y.addAssign(this.game.ticker.elapsedScaledUniform.mul(0.05))
                const noise = texture(this.game.noises.perlin, noiseUv).r

                const strength = noise.mul(uv().y.pow(2))

                const emissiveMix = strength.smoothstep(0, 1)
                const emissiveColor = mix(color('#ff3e00'), color('#ff8641'), emissiveMix).mul(strength.add(1).mul(2))

                return vec4(vec3(emissiveColor), strength)
            })()

            this.cauldron.heat = this.references.items.get('heat')[0]
            this.cauldron.heat.material = material
            this.cauldron.heat.castShadow = false
        }

        // Burning wood
        {
            const baseMaterial = this.game.materials.getFromName('palette')
            const material = baseMaterial.clone()
            
            const colorA = uniform(color('#ff6b2b'))
            const colorB = uniform(color('#ff4100'))
            const intensity = uniform(1.25)
    
            const baseOutput = baseMaterial.outputNode
            material.outputNode = Fn(() =>
            {
                const baseUv = uv(1).toVar()
    
                const emissiveColor = mix(colorA, colorB, baseUv.sub(0.5).length().mul(2))
                const emissiveOutput = emissiveColor.div(luminance(emissiveColor)).mul(intensity)
    
                const mixStrength = baseUv.sub(0.5).length().mul(2).pow2()
                const output = mix(baseOutput.rgb, emissiveOutput, mixStrength)
    
                // return vec4(vec3(mixStrength), 1)
                return vec4(output.rgb, 1)
            })()

            this.cauldron.wood = this.references.items.get('wood')[0]
            this.cauldron.wood.material = material
            
            if(this.game.debug.active)
            {
                const debugPanel = this.debugPanel.addFolder({
                    title: 'burning wood',
                    expanded: false,
                })
                this.game.debug.addThreeColorBinding(debugPanel, colorA.value, 'colorA')
                this.game.debug.addThreeColorBinding(debugPanel, colorB.value, 'colorB')
            }
        }

        // Liquid
        {
            this.cauldron.liquid = {}
            
            const colorA = uniform(color('#ff0083'))
            const colorB = uniform(color('#3018eb'))
            const intensity = uniform(1.7)
    
            const material = new THREE.MeshBasicNodeMaterial({ transparent: true })
            const mixedColor = mix(colorA, colorB, uv().sub(0.5).length().mul(2))
            material.colorNode = mixedColor.div(luminance(mixedColor)).mul(intensity)
            material.fog = false

            this.cauldron.liquid.surface = this.references.items.get('liquid')[0]
            this.cauldron.liquid.surface.material = material

            if(this.game.debug.active)
            {
                const debugPanel = this.debugPanel.addFolder({
                    title: 'cauldron',
                    expanded: false,
                })
                this.game.debug.addThreeColorBinding(debugPanel, colorA.value, 'colorA')
                this.game.debug.addThreeColorBinding(debugPanel, colorB.value, 'colorB')
            }
        }
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'lab')
        })
    }

    open()
    {
        if(this.state === LabArea.STATE_OPEN || this.state === LabArea.STATE_OPENING)
            return

        // State
        this.state = LabArea.STATE_OPENING

        if(this.stateTransition)
            this.stateTransition.kill()

        this.stateTransition = gsap.delayedCall(1.5, () =>
        {
            this.state = LabArea.STATE_OPEN
            this.stateTransition = null
        })

        // Inputs filters
        this.game.inputs.filters.delete('wandering')
        this.game.inputs.filters.add('cinematic')

        // View cinematic
        this.game.view.cinematic.start(this.cinematic.position, this.cinematic.target)

        // Interactive point
        this.game.interactivePoints.temporaryHide()

        // Shade mix
        gsap.to(this.shadeMix.images.mixUniform, { value: this.shadeMix.images.max, duration: 2, ease: 'power2.inOut', overwrite: true })
        gsap.to(this.shadeMix.texts.mixUniform, { value: this.shadeMix.texts.max, duration: 2, ease: 'power2.inOut', overwrite: true })

        // Board
        if(this.blackBoard.active)
        {
            this.blackBoard.timeline.repeat(-1)
            this.blackBoard.timeline.resume()
        }

        // Cursor
        this.adjacents.nextIntersect.active = true
        this.adjacents.previousIntersect.active = true
        this.url.intersect.active = true

        // Deactivate physical vehicle
        this.game.physicalVehicle.deactivate()

        // Buttons
        this.game.inputs.interactiveButtons.clearItems()
        this.game.inputs.interactiveButtons.addItems(['previous', 'next', 'open', 'close'])

        // Sound
        const sound = this.game.audio.groups.get('click')
        if(sound)
            sound.play(true)

        // Achievement
        this.game.achievements.setProgress('lab', this.navigation.current.title)
    }

    close()
    {
        if(this.state === LabArea.STATE_CLOSED || this.state === LabArea.STATE_CLOSING)
            return

        // State
        this.state = LabArea.STATE_CLOSING

        if(this.stateTransition)
            this.stateTransition.kill()

        this.stateTransition = gsap.delayedCall(1.5, () =>
        {
            this.state = LabArea.STATE_CLOSED
            this.stateTransition = null
        })

        // Input filters
        this.game.inputs.filters.delete('cinematic')
        this.game.inputs.filters.add('wandering')

        // View cinematic
        this.game.view.cinematic.end()

        // Shade mix
        gsap.to(this.shadeMix.images.mixUniform, { value: this.shadeMix.images.min, duration: 1.5, ease: 'power2.inOut', overwrite: true })
        gsap.to(this.shadeMix.texts.mixUniform, { value: this.shadeMix.texts.min, duration: 1.5, ease: 'power2.inOut', overwrite: true })

        // Interactive point
        gsap.delayedCall(1, () =>
        {
            this.game.interactivePoints.recover()
        })

        // Cursor
        this.adjacents.nextIntersect.active = false
        this.adjacents.previousIntersect.active = false
        this.url.intersect.active = false

        // Activate physical vehicle
        this.game.physicalVehicle.activate()
            
        // Buttons
        this.game.inputs.interactiveButtons.clearItems()

        // Sound
        const sound = this.game.audio.groups.get('click')
        if(sound)
            sound.play(false)
    }

    previous()
    {
        if(this.state === LabArea.STATE_CLOSED || this.state === LabArea.STATE_CLOSING)
            return

        this.changeProject(this.navigation.index - 1, LabArea.DIRECTION_PREVIOUS)

        this.blackBoard.active = false
    }

    next()
    {
        if(this.state === LabArea.STATE_CLOSED || this.state === LabArea.STATE_CLOSING)
            return

        this.changeProject(this.navigation.index + 1, LabArea.DIRECTION_NEXT)

        this.blackBoard.active = false
    }

    changeProject(index = 0, direction = null, silent = false)
    {
        // Loop index
        let loopIndex = index

        if(loopIndex > labData.length - 1)
            loopIndex = 0
        else if(loopIndex < 0)
            loopIndex = labData.length - 1

        // Already active
        if(this.navigation.index === loopIndex)
            return

        // Direction
        if(direction === null)
            direction = signedModDelta(loopIndex, this.navigation.index, labData.length) > 0 ? LabArea.DIRECTION_PREVIOUS : LabArea.DIRECTION_NEXT

        // Save
        this.navigation.index = loopIndex
        this.navigation.current = labData[this.navigation.index]
        this.navigation.previous = labData[(this.navigation.index - 1) < 0 ? labData.length - 1 : this.navigation.index - 1]
        this.navigation.next = labData[(this.navigation.index + 1) % labData.length]
        this.navigation.direction = direction

        // Update components
        this.title.update(direction)
        this.url.update(direction)
        this.images.update()

        // Scroller
        this.scroller.update(this.navigation.index)

        // Sounds
        if(!silent)
        {
            this.game.audio.groups.get('click').play()
            this.game.audio.groups.get('slide').play()
            this.game.audio.groups.get('assemble').play()
        }

        // Achievements
        if(this.state === LabArea.STATE_OPEN)
            this.game.achievements.setProgress('lab', this.navigation.current.title)
    }

    update()
    {
        if(this.state !== LabArea.STATE_CLOSED)
        {
            this.scroller.animate()
        }
    }
}