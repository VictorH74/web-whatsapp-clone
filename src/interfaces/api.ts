import { Chat, Message } from "@/types/chat";
import { User } from "@/types/user";

export default interface Api {
  getChats(): Promise<Chat[]>;
  createChat(data: Omit<Chat, "id">): Promise<Pick<Chat, "id">>;
  retrieveChat(id: string): Promise<Chat | undefined>;
  updateChat(
    id: string,
    data: Partial<Omit<Chat, "id" | "createdAt" | "createdBy">>,
    merge: boolean
  ): void;
  deleteChat(id: string): void;

  createMessage(
    chatId: string,
    data: Message,
    createFirebaseCollection?: boolean
  ): void;

  getUsersByEmail(email: string, ownerEmail?: string): Promise<User[]>;
  createOrUpdateUser(id: string): Promise<User>;
  retrieveUser(id: string): Promise<User | undefined>;
}
