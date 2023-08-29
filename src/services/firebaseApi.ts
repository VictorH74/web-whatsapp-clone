import Api from "@/interfaces/api";
import { Chat, Message } from "@/types/chat";
import { User } from "@/types/user";
import * as fs from "firebase/firestore";
import { db } from "./firebase";
import { createUserRef } from "@/utils/functions";

const chatCollectionPath = "chat";

export default class FirebaseApi implements Api {
  // Chat----------
  getChats(): Promise<Chat[]> {
    throw new Error("Method not implemented.");
  }

  async createChat(data: Omit<Chat, "id">): Promise<Pick<Chat, "id">> {
    const chatRef = await fs.addDoc(fs.collection(db, "chat"), data);
    return { id: chatRef.id };
  }

  async retrieveChat(id: string): Promise<Chat | undefined> {
    const chatRef = fs.doc(db, "chat", id);

    const retrievedChat = await fs.getDoc(chatRef);
    if (!retrievedChat.exists()) return undefined;
    return { id: retrievedChat.id, ...retrievedChat.data() } as Chat;
  }

  async updateChat(
    id: string,
    data: Omit<Chat, "id">,
    merge: boolean
  ): Promise<void> {
    const chatRef = fs.doc(db, "chat", id);
    await fs.setDoc(chatRef, data, { merge });
  }

  async deleteChat(id: string): Promise<void> {
    const chatRef = fs.doc(db, chatCollectionPath, id as string);
    await fs.deleteDoc(chatRef);
  }

  // Message-------
  async createMessage(
    chatId: string,
    data: Message,
    createFirebaseCollection?: boolean
  ): Promise<void> {
    if (createFirebaseCollection) {
      await fs.setDoc(fs.doc(db, "message", chatId), {});
    }
    await fs.addDoc(fs.collection(db, `/message/${chatId}/messages`), data);
  }

  // User----------
  createOrUpdateUser(
    data: Required<Pick<User, "email"> & Partial<Omit<User, "email">>>,
    merge?: boolean
  ): void {
    let userRef = fs.doc(db, "user", data.email);

    fs.setDoc(userRef, data, {merge});
  }

  async retrieveUser(id: string): Promise<User> {
    const userRef = createUserRef(id);

    const user = (await fs.getDoc(userRef)).data() as User;
    return user;
  }

  async getUsersByEmail(email: string, ownerEmail?: string): Promise<User[]> {
    const q = fs.query(
      fs.collection(db, "user"),
      fs.where("email", ">=", email),
      fs.where("email", "<=", email + "\uf8ff"),
      fs.where("email", "!=", ownerEmail)
    );

    const querySnapshot = await fs.getDocs(q);

    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      users.push(user as User);
    });

    return users;
  }
}
