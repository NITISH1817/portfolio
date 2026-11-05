export interface VehicleInputs {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  handbrake: boolean;
  boost: boolean;
  horn: boolean;
}

export const vehicleInputs: VehicleInputs = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  brake: false,
  handbrake: false,
  boost: false,
  horn: false
};

export function useVehicleController() {
  if (typeof window === 'undefined') return;

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore inputs if user is typing in a form input or textarea
    const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        vehicleInputs.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        vehicleInputs.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        vehicleInputs.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        vehicleInputs.right = true;
        break;
      case 'Space':
        vehicleInputs.handbrake = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        vehicleInputs.boost = true;
        break;
      case 'KeyH':
        vehicleInputs.horn = true;
        break;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        vehicleInputs.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        vehicleInputs.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        vehicleInputs.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        vehicleInputs.right = false;
        break;
      case 'Space':
        vehicleInputs.handbrake = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        vehicleInputs.boost = false;
        break;
      case 'KeyH':
        vehicleInputs.horn = false;
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}

