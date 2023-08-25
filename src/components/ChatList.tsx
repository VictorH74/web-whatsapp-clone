import { Chat } from "@/types/chat";
import ChatTile from "./ChatTile";

interface Props {
  chatList: Chat[];
  handleChatClick: (chat: Chat) => void
}

export default function ChatList({ chatList, handleChatClick }: Props) {
  return (
    <div className="overflow-auto h-full">
      {chatList.map((chat, i) => (
        <ChatTile
          key={chat.id}
          data={chat}
          last={i === chatList.length - 1}
          handleClick={() => handleChatClick(chat)}
        />
      ))}
    </div>
  );
}
