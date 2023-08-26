import ChatTile from "./ChatTile";
import useChats from "@/hooks/useChats";

export default function ChatList() {
  const { chats } = useChats();

  return (
    <div className="overflow-auto h-full">
      {chats.map((chat, i) => (
        <ChatTile key={chat.id} data={chat} last={i === chats.length - 1} />
      ))}
    </div>
  );
}
