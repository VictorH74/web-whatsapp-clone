/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { db } from "@/services/firebase";
import React from "react";
import * as fs from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { Chat } from "@/types/chat";
import ChatService from "@/services/chat";
import FirebaseApi from "@/services/firebaseApi";
import { User } from "@/types/user";
import { undefinedUserEmailError } from "@/utils/constants";

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
  updateUserObj: (userId: string, data: Partial<User>) => void;
}

const service = new ChatService(new FirebaseApi());

const initialStates = {
  chats: [],
  users: {},
  currentChat: null,
  headerData: null,
  isLoading: true,
  service,
  setCurrentChat: () => null,
  setHeaderData: () => null,
  updateUserObj: () => null,
};

export const AppStatesCtx =
  React.createContext<AppStatesProviderI>(initialStates);

export default function AppStatesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [users, setUsers] = React.useState<UsersObjType>({});
  const [currentChat, setCurrentChatState] = React.useState<Chat | null>(null);
  const [headerData, setHeaderDataState] =
    React.useState<HeaderDataType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const auth = getAuth();
  const userEmails = React.useMemo<string[]>(() => {
    let emails: string[] = [];
    chats.forEach((c) => {
      emails.push(...c.members);
    });
    return emails;
  }, [chats]);

  React.useEffect(() => {
    retrieveUsers(userEmails);
  }, [userEmails]);

  React.useEffect(() => {
    if (auth.currentUser === null) {
      router.push("/login");
      return;
    }

    let { displayName, email, photoURL } = auth.currentUser;

    if (!email) return undefinedUserEmailError();

    const handleBeforeUnload = () => {
      if (!email) return;

      service.createOrUpdateUser(
        {
          email,
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

  const updateUserObj = (userId: string, data: Partial<User>) => {
    setUsers((prev) => ({ ...prev, [userId]: { ...prev[userId], ...data } }));
  };

  const retrieveUsers = React.useCallback(async (emails: string[]) => {
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
        updateUserObj,
      }}
    >
      {children}
    </AppStatesCtx.Provider>
  );
}
