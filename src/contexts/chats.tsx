"use client";
import { db } from "@/services/firebase";
import { ReactNode, createContext, useEffect, useState } from "react";
import { collection, where, onSnapshot, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

interface ChatsProvider {
  chats: ChatBox[] | [];
  currentChatIndex: number | null;
  isLoading: boolean;
  setCurrentChatIndexState: (index: number) => void,
}

export const ChatsCtx = createContext<ChatsProvider>({
  chats: [],
  currentChatIndex: null,
  isLoading: true,
  setCurrentChatIndexState: (index: number) => null,
});

export default function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatBox[] | []>([]);
  const [currentChatIndex, setCurrentChatIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  const setCurrentChatIndexState = (index: number) => {
    setCurrentChatIndex(() => index);
  };

  useEffect(() => {

    if (auth.currentUser === null) {
      router.push("/login");
      return;
    }

    // console.log(auth.currentUser);

    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", {
        email: "victorh.almeida7@gmail.com",
        name: "Victor Hugo Pro",
      })
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: any[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      // console.log(messages);
      setChats(() => messages);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [auth, router]);

  return (
    <ChatsCtx.Provider value={{ chats, currentChatIndex, isLoading, setCurrentChatIndexState }}>
      {children}
    </ChatsCtx.Provider>
  );
}
