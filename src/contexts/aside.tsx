import { ReactNode, createContext, useState } from "react";

interface Props {
  asideContentNumber: ContentNumberType;
  setAsideContentNumber: (number: ContentNumberType) => void;
}

export type ContentNumberType = 0 | 1 | 2;

const initialValue: Props = {
  asideContentNumber: 0,
  setAsideContentNumber: () => {},
};

export const AsideCtx = createContext(initialValue);

export default function AsideProvider({ children }: { children: ReactNode }) {
  const [asideContentNumber, setAsideContentNumberState] =
    useState<ContentNumberType>(0);

  const setAsideContentNumber = (number: ContentNumberType) => {
    setAsideContentNumberState(() => number);
  };

  return (
    <AsideCtx.Provider
      value={{
        asideContentNumber,
        setAsideContentNumber,
      }}
    >
      {children}
    </AsideCtx.Provider>
  );
}
