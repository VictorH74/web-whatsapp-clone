import { ReplyMsgType } from "@/contexts/chatBoxCtx";

export type Chat = {
  id?: string;
  createdAt: string;
  createdBy: string;
  members: string[];
  name: string | null;
  recentMessage?: Omit<Message, "id">;
  type: ChatType;
  admList: string[];
};

export type ChatType = 1 | 2;

export type Message = {
  id: string;
  replyMsg: ReplyMsgType | null;
  sender: string | string;
  content: string;
  sentAt: string;
  readBy: string[];
};
