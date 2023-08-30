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
import { formatNumber, generateChatId } from "@/utils/functions";
import { User } from "@/types/user";

export default React.memo(function ChatBox() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [initialMsgData, setInitialMsgData] = React.useState(true);
  const [headerImg, setHeaderImg] = React.useState<string | undefined>();
  const [headerTitle, setHeaderTitle] = React.useState<string | undefined>();
  const [headerSubHeading, setHeaderSubHeading] = React.useState<
    string | undefined
  >();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentChatId, setCurrentChatId] = React.useState<
    string | undefined
  >();
  const { currentUser } = getAuth();
  const { currentChat, setCurrentChat, service } = useChats();
  const ref = React.useRef<HTMLDivElement>(null);

  const fetchUserImg = React.cache((members: string[], type: ChatType) => {
    if (type !== 1) {
      setIsLoading(false);
      return;
    }

    const { currentUser } = getAuth();
    if (!currentUser?.email) return;

    const userId = members.filter((id) => id !== currentUser.email)[0];

    return fb.onSnapshot(fb.doc(db, "user", userId), (doc) => {
      if (doc.exists()) {
        const user: User = doc.data() as User;
        setHeaderImg(user.photoURL);
        setHeaderTitle(user.displayName);
        setIsLoading(false);

        let subHeading;
        if (user.online) {
          subHeading = "online";
        } else {
          const unknowDate = user.lastTimeOnline as unknown;
          const date = new Date((unknowDate as fb.Timestamp).seconds * 1000);
          const day = date.getDay();
          const mouth = date.getMonth();
          const year = date.getFullYear();

          const currenDate = new Date();
          const cDay = currenDate.getDay();
          const cMouth = currenDate.getMonth();
          const cYear = currenDate.getFullYear();

          if (day === cDay - 1 && mouth === cMouth && year === cYear) {
            subHeading = `visto por ultimo ontem às ${formatNumber(
              date.getHours()
            )}:${formatNumber(date.getMinutes())}`;
          } else if (day === cDay && mouth === cMouth && year === cYear) {
            subHeading = `visto por ultimo hoje às ${formatNumber(
              date.getHours()
            )}:${formatNumber(date.getMinutes())}`;
          } else {
            subHeading = `visto por ultimo hoje em ${formatNumber(
              day
            )}/${formatNumber(mouth)}/${formatNumber(year)}`;
          }
        }
        setHeaderSubHeading(subHeading);
      }
    });
  });

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

    let unSubscribeUser: fb.Unsubscribe | undefined;

    setCurrentChatId(currentChat.id);

    if (currentChat.id && currentChatId && currentChat.id !== currentChatId) {
      setIsLoading(true);
    }

    if (!currentChat.id) {
      setIsLoading(true);

      checkChat(currentChat.members, () => {
        setMessages([]);
        unSubscribeUser = fetchUserImg(currentChat.members, currentChat.type);
        return;
      });
    }

    const q = fb.query(
      fb.collection(db, `/message/${currentChat.id}/messages`),
      fb.orderBy("sentAt", "asc")
    );

    const unsubscribeMessages = fb.onSnapshot(q, (querySnapshot) => {
      const messageDatas: any[] = [];
      querySnapshot.forEach((doc) => {
        messageDatas.push({ id: doc.id, ...doc.data() });
      });
      setMessages(() => messageDatas);
      if (currentChat.type === 1) {
        unSubscribeUser = fetchUserImg(currentChat.members, currentChat.type);
        return;
      }
      setIsLoading(false);
      setHeaderTitle(currentChat.name || "Grupo sem nome");
      setHeaderSubHeading(currentChat.members.join(", "))
    });

    return () => {
      if (unSubscribeUser) {
        unSubscribeUser();
      }
      unsubscribeMessages();
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

    setCurrentChat(null)

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
        subHeading={headerSubHeading}
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
