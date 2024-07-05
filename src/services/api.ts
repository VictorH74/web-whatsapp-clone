import Api from "@/interfaces/api";
import ChatRepository, { UpdateChatDataType } from "@/interfaces/chat";
import { Chat } from "@/types/chat";
import { User } from "@/types/user";
import FirebaseApi from "./firebaseApi";
import UserRepository, { PartionalUserWithRequiredEmail } from "@/interfaces/user";
import MessageRepository from "@/interfaces/message";
import { Message } from "@/types/message";

class ApiService implements ChatRepository, MessageRepository, UserRepository {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }
  // Chat----------
  getChats(): Promise<Chat[]> {
    return this.api.getChats();
  }

  createChat(data: Omit<Chat, "id">): Promise<Pick<Chat, "id">> {
    return this.api.createChat(data);
  }

  retrieveChat(id: string): Promise<Chat | undefined> {
    return this.api.retrieveChat(id);
  }

  async updateChat(
    id: string,
    data: UpdateChatDataType,
    merge: boolean = false
  ): Promise<void> {
    return this.api.updateChat(id, data, merge);
  }

  async deleteChat(id: string): Promise<void> {
    return this.api.deleteChat(id);
  }

  // Message-------
  async createMessage(
    chatId: string,
    data: Omit<Message, "id">,
    createFirebaseCollection?: boolean
  ): Promise<void> {
    return this.api.createMessage(chatId, data, createFirebaseCollection);
  }

  updateMessage(
    chatId: string,
    messageId: string,
    data: Partial<Omit<Message, "id" | "sentAt" | "sender">>
  ): void {
    return this.api.updateMessage(chatId, messageId, data);
  }

  // User----------
  createOrUpdateUser(
    data: PartionalUserWithRequiredEmail,
    merge?: boolean
  ): void {
    return this.api.createOrUpdateUser(data, merge);
  }

  retrieveUser(id: string): Promise<User | undefined> {
    return this.api.retrieveUser(id);
  }

  getUsersByEmail(email: string, ownerEmail?: string): Promise<User[]> {
    return this.api.getUsersByEmail(email, ownerEmail);
  }

  getUsersByEmailList(emails: string[]): Promise<User[]> {
    return this.api.getUsersByEmailList(emails);
  }
}

const service = new ApiService(new FirebaseApi());

export default service;
