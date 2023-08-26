import { getAuth } from "firebase/auth";
import Header from "./Header";
import ChatBoxFooter from "./ChatBoxFooter";
import * as fb from "firebase/firestore";
import { db } from "@/services/firebase";
import Image from "next/image";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import { Message } from "@/types/chat";
import useChats from "@/hooks/useChats";
import ChatBoxBody from "./ChatBoxBody";
import firebase from "firebase/compat/app";

export default memo(function ChatBox() {
  const { currentUser } = getAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentChat, setCurrentChat } = useChats();
  const ref = useRef<HTMLDivElement>(null);
  const [initialMsgData, setInitialMsgData] = useState(true);

  useEffect(() => {
    if (currentChat === null) return;
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
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [currentChat]);

  useEffect(() => {
    if (messages.length < 0 && !initialMsgData) return;
    console.log(ref.current?.scrollHeight);
    console.log(ref.current?.scrollTop);
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
    if (currentChat === null) return;

    const createRef = (path: string) => fb.doc(db, path, currentChat.id);
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
        heading={currentChat.name || "Chat sem nome"}
        menuItems={[
          {
            onClick() {
              deleteChat();
            },
            title: "Deletar Chat",
          },
        ]}
      />
      <ChatBoxBody messages={messages} type={currentChat.type} ref={ref} />
      <ChatBoxFooter
        chatId={currentChat.id}
        currentUserEmail={currentUser?.email || ""}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
});
