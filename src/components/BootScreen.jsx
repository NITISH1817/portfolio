import React, { useEffect } from 'react';

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    // Automatically complete the boot sequence after a short delay
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 500); // 500ms delay for a quick transition

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      color: '#fff',
      zIndex: 9999
    }}>
      <h2>Loading...</h2>
    </div>
  );
};

export default BootScreen;
