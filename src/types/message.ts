import { ReplyMsgType } from "@/contexts/chatBoxCtx";

export type Message = {
    id: string;
    replyMsg: ReplyMsgType | null;
    sender: string | string;
    content: string;
    sentAt: string;
    readBy: string[];
  };