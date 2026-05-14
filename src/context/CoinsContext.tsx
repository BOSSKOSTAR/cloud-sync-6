import { createContext, useContext, useState, ReactNode } from "react";

interface CoinsContextType {
  coins: number;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => boolean;
}

const CoinsContext = createContext<CoinsContextType | null>(null);

export function CoinsProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem("casino_coins");
    return saved ? parseInt(saved) : 1000;
  });

  const addCoins = (amount: number) => {
    setCoins((prev) => {
      const next = prev + amount;
      localStorage.setItem("casino_coins", String(next));
      return next;
    });
  };

  const removeCoins = (amount: number): boolean => {
    if (coins < amount) return false;
    setCoins((prev) => {
      const next = prev - amount;
      localStorage.setItem("casino_coins", String(next));
      return next;
    });
    return true;
  };

  return (
    <CoinsContext.Provider value={{ coins, addCoins, removeCoins }}>
      {children}
    </CoinsContext.Provider>
  );
}

export function useCoins() {
  const ctx = useContext(CoinsContext);
  if (!ctx) throw new Error("useCoins must be used within CoinsProvider");
  return ctx;
}

export default CoinsContext;
