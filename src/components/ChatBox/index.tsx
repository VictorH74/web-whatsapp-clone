/* eslint-disable react-hooks/exhaustive-deps */
import { getAuth } from "firebase/auth";
import Header from "../global/Header";
import ChatBoxFooter from "./components/ChatBoxFooter";
import * as fb from "firebase/firestore";
import { db } from "@/services/firebase";
import Image from "next/image";
import Loading from "../global/Loading";
import { ChatType, Message } from "@/types/chat";
import ChatBoxBody from "./components/ChatBoxBody";
import React from "react";
import { formatNumber, generateChatId } from "@/utils/functions";
import { User } from "@/types/user";
import { updateUsersObj } from "@/reduxStateSlices/usersSlice";

import useAppDispatch from "@/hooks/useDispatch";
import service from "@/services/chat";
import useAppStates from "@/hooks/useAppState";

export default React.memo(function ChatBox() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [initialMsgData, setInitialMsgData] = React.useState(true);
  const [headerImg, setHeaderImg] = React.useState<string | undefined>();
  const [headerTitle, setHeaderTitle] = React.useState<string | undefined>();
  const [headerSubHeading, setHeaderSubHeading] = React.useState<
    string | undefined
  >();
  const [isLoading, setIsLoading] = React.useState(true);
  const [prevChatId, setPrevChatId] = React.useState<string | undefined>();

  const { users, currentChat, updateCurrentChat } = useAppStates();
  const dispatch = useAppDispatch();

  const { currentUser } = getAuth();

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (currentChat === null) return;

    // Reset chatbox header
    setHeaderImg(undefined);
    setHeaderTitle(undefined);
    setHeaderSubHeading(undefined);

    let unSubscribeUser: fb.Unsubscribe | undefined;

    const chatId = currentChat.id;

    setPrevChatId(chatId);

    if (!chatId || (chatId && prevChatId && chatId !== prevChatId)) {
      setIsLoading(true);
    }

    if (!chatId) {
      fetchChat(currentChat.members, () => {
        setMessages([]);
        unSubscribeUser = fetchUser(currentChat.members, currentChat.type);
        return;
      });
    }

    const q = fb.query(
      fb.collection(db, `/message/${chatId}/messages`),
      fb.orderBy("sentAt", "asc")
    );

    const unsubscribeMessages = fb.onSnapshot(q, (querySnapshot) => {
      const msgList: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgList.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });
      setMessages(() => msgList);
      if (currentChat.type === 1) {
        unSubscribeUser = fetchUser(currentChat.members, currentChat.type);
        return;
      }
      setIsLoading(false);
      setHeaderTitle(currentChat.name || "Grupo sem nome");
      setHeaderSubHeading(currentChat.members.join(", "));
    });

    return () => {
      if (unSubscribeUser) unSubscribeUser();
      unsubscribeMessages();
    };
  }, [currentChat]);

  React.useEffect(() => {
    if (messages.length < 0 && !initialMsgData) return;
    setInitialMsgData(false);
    scrollToBottom();
  }, [messages]);

  const fetchUser = React.cache((members: string[], type: ChatType) => {
    if (type !== 1) {
      setIsLoading(false);
      return;
    }

    const { currentUser } = getAuth();

    if (!currentUser?.email) return;
    const userId = members.filter((id) => id !== currentUser.email)[0];
    const hasUserId = userId in users;

    if (hasUserId) {
      setHeaderImg(() => users[userId].photoURL);
      setHeaderTitle(() => users[userId].displayName);
      setIsLoading(false);
    }

    // ** Real time user data (firebase) **
    return fb.onSnapshot(fb.doc(db, "user", userId), (doc) => {
      if (doc.exists()) {
        const user: User = doc.data() as User;
        const diferentUserName = headerTitle !== user.displayName;
        const diferentUserImg = headerImg !== user.photoURL;

        if (diferentUserName) setHeaderTitle(user.displayName);
        if (diferentUserImg) setHeaderImg(user.photoURL);
        if (!hasUserId) {
          dispatch(updateUsersObj({ id: userId, data: user }));
          setIsLoading(false);
        }

        let subHeading;

        if (user.online) subHeading = "online";
        else {
          // ** format online last time inrfomation **
          const unknowDate = user.lastTimeOnline as unknown;
          const date = new Date((unknowDate as fb.Timestamp).seconds * 1000);

          const [day, month, year] = [
            date.getDay(),
            date.getMonth(),
            date.getFullYear(),
          ];

          const currenDate = new Date();
          const [cDay, cMonth, cYear] = [
            currenDate.getDay(),
            currenDate.getMonth(),
            currenDate.getFullYear(),
          ];

          const sameDay = day === cDay;
          const sameMounth = month === cMonth;
          const sameYear = year === cYear;
          const yesteday = day === cDay - 1 && sameMounth && sameYear;

          const hour = formatNumber(date.getHours());
          const minutes = formatNumber(date.getMinutes());
          const dayF = formatNumber(day);
          const monthF = formatNumber(month);
          const yearF = formatNumber(year);

          subHeading = yesteday
            ? `visto por ultimo ontem às ${hour}:${minutes}`
            : sameDay && sameMounth && sameYear
            ? `visto por ultimo hoje às ${hour}:${minutes}`
            : `visto por ultimo em ${dayF}/${monthF}/${yearF}`;
        }
        setHeaderSubHeading(subHeading);
      }
    });
  });

  const fetchChat = async (members: string[], onChatNotExist: () => void) => {
    const retrievedChat = await service.retrieveChat(generateChatId(members));
    if (retrievedChat) updateCurrentChat(retrievedChat);
    else onChatNotExist();
  };

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

  const scrollToBottom = React.useCallback(() => {
    if (ref.current)
      ref.current.scrollTo({
        top: ref.current?.scrollHeight,
        behavior: "smooth",
      });
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
        heading={headerTitle}
        subHeading={headerSubHeading}
        imgSrc={headerImg}
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
