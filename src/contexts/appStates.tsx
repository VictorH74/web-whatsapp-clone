/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { db } from "@/services/firebase";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as fs from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { Chat } from "@/types/chat";
import ChatService from "@/services/chat";
import FirebaseApi from "@/services/firebaseApi";
import { User } from "@/types/user";

type HeaderDataType = [fs.DocumentReference, fs.DocumentReference] | null;
type UsersObjType = Record<string, User>;

interface AppStatesProviderI {
  chats: Chat[];
  users: UsersObjType;
  currentChat: Chat | null;
  isLoading: boolean;
  setCurrentChat: (chat: Chat | null) => void;
  headerData: HeaderDataType;
  setHeaderData: (data: HeaderDataType | null) => void;
  service: ChatService;
  updateUserObj: (userId: string, data: Partial<User>) => void
}

const service = new ChatService(new FirebaseApi());

export const AppStatesCtx = createContext<AppStatesProviderI>({
  chats: [],
  users: {},
  currentChat: null,
  isLoading: true,
  setCurrentChat: () => null,
  headerData: null,
  setHeaderData: () => null,
  service: service,
  updateUserObj: () => null
});

export default function AppStatesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<UsersObjType>({});
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
  const [headerData, setHeaderDataState] = useState<HeaderDataType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();
  const userEmails = useMemo<string[]>(() => {
    let emails: string[] = [];
    chats.forEach((c) => {
      emails.push(...c.members);
    });
    return emails;
  }, [chats]);

  const updateUserObj = (userId: string, data: Partial<User>) => {
    setUsers((prev) => ({ ...prev, [userId]: { ...prev[userId], ...data } }));
  };

  const retrieveUsers = useCallback(async (emails: string[]) => {
    if (emails.length === 0) return;
    const users = await service.getUsersByEmailList(emails);

    setUsers(
      users.reduce(
        (obj, user) => ({ ...obj, [user.email]: user }),
        {}
      ) as UsersObjType
    );
  }, []);

  const setCurrentChat = (chat: Chat | null) => {
    setCurrentChatState(() => chat);
  };

  const setHeaderData = (data: HeaderDataType | null) => {
    setHeaderDataState(() => data);
  };

  useEffect(() => {
    retrieveUsers(userEmails);
  }, [userEmails]);

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

      console.log("beforeunload", "called");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    service.createOrUpdateUser({
      displayName: displayName || undefined,
      email,
      photoURL: photoURL || undefined,
      online: true,
      lastTimeOnline: new Date(),
    });

    const q = fs.query(
      fs.collection(db, "chat"),
      fs.where("members", "array-contains", email),
      fs.orderBy("createdAt", "desc")
    );

    const unsubscribe = fs.onSnapshot(q, (querySnapshot) => {
      const chatDatas: any[] = [];
      querySnapshot.forEach((doc) => {
        chatDatas.push({ id: doc.id, ...doc.data() });
      });
      setChats(() => chatDatas);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [auth, router]);

  return (
    <AppStatesCtx.Provider
      value={{
        users,
        chats,
        currentChat,
        isLoading,
        setCurrentChat,
        headerData,
        setHeaderData,
        service,
        updateUserObj
      }}
    >
      {children}
    </AppStatesCtx.Provider>
  );
}
