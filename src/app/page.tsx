"use client";

import useChats from "../hooks/useChats";
import Chats from "@/components/Chats";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import ChatIcon from "@mui/icons-material/Chat";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import GroupsIcon from "@mui/icons-material/Groups";

const Main = () => {
  const { isLoading, chats } = useChats();

  return (
    <>
      {isLoading ? (
        <main className="bg-[#111B21] w-screen h-screen grid place-items-center">
          <h1 className="text-white">loading</h1>
        </main>
      ) : (
        <main className="flex flex-row">
          <aside className="border-r-[1px] border-r-zinc-700 w-[620px] max-h-screen bg-[#111B21] flex flex-col custom-scrollbar">
            <Header
              actions={[
                <button key={(Math.random() + 1).toString(36).substring(7)}>
                  <GroupsIcon sx={{ color: "white" }} />
                </button>,
                <button key={(Math.random() + 1).toString(36).substring(7)}>
                  <TrackChangesIcon sx={{ color: "white" }} />
                </button>,
                <button key={(Math.random() + 1).toString(36).substring(7)}>
                  <ChatIcon sx={{ color: "white" }} />
                </button>,
              ]}
            />
            <Chats chatList={chats} />
          </aside>
          <div className="w-full h-screen bg-[#0B141A]"></div>
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
