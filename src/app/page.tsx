"use client";

import ChatBox from "@/components/ChatBox";
import Loading from "@/components/global/Loading";
import Providers from "@/components/global/Providers";
import Aside from "@/components/Aside";
import useAppStates from "@/hooks/useAppStates";
import ChatBoxStatesProvider from "@/contexts/chatBoxCtx";
import AsideProvider from "@/contexts/asideCtx";

const Main = () => {
  const { isLoading } = useAppStates();

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
    <Providers>
      <Main />
    </Providers>
  );
}
