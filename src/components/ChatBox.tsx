/* eslint-disable react-hooks/exhaustive-deps */
import { getAuth } from "firebase/auth";
import Header from "./Header";
import ChatBoxFooter from "./ChatBoxFooter";
import * as fb from "firebase/firestore";
import { db } from "@/services/firebase";
import Image from "next/image";
import Loading from "./Loading";
import { ChatType, Message } from "@/types/chat";
import useChats from "@/hooks/useChats";
import ChatBoxBody from "./ChatBoxBody";
import React from "react";
import { generateChatId } from "@/utils/functions";

export default React.memo(function ChatBox() {
  const { currentUser } = getAuth();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { currentChat, setCurrentChat, service } = useChats();
  const ref = React.useRef<HTMLDivElement>(null);
  const [initialMsgData, setInitialMsgData] = React.useState(true);
  const [currentChatId, setCurrentChatId] = React.useState<
    string | undefined
  >();
  const [headerImg, setHeaderImg] = React.useState<string | undefined>();
  const [headerTitle, setHeaderTitle] = React.useState<string | undefined>(
    currentChat?.name ? currentChat.name : undefined
  );

  const fetchUserImg = React.cache(
    async (members: string[], type: ChatType) => {
      if (type === 1) {
        const { currentUser } = getAuth();

        if (!currentUser?.email) return;

        // TODO: change mebers field from user ref to user id/email
        // userId = members.filter(id => id !== currentUser.email)[0];
        const userId = members.filter((id) => id !== currentUser.email)[0];

        const user = await service.retrieveUser(userId);

        if (!user) {
          alert("Erro ao buscar dados do usuário: Usuário não existe");
          console.error();
          return;
        }

        setHeaderImg(user.photoURL);
        setHeaderTitle(user.displayName);
      }

      setIsLoading(false);
    }
  );

  const checkChat = async (members: string[], callback: () => void) => {
    const retrievedChat = await service.retrieveChat(generateChatId(members));

    if (retrievedChat) {
      setCurrentChat(retrievedChat);
      return;
    }

    callback();
  };

  React.useEffect(() => {
    if (currentChat === null) return;

    setCurrentChatId(currentChat.id);

    if (currentChat.id && currentChatId && currentChat.id !== currentChatId) {
      setIsLoading(true);
    }

    if (!currentChat.id) {
      setIsLoading(true);

      checkChat(currentChat.members, () => {
        setMessages([]);
        fetchUserImg(currentChat.members, currentChat.type);
        return;
      });
    }

    const q = fb.query(
      fb.collection(db, `/message/${currentChat.id}/messages`),
      fb.orderBy("sentAt", "asc")
    );

    const unsubscribe = fb.onSnapshot(q, (querySnapshot) => {
      const messageDatas: any[] = [];
      querySnapshot.forEach((doc) => {
        messageDatas.push({ id: doc.id, ...doc.data() });
      });
      setMessages(() => messageDatas);
      if (currentChat.type === 1) {
        fetchUserImg(currentChat.members, currentChat.type);
        return;
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      console.log("null");
    };
  }, [currentChat]);

  React.useEffect(() => {
    if (messages.length < 0 && !initialMsgData) return;
    setInitialMsgData(false);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = React.useCallback(() => {
    if (ref.current)
      ref.current.scrollTo({
        top: ref.current?.scrollHeight,
        behavior: "smooth",
      });
  }, []);

  const deleteChat = React.useCallback(async () => {
    if (currentChat === null || !currentChat.id) return;

    await service.deleteChat(currentChat.id);

    // TODO: delete message doc with the deleted chat id
    // possible only with firebase cloud functions :(
  }, [currentChat]);

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
        heading={headerTitle}
        imgSrc={headerImg}
        menuItems={
          currentChat.type === 2
            ? [
                {
                  onClick() {
                    deleteChat();
                  },
                  title: "Deletar Grupo",
                },
              ]
            : [
                {
                  onClick() {
                    setCurrentChat(null);
                  },
                  title: "Fechar Conversa",
                },
              ]
        }
      />
      <ChatBoxBody messages={messages} type={currentChat.type} ref={ref} />
      <ChatBoxFooter
        currentUserEmail={currentUser?.email || ""}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
});
