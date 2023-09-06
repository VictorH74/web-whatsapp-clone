import ChatListItem from "./ChatListItem";
import useAppStates from "@/hooks/useAppState";
import { Chat } from "@/types/chat";

export default function ChatList() {
  const { chats } = useAppStates();

  return (
    <ul className="overflow-auto h-full">
      {chats.map((chat, i) => (
        <ChatListItem
          key={chat.id}
          data={chat as Chat}
          isLastItem={i === chats.length - 1}
        />
      ))}
    </ul>
  );
}
