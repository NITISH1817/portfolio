import React, { useEffect, useRef } from 'react';
import { carAudio } from './CarAudio';
import { useGameStore } from '../../store/gameStore';

export interface VehicleInputs {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  reset: boolean;
  horn: boolean;
  nitro: boolean;
  headlights: boolean;
}

// Global authoritative input state using pure references to prevent any React re-renders
export const vehicleInputs: VehicleInputs = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  brake: false,
  reset: false,
  horn: false,
  nitro: false,
  headlights: true
};

export const useVehicleController = () => {
  const inputsRef = useRef<VehicleInputs>(vehicleInputs);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keystrokes when typing in text inputs or textareas, or when a modal is open
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);
      const isModalOpen = Boolean(document.querySelector('[data-modal-active="true"]'));

      if (isInput || (isModalOpen && e.code !== 'Escape')) {
        inputsRef.current.forward = false;
        inputsRef.current.backward = false;
        inputsRef.current.left = false;
        inputsRef.current.right = false;
        inputsRef.current.brake = false;
        inputsRef.current.nitro = false;
        return;
      }

      const key = (e.key || '').toLowerCase();
      if (key === 'r' || e.code === 'KeyR') {
        inputsRef.current.reset = true;
        window.dispatchEvent(new CustomEvent('car-teleport', { detail: [0, 0, 0] }));
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          inputsRef.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          inputsRef.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          inputsRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          inputsRef.current.right = true;
          break;
        case 'Space':
          inputsRef.current.brake = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          inputsRef.current.nitro = true;
          break;
        case 'KeyL':
          inputsRef.current.headlights = !inputsRef.current.headlights;
          useGameStore.getState().toggleHeadlights();
          break;
        case 'KeyR':
          inputsRef.current.reset = true;
          break;
        case 'KeyH':
          inputsRef.current.horn = true;
          carAudio.playHorn();
          break;
        case 'KeyM':
          window.dispatchEvent(new CustomEvent('toggle-map'));
          break;
        case 'KeyE':
        case 'Enter':
          window.dispatchEvent(new CustomEvent('landmark-interact'));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = (e.key || '').toLowerCase();
      if (key === 'r' || e.code === 'KeyR') {
        inputsRef.current.reset = true;
        window.dispatchEvent(new CustomEvent('car-teleport', { detail: [0, 0, 0] }));
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          inputsRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          inputsRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          inputsRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          inputsRef.current.right = false;
          break;
        case 'Space':
          inputsRef.current.brake = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          inputsRef.current.nitro = false;
          break;
        case 'KeyR':
          inputsRef.current.reset = false;
          break;
        case 'KeyH':
          inputsRef.current.horn = false;
          break;
        default:
          break;
      }
    };

    // Mobile / Touch custom event triggers
    const onNitroStart = () => { inputsRef.current.nitro = true; };
    const onNitroEnd = () => { inputsRef.current.nitro = false; };
    const onBrakeStart = () => { inputsRef.current.brake = true; };
    const onBrakeEnd = () => { inputsRef.current.brake = false; };
    const onHornPress = () => {
      inputsRef.current.horn = true;
      carAudio.playHorn();
      setTimeout(() => { inputsRef.current.horn = false; }, 300);
    };
    const onHeadlightsToggle = () => {
      inputsRef.current.headlights = !inputsRef.current.headlights;
      useGameStore.getState().toggleHeadlights();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('nitro-start', onNitroStart);
    window.addEventListener('nitro-end', onNitroEnd);
    window.addEventListener('brake-start', onBrakeStart);
    window.addEventListener('brake-end', onBrakeEnd);
    window.addEventListener('horn-press', onHornPress);
    window.addEventListener('headlights-toggle', onHeadlightsToggle);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('nitro-start', onNitroStart);
      window.removeEventListener('nitro-end', onNitroEnd);
      window.removeEventListener('brake-start', onBrakeStart);
      window.removeEventListener('brake-end', onBrakeEnd);
      window.removeEventListener('horn-press', onHornPress);
      window.removeEventListener('headlights-toggle', onHeadlightsToggle);
    };
  }, []);

  return inputsRef;
};
