export type Chat = {
  id?: string;
  createdAt: Date;
  createdBy: string;
  members: string[];
  name: string | null;
  recentMessage?: Message;
  type: ChatType;
  admList: string[];
};

export type ChatType = 1 | 2;

export type Message = {
  sender: string | string;
  content: string;
  sentAt: Date;
  readBy: string[];
};
