/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ChatBox from "@/components/ChatBox";
import Loading from "@/components/global/Loading";
import { Provider } from "react-redux";
import Aside from "@/components/Aside";
import ChatBoxStatesProvider from "@/contexts/chatBoxCtx";
import AsideProvider from "@/contexts/asideCtx";
import { store } from "./store";
import useAppDispatch from "@/hooks/useDispatch";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import React from "react";
import { undefinedUserEmailError } from "@/utils/constants";
import service from "@/services/api";
import { UsersObjType, seedUsersObj } from "@/reduxStateSlices/usersSlice";
import * as fs from "firebase/firestore";
import { db } from "@/services/firebase";
import useAppStates from "@/hooks/useAppState";

const Main = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { chats, updateChats } = useAppStates();
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
          lastTimeOnline: new Date().toString(),
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
      lastTimeOnline: new Date().toString(),
    });

    const q = fs.query(
      fs.collection(db, "chat"),
      fs.where("members", "array-contains", email),
      fs.orderBy("createdAt", "desc")
    );

    const unsubscribe = fs.onSnapshot(q, (querySnapshot) => {
      const chatDatas: any[] = [];
      querySnapshot.forEach((doc) => {
        let chat = { ...doc.data() };

        if (chat.recentMessage)
          chat["recentMessage"] = {
            ...chat.recentMessage,
            sentAt: chat.recentMessage.sentAt.toString(),
          };

        chatDatas.push({
          id: doc.id,
          ...chat,
          createdAt: chat.createdAt.toString()
        });
      });
      updateChats(chatDatas);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [auth, router]);

  const retrieveUsers = React.useCallback(async (emails: string[]) => {
    if (emails.length === 0) return;
    const users = await service.getUsersByEmailList(emails);

    dispatch(
      seedUsersObj(
        users.reduce(
          (obj, user) => ({
            ...obj,
            [user.email]: {
              ...user,
              lastTimeOnline: user.lastTimeOnline.toString(),
            },
          }),
          {}
        ) as UsersObjType
      )
    );
  }, []);

  return (
    <>
      {isLoading ? (
        <main className="w-screen h-screen grid place-items-center">
          <Loading className="w-12 h-12" />
        </main>
      ) : (
        <main className="flex h-screen overflow-y-hidden custom-scrollbar">
          <AsideProvider>
            <Aside />
          </AsideProvider>

          <ChatBoxStatesProvider>
            <ChatBox />
          </ChatBoxStatesProvider>
        </main>
      )}
    </>
  );
};

export default function Home() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
