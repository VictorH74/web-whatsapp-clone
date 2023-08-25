"use client";

import ChatList from "@/components/ChatList";
import Header from "@/components/Header";
import ChatIcon from "@mui/icons-material/Chat";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import GroupsIcon from "@mui/icons-material/Groups";
import ChatBox from "@/components/ChatBox";
import { getAuth } from "firebase/auth";
import NewChat from "@/components/NewChat";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import * as firebase from "firebase/firestore";
import { db } from "@/services/firebase";
import { Chat } from "@/types/chat";

const Main = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const router = useRouter();
  const { currentUser } = getAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const handleSetShow = useCallback((value: boolean) => {
    setShow(() => value);
  }, []);

  useEffect(() => {
    if (auth.currentUser === null) {
      router.push("/login");
      return;
    }

    let { displayName, email, photoURL } = auth.currentUser;

    if (!email) return console.error("Email must not be null");

    let userRef = firebase.doc(db, "user", email);

    firebase.setDoc(userRef, {
      displayName,
      email,
      photoURL,
    });

    const q = firebase.query(
      firebase.collection(db, "chat"),
      firebase.where("members", "array-contains", userRef)
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
    };
  }, [auth, router]);

  return (
    <>
      {isLoading ? (
        <main className="w-screen h-screen grid place-items-center">
          <Loading className="w-12 h-12" />
        </main>
      ) : (
        <main className="flex flex-row overflow-hidden">
          <aside className="relative border-r-[1px] border-r-zinc-700 w-[620px] max-h-screen bg-[#111B21] flex flex-col custom-scrollbar">
            <NewChat show={show} setShow={(value) => handleSetShow(value)} />
            <Header
              accountImgUrl={currentUser?.photoURL || undefined}
              actions={[
                <button key={(Math.random() + 1).toString(36).substring(7)}>
                  <GroupsIcon sx={{ color: "white" }} />
                </button>,
                <button key={(Math.random() + 1).toString(36).substring(7)}>
                  <TrackChangesIcon sx={{ color: "white" }} />
                </button>,
                <button
                  key={(Math.random() + 1).toString(36).substring(7)}
                  onClick={() => handleSetShow(true)}
                >
                  <ChatIcon sx={{ color: "white" }} />
                </button>,
              ]}
              menuItems={[
                {
                  onClick() {
                    auth.signOut();
                    router.replace("/login");
                  },
                  title: "Sair",
                },
              ]}
            />
            <ChatList
              chatList={chats}
              handleChatClick={(chat: Chat) => setCurrentChat(chat)}
            />
          </aside>
          <ChatBox chat={currentChat} />
        </main>
      )}
    </>
  );
};

export default function Home() {
  return <Main />;
}
