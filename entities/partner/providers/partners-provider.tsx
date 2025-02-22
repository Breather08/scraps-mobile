import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Partner } from "../types";

interface PartnersContextType {
  partner: Partner | null;
  setPartner: Dispatch<SetStateAction<Partner | null>>;
}

export const PartnersContext = createContext<PartnersContextType>({
  partner: null,
  setPartner: () => {},
});

export function PartnersProvider({ children }: { children: React.ReactNode }) {
  const [partner, setPartner] = useState<Partner | null>(null);

  return (
    <PartnersContext.Provider value={{ partner, setPartner }}>
      {children}
    </PartnersContext.Provider>
  );
}

export const usePartner = (): PartnersContextType => {
  const ctx = useContext(PartnersContext);
  if (!ctx) {
    throw new Error("usePartner must be used within PartnersProvider");
  }

  return ctx;
};
