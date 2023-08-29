import Api from "@/interfaces/api";
import ChatRepository from "@/interfaces/chat";
import { Chat } from "@/types/chat";
import { User } from "@/types/user";

export default class ChatService implements ChatRepository {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  getChats(): Promise<Chat[]> {
    return this.api.getChats();
  }

  createChat(data: Omit<Chat, "id">): Promise<Pick<Chat, "id">> {
    return this.api.createChat(data);
  }

  retrieveChat(id: string): Promise<Chat | undefined> {
    return this.api.retrieveChat(id);
  }

  async updateChat(id: string, data: Partial<Omit<Chat, "id" | "createdAt" | "createdBy">>, merge: boolean = false): Promise<void> {
    return this.api.updateChat(id, data, merge);
  }

  async deleteChat(id: string): Promise<void> {
    return this.api.deleteChat(id);
  }
  
  createOrUpdateUser(id: string): Promise<User> {
    return this.api.createOrUpdateUser(id);
  }

  retrieveUser(id: string): Promise<User | undefined> {
    return this.api.retrieveUser(id);
  }

  getUsersByEmail(email: string, ownerEmail?: string): Promise<User[]> {
    return this.api.getUsersByEmail(email, ownerEmail);
  }
}
