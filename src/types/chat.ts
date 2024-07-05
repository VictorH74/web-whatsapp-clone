import { Message } from "./message";

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
