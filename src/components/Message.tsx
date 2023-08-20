import { Timestamp } from "firebase/firestore";
import { memo } from "react";

interface Props {
  message: Message;
  type: ChatType;
  owner: boolean;
  senderNameColor: string;
}

export default memo(function Message({
  message,
  owner,
  type,
  senderNameColor,
}: Props) {
  const date = new Date(message.createdAt.seconds * 1000);

  const hour = date.getHours();
  const minute = date.getMinutes();

  return (
    <div
      className={`bg-[#005C4B] text-sm font-normal p-2 rounded-md w-auto flex flex-col ${
        message.sender === "system"
          ? "self-center bg-gray-800"
          : owner
          ? "self-end"
          : "self-start bg-[#202C33]"
      }`}
      key={message.createdAt.toString()}
    >
      {type === "group" && !owner && message.sender !== "system" && (
        <p className={`text-${senderNameColor}`}>{message.sender}</p>
      )}
      <p>{message.content}</p>
      {message.sender !== "system" && (
        <p className="text-xsself-end w-min">{`${hour}:${minute}`}</p>
      )}
    </div>
  );
});
