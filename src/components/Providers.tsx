import ChatsProvider from "@/contexts/chats";
import React from "react";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ChatsProvider>{children}</ChatsProvider>;
};

export default Providers;
