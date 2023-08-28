/* eslint-disable react-hooks/exhaustive-deps */
import { getAuth } from "firebase/auth";
import Header from "./Header";
import ChatBoxFooter from "./ChatBoxFooter";
import * as fb from "firebase/firestore";
import { db } from "@/services/firebase";
import Image from "next/image";
import { cache, memo, useCallback, useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import { ChatType, Message } from "@/types/chat";
import useChats from "@/hooks/useChats";
import ChatBoxBody from "./ChatBoxBody";
import { User } from "@/types/user";

export default memo(function ChatBox() {
  const { currentUser } = getAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentChat, setCurrentChat } = useChats();
  const ref = useRef<HTMLDivElement>(null);
  const [initialMsgData, setInitialMsgData] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [headerImg, setHeaderImg] = useState<string | undefined>();
  const [headerTitle, setHeaderTitle] = useState<string | undefined>(
    currentChat?.name ? currentChat.name : undefined
  );

  const fetchUserImg = cache(
    async (members: fb.DocumentReference[], type: ChatType) => {
      if (type === 1) {
        const { currentUser } = getAuth();

        if (!currentUser?.email) return;

        const userRef = members.filter((m) => m.id !== currentUser.email)[0];

        const user = (await fb.getDoc(userRef)).data() as User;

        setHeaderImg(user.photoURL);
        setHeaderTitle(user.displayName);
      }

      setIsLoading(false);
    }
  );

  useEffect(() => {
    if (currentChat === null) return;

    setCurrentChatId(currentChat.id);

    if (currentChat.id && currentChatId && currentChat.id !== currentChatId) {
      setIsLoading(true);
    }

    if (!currentChat.id) {
      setIsLoading(true);
      setMessages([]);
      fetchUserImg(currentChat.members, currentChat.type);
      return;
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
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentChat]);

  useEffect(() => {
    if (messages.length < 0 && !initialMsgData) return;
    setInitialMsgData(false);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    if (ref.current)
      ref.current.scrollTo({
        top: ref.current?.scrollHeight,
        behavior: "smooth",
      });
  }, []);

  const deleteChat = useCallback(async () => {
    if (currentChat === null || !currentChat.id) return;

    const createRef = (path: string) =>
      fb.doc(db, path, currentChat.id as string);
    setCurrentChat(null);

    const chatRef = createRef("chat");
    // const messagesRef = createRef("message");

    await fb.deleteDoc(chatRef);
    // await fb.deleteDoc(messagesRef);

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
                  title: "Deletar Chat",
                },
              ]
            : []
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
