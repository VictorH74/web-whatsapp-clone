import { getAuth } from "firebase/auth";
import Header from "./Header";
import useChats from "@/hooks/useChats";
import ChatScreenFooter from "./ChatScreenFooter";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";
import Image from "next/image";


export default function ChatScreen() {
  const { currentUser } = getAuth();
  const { chats, currentChatIndex, setCurrentChatIndexState } = useChats();

  const deleteChat = async () => {
    if (currentChatIndex === null) return;
    console.log(currentChatIndex);
    const ref = doc(db, "chats", chats[currentChatIndex].id);

    setCurrentChatIndexState(null);
    await deleteDoc(ref);
  };

  if (currentChatIndex === null) {
    return (
      <div className="w-full h-screen bg-[#0B141A] grid place-content-center text-white">
        <Image src="/undraw_void.svg" alt="empty-chat-image" width={300} height={300} />
      </div>
    );
  }

  const users = chats[currentChatIndex].users;

  return (
    <div className="w-full flex flex-col h-screen bg-[#0B141A]">
      <Header
        type={users.length > 2 ? "group" : "duo"}
        heading={users
          .filter((u) => u.email !== currentUser?.email)
          .map((u) => u.name)
          .join(",")}
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
          {chats[currentChatIndex].messages.map((m) => (
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
        chatId={chats[currentChatIndex].id}
        currentUserEmail={currentUser?.email || ""}
      />
    </div>
  );
}
