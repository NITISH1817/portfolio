import * as THREE from 'three/webgpu'
import { Cycles } from './Cycles.js'

const presets = {
    // Screenshot 2 Reference: Warm orange, peach and coral sunset lighting with soft ambient shadows
    day:   { revealColor: new THREE.Color('#FFB38A'), revealIntensity: 8, electricField: 0, temperature: 5, lightColor: new THREE.Color('#FFF0DE'), lightIntensity: 1.3, shadowColor: new THREE.Color('#685B7A'), fogColorA: new THREE.Color('#FDBB9B'), fogColorB: new THREE.Color('#FF9671'), fogNearRatio: 0.3, fogFarRatio: 1.55 },
    dusk:  { revealColor: new THREE.Color('#FFA678'), revealIntensity: 6.0, electricField: 0.15, temperature: 0, lightColor: new THREE.Color('#FFBE98'), lightIntensity: 1.35, shadowColor: new THREE.Color('#6E4A58'), fogColorA: new THREE.Color('#FFA882'), fogColorB: new THREE.Color('#FF805E'), fogNearRatio: 0.25, fogFarRatio: 1.5 },
    night: { revealColor: new THREE.Color('#9B7DF5'), revealIntensity: 8, electricField: 0.9, temperature: -7.5, lightColor: new THREE.Color('#4650D8'), lightIntensity: 3.2, shadowColor: new THREE.Color('#241550'), fogColorA: new THREE.Color('#141C48'), fogColorB: new THREE.Color('#2C103C'), fogNearRatio: -0.6, fogFarRatio: 1.1 },
    dawn:  { revealColor: new THREE.Color('#FF9F8A'), revealIntensity: 5.5, electricField: 0.2, temperature: 0, lightColor: new THREE.Color('#FFD0BA'), lightIntensity: 1.25, shadowColor: new THREE.Color('#78455A'), fogColorA: new THREE.Color('#FFAB95'), fogColorB: new THREE.Color('#FF8C5A'), fogNearRatio: 0.28, fogFarRatio: 1.45 },
}

export class DayCycles extends Cycles
{
    constructor()
    {
        const forcedProgress = import.meta.env.VITE_DAY_CYCLE_PROGRESS ? parseFloat(import.meta.env.VITE_DAY_CYCLE_PROGRESS) : null
        super('🕜 Day Cycles', 4 * 60, forcedProgress, false)
    }

    get presets()
    {
        return presets
    }

    getKeyframesDescriptions()
    {
        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel.addBinding(this, 'duration', { min: 1, max: 60 * 10, step: 1 })

            for(const presetKey in presets)
            {
                const preset = presets[presetKey]
                const presetsDebugPanel = this.debugPanel.addFolder({
                    title: presetKey,
                    expanded: true,
                })

                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.revealColor, 'revealColor')
                presetsDebugPanel.addBinding(preset, 'revealIntensity', { min: 0, max: 20, step: 0.001 })
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.lightColor, 'lightColor')
                presetsDebugPanel.addBinding(preset, 'lightIntensity', { min: 0, max: 20 })
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.shadowColor, 'shadowColor')
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.fogColorA, 'fogColorA')
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.fogColorB, 'fogColorB')
                presetsDebugPanel.addBinding(preset, 'fogNearRatio', { label: 'near', min: -2, max: 2, step: 0.001 })
                presetsDebugPanel.addBinding(preset, 'fogFarRatio', { label: 'far', min: -2, max: 2, step: 0.001 })
            }
        }

        return [
            [
                { properties: presets.day, stop: 0.0 }, // day
                { properties: presets.day, stop: 0.15 }, // day
                { properties: presets.dusk, stop: 0.25 }, // Dusk
                { properties: presets.night, stop: 0.35 }, // Night
                { properties: presets.night, stop: 0.6 }, // Night
                { properties: presets.dawn, stop: 0.8 }, // Dawn
                { properties: presets.day, stop: 0.9 }, // day
            ]
        ]
    }

    getIntervalDescriptions()
    {
        return [
            { name: 'night', start: 0.25, end: 0.7 },
            { name: 'deepNight', start: 0.35, end: 0.6 },
        ]
    }
}