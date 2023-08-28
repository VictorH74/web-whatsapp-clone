import { useContext } from "react";
import { ChatsCtx } from "../contexts/chats";

export default function useChats() {
  return useContext(ChatsCtx);
}
