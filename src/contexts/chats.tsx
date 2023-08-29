"use client";
import { db } from "@/services/firebase";
import { ReactNode, createContext, useEffect, useState } from "react";
import * as firebase from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { Chat } from "@/types/chat";
import ChatService from "@/services/chat";
import FirebaseApi from "@/services/firebaseApi";

type HeaderDataType =
  | [firebase.DocumentReference, firebase.DocumentReference]
  | null;

interface ChatsProvider {
  chats: Chat[] | [];
  currentChat: Chat | null;
  isLoading: boolean;
  setCurrentChat: (chat: Chat | null) => void;
  headerData: HeaderDataType;
  setHeaderData: (data: HeaderDataType | null) => void;
  service: ChatService;
}

const service = new ChatService(new FirebaseApi());

export const ChatsCtx = createContext<ChatsProvider>({
  chats: [],
  currentChat: null,
  isLoading: true,
  setCurrentChat: () => null,
  headerData: null,
  setHeaderData: () => null,
  service: service,
});

export default function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[] | []>([]);
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
  const [headerData, setHeaderDataState] = useState<HeaderDataType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  const setCurrentChat = (chat: Chat | null) => {
    setCurrentChatState(() => chat);
  };

  const setHeaderData = (data: HeaderDataType | null) => {
    setHeaderDataState(() => data);
  };

  useEffect(() => {
    if (auth.currentUser === null) {
      router.push("/login");
      return;
    }

    let { displayName, email, photoURL } = auth.currentUser;

    if (!email) return console.error("Email must not be null");

    const handleBeforeUnload = () => {
      if (!email) return;
      
      service.createOrUpdateUser(
        {
          email: email,
          online: false,
          lastTimeOnline: new Date(),
        },
        true
      );
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    service.createOrUpdateUser({
      displayName: displayName || undefined,
      email,
      photoURL: photoURL || undefined,
      online: true,
      lastTimeOnline: new Date(),
    });

    const q = firebase.query(
      firebase.collection(db, "chat"),
      firebase.where("members", "array-contains", email)
    );

    const unsubscribe = firebase.onSnapshot(q, (querySnapshot) => {
      const chatDatas: any[] = [];
      querySnapshot.forEach((doc) => {
        chatDatas.push({ id: doc.id, ...doc.data() });
      });
      console.log(chatDatas);
      setChats(() => chatDatas);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [auth, router]);

  return (
    <ChatsCtx.Provider
      value={{
        chats,
        currentChat,
        isLoading,
        setCurrentChat,
        headerData,
        setHeaderData,
        service,
      }}
    >
      {children}
    </ChatsCtx.Provider>
  );
}
