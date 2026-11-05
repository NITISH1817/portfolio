import React, { useState } from 'react';
import Loading from './components/ui/Loading';
import BrunoPortfolio from './components/bruno/BrunoPortfolio';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 text-slate-100">
      {!isLoaded && <Loading onComplete={() => setIsLoaded(true)} />}
      {isLoaded && <BrunoPortfolio />}
    </div>
  );
}
