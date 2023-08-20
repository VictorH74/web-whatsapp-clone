import { getAuth } from "firebase/auth";
import Header from "./Header";
import useChats from "@/hooks/useChats";
import ChatScreenFooter from "./ChatScreenFooter";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";
import Image from "next/image";
import Message from "./Message";

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
        <Image
          src="/undraw_void.svg"
          alt="empty-chat-image"
          width={300}
          height={300}
        />
      </div>
    );
  }

  const thisChat = chats[currentChatIndex];
  const users = chats[currentChatIndex].users;

  return (
    <div className="w-full flex flex-col h-screen bg-[#0B141A]">
      <Header
        accountImgUrl={
          thisChat.type === "duo"
            ? thisChat.users.filter(
                (u) => u.email !== (currentUser?.email || "")
              )[0].photoUrl
            : undefined
        }
        type={thisChat.type}
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
          {thisChat.messages.map((m) => (
            <Message
              key={m.createdAt.toString()}
              message={m}
              owner={currentUser?.email === m.sender}
              type={thisChat.type}
              senderNameColor={
                colors[thisChat.colors ? thisChat.colors[m.sender] : 0]
              }
            />
          ))}
        </div>
      </div>
      <ChatScreenFooter
        chatId={thisChat.id}
        currentUserEmail={currentUser?.email || ""}
      />
    </div>
  );
}
