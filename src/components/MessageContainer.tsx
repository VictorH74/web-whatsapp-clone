/* eslint-disable react-hooks/exhaustive-deps */
import { ChatType, Message } from "@/types/chat";
import { User } from "@/types/user";
import { getAuth } from "firebase/auth";
import { DocumentReference, getDoc } from "firebase/firestore";
import { memo, useEffect, useState } from "react";

interface Props {
  message: Message;
  type: ChatType;
  owner: boolean;
  senderNameColor: string;
}

export default memo(function MessageContainer({
  message,
  owner,
  type,
  senderNameColor,
}: Props) {
  const [sender, setSender] = useState<string | undefined>(undefined);
  const date = new Date(message.sentAt.seconds * 1000);
  const { currentUser } = getAuth();

  const hour = date.getHours();
  const minute = date.getMinutes();

  const getSender = async () => {
    if (owner) {
      setSender(currentUser?.displayName || "-");
      return
    }
    if (message.sender instanceof DocumentReference) {
      const data = await getDoc(message.sender);
      const user = data.data() as User;
      return setSender(user.displayName);
    }
    setSender(message.sender);
  };

  useEffect(() => {
    getSender();
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
