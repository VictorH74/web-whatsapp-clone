"use client";
import { db } from "@/services/firebase";
import { ReactNode, createContext, useEffect, useState } from "react";
import {
  collection,
  where,
  onSnapshot,
  query,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

interface ChatsProvider {
  chats: ChatBox[] | [];
  currentChatIndex: number | null;
  isLoading: boolean;
  setCurrentChatIndexState: (index: number | null) => void;
}

export const ChatsCtx = createContext<ChatsProvider>({
  chats: [],
  currentChatIndex: null,
  isLoading: true,
  setCurrentChatIndexState: (index: number | null) => null,
});

export default function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatBox[] | []>([]);
  const [currentChatIndex, setCurrentChatIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  const setCurrentChatIndexState = (index: number | null) => {
    setCurrentChatIndex(() => index);
  };

  useEffect(() => {
    if (auth.currentUser === null) {
      router.push("/login");
      return;
    }

    let { displayName, email, photoURL } = auth.currentUser;

    let ref = doc(db, "users", email as string);

    setDoc(ref, {
      name: displayName,
      createdAt: Timestamp.fromDate(new Date()),
      email,
      photoUrl: photoURL,
    });

    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", { email, name: displayName })
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatDatas: any[] = [];
      querySnapshot.forEach((doc) => {
        chatDatas.push({ id: doc.id, ...doc.data() });
      });
      setChats(() => chatDatas);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [auth, router]);

  return (
    <ChatsCtx.Provider
      value={{ chats, currentChatIndex, isLoading, setCurrentChatIndexState }}
    >
      {children}
    </ChatsCtx.Provider>
  );
}
