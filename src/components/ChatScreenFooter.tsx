import TagFacesIcon from "@mui/icons-material/TagFaces";
import AddIcon from "@mui/icons-material/Add";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { ChangeEvent, FormEvent, useState } from "react";
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import firebase from "firebase/compat/app";

interface Props {
  chatId: string;
  currentUserEmail: string;
}

export default function ChatScreenFooter({ chatId, currentUserEmail }: Props) {
  const [text, setText] = useState("");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  // oHp840Jx7cmwKkqhctPe

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setText(() => "")
    try {
      const docRef = doc(db, "chats", chatId);
      await updateDoc(docRef, {
        messages: arrayUnion({
          content: text,
          createdAt: Timestamp.fromDate(new Date),
          sender: currentUserEmail,
          visualizedBy: [currentUserEmail],
        }),
      });
    } catch (e) {
        alert("Error:")
        console.log(e)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-[#202C33] py-3 px-5 flex flex-row items-center gap-3">
        <TagFacesIcon sx={{ color: "#8696A0", fontSize: 30 }} />
        <AddIcon sx={{ color: "#8696A0", fontSize: 30 }} />

        <textarea
          rows={1}
          className="p-3 w-full text-white outline-none bg-[#2A3942] rounded-md resize-none overflow-hidden min-h-[36px]"
          placeholder="Mensagem"
          value={text}
          onChange={handleChange}
        />

        {text ? (
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
