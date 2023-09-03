import ChatListItem from "./ChatListItem";
import useAppStates from "@/hooks/useAppStates";

export default function ChatList() {
  const { chats } = useAppStates();

  return (
    <ul className="overflow-auto h-full">
      {chats.map((chat, i) => (
        <ChatListItem key={chat.id} data={chat} isLastItem={i === chats.length - 1} />
      ))}
    </ul>
  );
}
