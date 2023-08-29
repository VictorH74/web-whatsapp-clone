/* eslint-disable react-hooks/exhaustive-deps */
import useChats from "@/hooks/useChats";
import { ChatType, Message } from "@/types/chat";
import { getAuth } from "firebase/auth";
import { DocumentReference, getDoc } from "firebase/firestore";
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
  const {service} = useChats()

  const date = new Date(message.sentAt.seconds * 1000);
  const hour = date.getHours();
  const minute = date.getMinutes();

  const getSender = async (ref: DocumentReference) => {
    const user = await service.retrieveUser(ref.id)
    setSender(user?.displayName);
  };

  useEffect(() => {
    if (message.sender instanceof DocumentReference) {
      if (currentUser?.email === message.sender.id) {
        setSender(currentUser?.displayName || "-");
        setOwner(true);
        return;
      }

      if (type !== 2) {
        setSender("x");
        return;
      }

      getSender(message.sender);
      return;
    }

    setSender(message.sender);
  }, []);

  if (!sender) {
    return <></>;
  }

  return (
    <div
      className={`bg-[#005C4B] text-sm font-normal p-2 rounded-md w-auto flex flex-col ${
        sender === "system"
          ? "self-center bg-gray-800"
          : owner
          ? "self-end"
          : "self-start bg-[#202C33]"
      }`}
      key={message.sentAt.toString()}
    >
      {type === 2 && !owner && sender !== "system" && (
        <p className={`text-${senderNameColor}`}>{sender}</p>
      )}
      <p>{message.content}</p>
      {sender !== "system" && (
        <p className="text-xsself-end w-min">{`${hour}:${minute}`}</p>
      )}
    </div>
  );
});
