"use client";
import { ReactNode, createContext, useState } from "react";
import { useQuery } from "react-query";

interface ChatsProvider {
  chats: Chat[] | [];
  isLoading: boolean;
}

export const ChatsCtx = createContext<ChatsProvider>({
  chats: [],
  isLoading: true,
});

export default function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[] | []>([]);

  const fetchChats = async () => {
    const res = await fetch("http://localhost:3000/api/chats");
    const data = await res.json();
    setChats(data);
  };

  const { isLoading } = useQuery({ queryKey: ["chats"], queryFn: fetchChats });

  return (
    <ChatsCtx.Provider value={{ chats, isLoading }}>
      {children}
    </ChatsCtx.Provider>
  );
}
