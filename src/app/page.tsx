"use client";

import ChatBox from "@/components/ChatBox";
import Loading from "@/components/Loading";
import Providers from "@/components/Providers";
import Aside from "@/components/Aside";
import AsideProvider from "@/contexts/aside";
import useAppStates from "@/hooks/useAppStates";

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
