import React, { createContext, useContext, useState, useEffect } from 'react';

interface BalanceContextType {
  totalBalance: number;
  mainBalance: number;
  updateBalances: (amount: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const [totalBalance, setTotalBalance] = useState(100);
  const [mainBalance, setMainBalance] = useState(100);

  const updateBalances = (amount: number) => {
    setTotalBalance(prev => Math.max(0, prev - amount));
    setMainBalance(prev => Math.max(0, prev - amount));
  };

  return (
    <BalanceContext.Provider
      value={{
        totalBalance,
        mainBalance,
        updateBalances
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}