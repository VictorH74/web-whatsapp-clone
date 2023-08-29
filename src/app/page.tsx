"use client";

import ChatBox from "@/components/ChatBox";
import Loading from "@/components/Loading";
import Providers from "@/components/Providers";
import SideBar from "@/components/SideBar";
import SidebarProvider from "@/contexts/sidebar";
import useChats from "@/hooks/useChats";

const Main = () => {
  const { isLoading } = useChats();

  return (
    <>
      {isLoading ? (
        <main className="w-screen h-screen grid place-items-center">
          <Loading className="w-12 h-12" />
        </main>
      ) : (
        <main className="flex h-screen overflow-y-hidden custom-scrollbar">
          <SidebarProvider>
            <SideBar />
          </SidebarProvider>

          <ChatBox />
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
