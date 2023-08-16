import { getAuth } from "firebase/auth";
import Header from "./Header";
import { Timestamp } from "firebase/firestore";
import useChats from "@/hooks/useChats";
import ChatScreenFooter from "./ChatScreenFooter";

interface Props {
  chatIndex: number;
}

export default function ChatScreen({ chatIndex }: Props) {
  const { currentUser } = getAuth();
  const { chats } = useChats();

  const messages = chats[chatIndex].messages || [];

  return (
    <div className="w-full h-screen bg-[#0B141A] flex flex-col">
      <Header
        heading={chats[chatIndex].users
          .filter((u) => u.email !== currentUser?.email)
          .map((u) => u.name)
          .join(",")}
      />
      <div className="flex flex-col gap-3 h-full p-4 justify-end  text-white">
        {messages.map((m) => (
          <div
            className={`bg-[#005C4B] p-2 rounded-md w-auto ${
              currentUser?.email === m.sender ? "self-end" : "self-start bg-[#202C33]"
            }`}
            key={m.createdAt.toString()}
          >
            {m.content}
          </div>
        ))}
      </div>
      <ChatScreenFooter chatId={chats[chatIndex].id} currentUserEmail={currentUser?.email || ""} />
    </div>
  );
}
