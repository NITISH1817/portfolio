import { useState, useEffect, useRef } from 'react';

// Shared singleton state for touch and keyboard controls
export const controlsState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  brake: false,
  reset: false,
  horn: false,
  interact: false,
  steerValue: 0, // -1 to 1 for analog stick
  throttleValue: 0 // -1 to 1 for analog throttle
};

export const useCarControls = () => {
  const [controls, setControls] = useState({ ...controlsState });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controlsState.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controlsState.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controlsState.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controlsState.right = true;
          break;
        case 'Space':
          controlsState.brake = true;
          controlsState.horn = true;
          break;
        case 'KeyR':
          controlsState.reset = true;
          break;
        case 'KeyH':
          controlsState.horn = true;
          break;
        case 'KeyE':
        case 'Enter':
          window.dispatchEvent(new CustomEvent('landmark-interact'));
          break;
        default:
          break;
      }
      setControls({ ...controlsState });
    };

    const handleKeyUp = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controlsState.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controlsState.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controlsState.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controlsState.right = false;
          break;
        case 'Space':
          controlsState.brake = false;
          controlsState.horn = false;
          break;
        case 'KeyR':
          controlsState.reset = false;
          break;
        case 'KeyH':
          controlsState.horn = false;
          break;
        default:
          break;
      }
      setControls({ ...controlsState });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls;
};

