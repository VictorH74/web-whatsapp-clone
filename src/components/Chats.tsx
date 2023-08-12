import Chat from "./Chat";

interface Props {
  chatList: Chat[];
}

export default function Chats({ chatList }: Props) {
  return (
    <div className="overflow-auto h-full">
      {chatList.map((chat, i) => (
        <Chat key={chat.id} data={chat} last={i === chatList.length - 1} />
      ))}
    </div>
  );
}
