import TagFacesIcon from "@mui/icons-material/TagFaces";
import AddIcon from "@mui/icons-material/Add";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { ChangeEvent, FormEvent, useState } from "react";
import { Timestamp, addDoc, collection, doc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Message } from "@/types/chat";

interface Props {
  chatId: string;
  currentUserEmail: string;
  scrollToBottom: () => void;
}

export default function ChatBoxFooter({ chatId, currentUserEmail, scrollToBottom }: Props) {
  const [content, setContent] = useState("");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setContent(() => "");

    try {
      const newMessage: Message = {
        content,
        sender: doc(db, "user", currentUserEmail),
        readBy: [doc(db, "user", currentUserEmail)],
        sentAt: Timestamp.fromDate(new Date()),
      };

      await addDoc(collection(db, `/message/${chatId}/messages`), newMessage);
      scrollToBottom()
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
