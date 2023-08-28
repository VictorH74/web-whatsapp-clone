import TagFacesIcon from "@mui/icons-material/TagFaces";
import AddIcon from "@mui/icons-material/Add";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { Chat, Message } from "@/types/chat";
import { getAuth } from "firebase/auth";
import useChats from "@/hooks/useChats";

interface Props {
  currentUserEmail: string;
  scrollToBottom: () => void;
}

export default function ChatBoxFooter({
  currentUserEmail,
  scrollToBottom,
}: Props) {
  const [content, setContent] = useState("");
  const { currentChat, setCurrentChat } = useChats();

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setContent(() => "");

    let chatId = currentChat?.id;

    try {
      const newMessage: Message = {
        content,
        sender: doc(db, "user", currentUserEmail),
        readBy: [doc(db, "user", currentUserEmail)],
        sentAt: Timestamp.fromDate(new Date()),
      };

      if (!chatId) {
        if (!currentChat) return;

        const newChatId = currentChat.members.map((m) => m.id).join("+");

        const chatRef = doc(db, "chat", newChatId);

        const retrievedChat = await getDoc(chatRef);

        if (retrievedChat.exists()) {
          setCurrentChat({
            id: retrievedChat.id,
            ...retrievedChat.data(),
          } as Chat);

          await setDoc(doc(db, "message", retrievedChat.id), {});
          await addDoc(
            collection(db, `/message/${retrievedChat.id}/messages`),
            newMessage
          );
          await setDoc(
            doc(db, "chat", retrievedChat.id),
            {
              recentMessage: newMessage,
            },
            { merge: true }
          );

          return;
        }

        await setDoc(chatRef, currentChat);
        const newChat: Chat = { id: newChatId, ...currentChat } as Chat;
        setCurrentChat(newChat);
        chatId = newChatId;
        await setDoc(doc(db, "message", chatId), {});
      }

      await addDoc(collection(db, `/message/${chatId}/messages`), newMessage);
      await setDoc(
        doc(db, "chat", chatId),
        {
          recentMessage: newMessage,
        },
        { merge: true }
      );

      scrollToBottom();
    } catch (e) {
      alert("Error:");
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-[#202C33] py-3 px-5 flex flex-row items-center gap-3 custom-scrollbar">
        <TagFacesIcon sx={{ color: "#8696A0", fontSize: 30 }} />
        <AddIcon sx={{ color: "#8696A0", fontSize: 30 }} />

        <textarea
          rows={1}
          className="p-3 w-full text-white outline-none bg-[#2A3942] rounded-md resize-none overflow-hidden min-h-[36px] max-h-36 overflow-y-auto"
          placeholder="Mensagem"
          value={content}
          onChange={handleChange}
        />

        {content ? (
          <button type="submit">
            <SendIcon sx={{ color: "#8696A0", fontSize: 30 }} />
          </button>
        ) : (
          <MicIcon sx={{ color: "#8696A0", fontSize: 30 }} />
        )}
      </div>
    </form>
  );
}
