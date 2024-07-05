import { Chat } from "@/types/chat";

export type UpdateChatDataType = Partial<Omit<Chat, "id" | "createdAt" | "createdBy">>

export default interface ChatRepository {
  getChats(): Promise<Chat[]>;
  createChat(data: Omit<Chat, "createdAt">): Promise<Pick<Chat, "id">>;
  retrieveChat(id: string): Promise<Chat | undefined>;
  updateChat(
    id: string,
    data: UpdateChatDataType,
    merge?: boolean
  ): void;
  deleteChat(id: string): void;
}
