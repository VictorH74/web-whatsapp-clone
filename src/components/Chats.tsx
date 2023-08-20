import ChatTile from "./ChatTile";

interface Props {
  chatList: ChatBox[];
}

export default function Chats({ chatList }: Props) {
  return (
    <div className="overflow-auto h-full">
      {chatList.map((chat, i) => (
        <ChatTile
          key={chat.id}
          data={chat}
          index={i}
          last={i === chatList.length - 1}
        />
      ))}
    </div>
  );
}
