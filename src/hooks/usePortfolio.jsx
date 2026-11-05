import React, { createContext, useContext, useState } from 'react';

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [evidenceMode, setEvidenceMode] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [activeTech, setActiveTech] = useState(null); // For technology cross-linking

  return (
    <PortfolioContext.Provider value={{
      evidenceMode, setEvidenceMode,
      recruiterMode, setRecruiterMode,
      activeTech, setActiveTech
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
