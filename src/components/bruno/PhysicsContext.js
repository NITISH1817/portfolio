import React, { createContext, useContext } from 'react';

export const PhysicsContext = createContext(null);

export const usePhysics = () => {
  const context = useContext(PhysicsContext);
  if (!context) {
    throw new Error('usePhysics must be used within a PhysicsProvider');
  }
  return context;
};

