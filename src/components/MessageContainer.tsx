/* eslint-disable react-hooks/exhaustive-deps */
import useAppStates from "@/hooks/useAppStates";
import { ChatType, Message } from "@/types/chat";
import { formatNumber, getDate } from "@/utils/functions";
import { getAuth } from "firebase/auth";
import { memo, useEffect, useState } from "react";

interface Props {
  message: Message;
  type: ChatType;
  senderNameColor: string;
}

export default memo(function MessageContainer({
  message,
  type,
  senderNameColor,
}: Props) {
  const [sender, setSender] = useState<string | undefined>(undefined);
  const [owner, setOwner] = useState<boolean>(false);
  const { currentUser } = getAuth();
  const { service, users } = useAppStates();

  const date = getDate(message.sentAt);

  console.log(senderNameColor);

  const getSender = async (senderId: string) => {
    if (senderId in users) {
      const user = users[senderId];
      setSender(user?.displayName);
      return;
    }
    const user = await service.retrieveUser(senderId);
    setSender(user?.displayName);
  };

  useEffect(() => {
    if (message.sender === "system") {
      setSender(message.sender);
      return;
    }

    if (currentUser?.email === message.sender) {
      setSender(currentUser?.displayName || "-");
      setOwner(true);
      return;
    }

    if (type !== 2) {
      setSender("x");
      return;
    }

    getSender(message.sender);
  }, []);

  if (!sender) {
    return <></>;
  }

  return (
    <div
      className={`bg-[#005C4B] text-sm font-normal p-2 overflow-hidden rounded-md w-auto max-w-lg h-auto flex flex-col ${
        sender === "system"
          ? "self-center bg-gray-800"
          : owner
          ? "self-end"
          : "self-start bg-[#202C33]"
      }`}
      key={message.sentAt.toString()}
    >
      {type === 2 && !owner && sender !== "system" && (
        <p style={{ color: senderNameColor }}>{sender}</p>
      )}
      <p className="break-words">{message.content}</p>
      {sender !== "system" && (
        <p className="text-xs self-end w-min">{`${formatNumber(
          date.hour
        )}:${formatNumber(date.minute)}`}</p>
      )}
    </div>
  );
});
