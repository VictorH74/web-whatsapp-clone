import { getAuth } from "firebase/auth";
import Header from "./Header";
import ChatBoxFooter from "./ChatBoxFooter";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import Image from "next/image";
import MessageContainer from "./MessageContainer";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { Chat, Message } from "@/types/chat";

const colors: string[] = [
  "green-400",
  "red-400",
  "purple-500",
  "pink-400",
  "orange-500",
  "emerald-500",
  "purple-400",
  "teal-300",
  "blue-400",
  "yellow-400",
];

interface Props {
  chat: Chat | null;
}

export default function ChatBox({ chat }: Props) {
  const { currentUser } = getAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (chat === null) return;

    const q = query(
      collection(db, `/message/${chat.id}/messages`),
      orderBy("sentAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messageDatas: any[] = [];
      querySnapshot.forEach((doc) => {
        messageDatas.push({ id: doc.id, ...doc.data() });
      });
      console.log(messageDatas);
      setMessages(() => messageDatas);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [chat]);

  const deleteChat = async () => {
    if (chat === null) return;
    const ref = doc(db, "chats", chat.id);

    await deleteDoc(ref);
  };

  if (chat === null) {
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
    <div className="w-full flex flex-col h-screen bg-[#0B141A]">
      <Header
        type={chat.type}
        heading={chat.name || "Chat sem nome"}
        menuItems={[
          {
            onClick() {
              deleteChat();
            },
            title: "Deletar Chat",
          },
        ]}
      />
      <div className="flex flex-col grow justify-end text-white overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-3 p-4 overflow-y-auto">
          {messages.map((m) => (
            <MessageContainer
              key={m.sentAt.toString()}
              message={m}
              owner={currentUser?.email === m.sender}
              type={chat.type}
              senderNameColor={colors[0]}
            />
          ))}
        </div>
      </div>
      <ChatBoxFooter
        chatId={chat.id}
        currentUserEmail={currentUser?.email || ""}
      />
    </div>
  );
}
