import { DocumentReference, Timestamp } from "firebase/firestore";

export type Chat = {
  id?: string;
  createdAt: Timestamp;
  createdBy: string;
  members: DocumentReference[];
  name: string | null;
  recentMessage?: Message;
  type: ChatType;
  admList: DocumentReference[];
};

export type ChatType = 1 | 2;

export type Message = {
  sender: DocumentReference | string;
  content: string;
  sentAt: Timestamp;
  readBy: DocumentReference[];
};
