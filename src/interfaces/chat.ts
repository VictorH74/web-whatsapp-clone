import { Chat, Message } from "@/types/chat";
import { User } from "@/types/user";

export default interface ChatRepository {
  getChats(): Promise<Chat[]>;
  createChat(data: Omit<Chat, "createdAt">): Promise<Pick<Chat, "id">>;
  retrieveChat(id: string): Promise<Chat | undefined>;
  updateChat(
    id: string,
    data: Partial<Omit<Chat, "id" | "createdAt" | "createdBy">>
  ): void;
  deleteChat(id: string): void;

  createMessage(
    chatId: string,
    data: Message,
    createFirebaseCollection?: boolean
  ): void;

  getUsersByEmail(email: string): Promise<User[]>;
  createOrUpdateUser(
    data: Required<Pick<User, "email"> & Partial<Omit<User, "email">>>
  ): void;
  retrieveUser(id: string): Promise<User | undefined>;
}
