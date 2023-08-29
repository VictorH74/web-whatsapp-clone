import { Chat } from "@/types/chat";
import { User } from "@/types/user";

export default interface ChatRepository {
  getChats(): Promise<Chat[]>;
  createChat(data: Omit<Chat, "createdAt">): Promise<Pick<Chat, "id">>;
  retrieveChat(id: string): Promise<Chat | undefined>;
  updateChat(id: string, data: Partial<Omit<Chat, "id" | "createdAt" | "createdBy">>): void;
  deleteChat(id: string): void;
  
  getUsersByEmail(email: string): Promise<User[]>;
  createOrUpdateUser(id: string): Promise<User>;
  retrieveUser(id: string): Promise<User | undefined>;
}
