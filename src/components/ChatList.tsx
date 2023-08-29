import ChatListItem from "./ChatListItem";
import useChats from "@/hooks/useChats";

export default function ChatList() {
  const { chats } = useChats();

  return (
    <ul className="overflow-auto h-full">
      {chats.map((chat, i) => (
        <ChatListItem key={chat.id} data={chat} isLastItem={i === chats.length - 1} />
      ))}
    </ul>
  );
}
