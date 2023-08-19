import { getAuth } from "firebase/auth";
import Header from "./Header";
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
    <div className="w-full flex flex-col h-screen bg-[#0B141A]">
      <Header
        heading={chats[chatIndex].users
          .filter((u) => u.email !== currentUser?.email)
          .map((u) => u.name)
          .join(",")}
      />
      <div className="flex flex-col grow justify-end text-white overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-3 p-4 overflow-y-auto">
          {messages.map((m) => (
            <div
              className={`bg-[#005C4B] p-2 rounded-md w-auto ${
                m.sender === "system"
                  ? "self-center bg-gray-800"
                  : currentUser?.email === m.sender
                  ? "self-end"
                  : "self-start bg-[#202C33]"
              }`}
              key={m.createdAt.toString()}
            >
              {m.content}
            </div>
          ))}
        </div>
      </div>
      <ChatScreenFooter
        chatId={chats[chatIndex].id}
        currentUserEmail={currentUser?.email || ""}
      />
    </div>
  );
}
