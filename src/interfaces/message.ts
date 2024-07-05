import { Message } from "@/types/message";

export default interface MessageRepository {
    createMessage(
        chatId: string,
        data: Omit<Message, "id">,
        createFirebaseCollection?: boolean
    ): void;
    updateMessage(
        chatId: string,
        messageId: string,
        data: Partial<Omit<Message, "id" | "sentAt" | "sender">>
    ): void;
}