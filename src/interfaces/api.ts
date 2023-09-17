import ChatRepository from "./chat";
import MessageRepository from "./message";
import UserRepository from "./user";

export type Api = ChatRepository & MessageRepository & UserRepository

export default Api
