import { ChatType, Message } from "@/types/chat";
import MessageContainer from "./MessageContainer";
import { ForwardedRef, RefObject, forwardRef, useRef } from "react";
import { getAuth } from "firebase/auth";
import useChats from "@/hooks/useChats";

const colors: string[] = [
  "green-400",
  "red-400",
  "purple-500",
  "pink-400",
  "orange-500",
  "emerald-500",
  "purple-400",
  "teal-300",
  "blue-400",
  "yellow-400",
];

interface Props {
  messages: Message[];
  type: ChatType;
}

export default forwardRef(function ChatBoxBody(
  { messages, type }: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const { currentUser } = getAuth();

  return (
    <div
      className="flex flex-col grow justify-end text-white overflow-y-auto custom-scrollbar"
      
    >
      <div className="flex flex-col gap-3 p-4 overflow-y-auto" ref={ref}>
        {messages.map((m) => (
          <MessageContainer
            key={m.sentAt.toString()}
            message={m}
            type={type}
            senderNameColor={colors[0]}
          />
        ))}
      </div>
    </div>
  );
});
