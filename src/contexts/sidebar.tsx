import { ReactNode, createContext, useState } from "react";

interface Props {
  newGroupChatArea: boolean;
  newPrivateChatArea: boolean;
  setNewGroupChatArea: (value: boolean) => void;
  setNewPrivateChatArea: (value: boolean) => void;
}

const initialValue: Props = {
  newGroupChatArea: false,
  newPrivateChatArea: false,
  setNewGroupChatArea: (value: boolean) => {},
  setNewPrivateChatArea: (value: boolean) => {},
};

export const SidebarCtx = createContext(initialValue);

export default function SidebarProvider({ children }: { children: ReactNode }) {
  const [newGroupChatArea, setNewGroupChatAreaState] = useState(false);
  const [newPrivateChatArea, setNewPrivateChatAreaState] = useState(false);

  const setNewGroupChatArea = (value: boolean) => {
    setNewGroupChatAreaState(() => value);
  };

  const setNewPrivateChatArea = (value: boolean) => {
    setNewPrivateChatAreaState(() => value);
  };

  return (
    <SidebarCtx.Provider
      value={{
        newGroupChatArea,
        newPrivateChatArea,
        setNewGroupChatArea,
        setNewPrivateChatArea,
      }}
    >
      {children}
    </SidebarCtx.Provider>
  );
}
