import { ReplyMsgType } from "@/contexts/chatBoxCtx";

export type Chat = {
  id?: string;
  createdAt: Date;
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
  sentAt: Date;
  readBy: string[];
};
