"use client";

import useChats from "../hooks/useChats";
import Chats from "@/components/Chats";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import ChatIcon from "@mui/icons-material/Chat";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import GroupsIcon from "@mui/icons-material/Groups";
import ChatScreen from "@/components/ChatScreen";
import { getAuth } from "firebase/auth";
import NewChat from "@/components/NewChat";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const Main = () => {
  const { isLoading, chats } = useChats();
  const [show, setShow] = useState(false);
  const auth = getAuth();
  const router = useRouter();
  const { currentUser } = getAuth();

  const handleSetShow = useCallback(
    (value: boolean) => {
      setShow(() => value);
    },
    []
  );

  return (
    <>
      {isLoading ? (
        <main className="w-screen h-screen grid place-items-center">
          < Loading className="w-12 h-12" />
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
            <Chats chatList={chats} />
          </aside>
           <ChatScreen />
        </main>
      )}
    </>
  );
};

export default function Home() {
  return (
    <Providers>
      <Main />
    </Providers>
  );
}
