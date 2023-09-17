/* eslint-disable react-hooks/exhaustive-deps */
import { getAuth } from "firebase/auth";
import Header from "../global/Header";
import ChatBoxFooter from "./components/ChatBoxFooter";
import Image from "next/image";
import Loading from "../global/Loading";
import ChatBoxBody from "./components/ChatBoxBody";
import React from "react";

import service from "@/services/api";
import useAppStates from "@/hooks/useAppState";
import useCurrentChat from "@/hooks/useCurrentChat";

export default React.memo(function ChatBox() {
  const scrollToBottom = React.useCallback(() => {
    if (ref.current)
      ref.current.scrollTo({
        top: ref.current?.scrollHeight,
        behavior: "smooth",
      });
  }, []);

  const { currentChat, updateCurrentChat } = useAppStates();

  const { imageUrl, title, subHeading, messages, isLoading } =
    useCurrentChat(scrollToBottom);
  const { currentUser } = getAuth();
  const ref = React.useRef<HTMLDivElement>(null);

  const deleteChat = React.useCallback(async () => {
    if (currentChat === null || !currentChat.id) return;
    updateCurrentChat(null);
    await service.deleteChat(currentChat.id);
    // TODO: delete message doc with the deleted chat id
    // possible only with firebase cloud functions :(
  }, [currentChat]);

  const scrollToMsg = React.useCallback((msgId: string, groupId?: string) => {
    if (ref.current) {
      const msgRef = document.getElementById(msgId);
      if (msgRef === null) return;

      const chatBoxBodyH = ref.current.offsetHeight;
      const MessageContainerH = msgRef.offsetHeight;
      const msgTop = msgRef.offsetTop;
      const scrollTop = chatBoxBodyH / 2 - MessageContainerH / 2;

      ref.current.scrollTo({
        top: msgTop - scrollTop >= 0 ? msgTop - scrollTop : 0,
        behavior: "smooth",
      });

      msgRef.classList.add("animate-blink");
      setTimeout(() => {
        msgRef.classList.remove("animate-blink");
      }, 2000);
    }
  }, []);

  if (currentChat === null) {
    return (
      <div className="w-full h-screen bg-[#0B141A] grid place-content-center text-white">
        <Image
          src="/undraw_void.svg"
          alt="empty-chat-image"
          width={300}
          height={300}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#0B141A] grid place-items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full min-w-[440px] relative overflow-hidden grow flex flex-col bg-[#0B141A]">
      <Header
        type={currentChat.type}
        heading={title}
        subHeading={subHeading}
        imgSrc={imageUrl}
        menuItems={
          currentChat.type === 2
            ? [
                {
                  onClick() {
                    updateCurrentChat(null);
                  },
                  title: "Fechar Conversa",
                },
                {
                  onClick() {
                    // setShowGroupData
                  },
                  title: "Dados do Grupo",
                },
                currentChat.admList.includes(currentUser?.email || "")
                  ? {
                      onClick() {
                        deleteChat();
                      },
                      title: "Deletar Grupo",
                    }
                  : undefined,
              ]
            : [
                {
                  onClick() {
                    updateCurrentChat(null);
                  },
                  title: "Fechar Conversa",
                },
              ]
        }
      />
      <ChatBoxBody
        messages={messages}
        scrollToMsg={scrollToMsg}
        type={currentChat.type}
        ref={ref}
      />
      <ChatBoxFooter
        currentUserEmail={currentUser?.email || ""}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
});
