/* eslint-disable react-hooks/exhaustive-deps */
import { Message } from "@/types/message";
import { getAuth } from "firebase/auth";
import React from "react";
import useAppStates from "./useAppState";
import service from "@/services/api";

export default function useMessages(onMessagesChange: () => void) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [initialMsgData, setInitialMsgData] = React.useState(true);
  const { currentChat } = useAppStates();
  const { currentUser } = getAuth();

  const updateMessages = (messages: Message[]) => setMessages(() => messages);

  React.useEffect(() => {
    if (messages.length < 0 && !initialMsgData) return;
    setInitialMsgData(false);
    onMessagesChange();

    if (!currentUser || currentChat === null) return;

    const chatId = currentChat.id;

    if (chatId) {
      messages.forEach((m) => {
        if (!m.readBy.some((email) => email === currentUser.email)) {
          const readBy = [...m.readBy, currentUser.email] as string[];
          service.updateMessage(chatId, m.id, { readBy });
        }
      });
    }
  }, [messages]);

  return { messages, updateMessages };
}
