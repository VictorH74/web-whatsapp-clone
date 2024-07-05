import { ChatBoxCtx } from "@/contexts/chatBoxCtx";
import { useContext } from "react";

export default function useChatBoxStates() {
  return useContext(ChatBoxCtx);
}
