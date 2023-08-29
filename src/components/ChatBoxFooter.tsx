import TagFacesIcon from "@mui/icons-material/TagFaces";
import AddIcon from "@mui/icons-material/Add";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { ChangeEvent, FormEvent, useState } from "react";
import { Chat, Message } from "@/types/chat";
import useChats from "@/hooks/useChats";
import { generateChatId } from "@/utils/functions";

interface Props {
  currentUserEmail: string;
  scrollToBottom: () => void;
}

export default function ChatBoxFooter({
  currentUserEmail,
  scrollToBottom,
}: Props) {
  const [content, setContent] = useState("");
  const { currentChat, setCurrentChat, service } = useChats();

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
        sender: currentUserEmail,
        readBy: [currentUserEmail],
        sentAt: new Date(),
      };

      let createMsgCollection = false;

      if (!chatId) {
        if (!currentChat) return;

        const newChatId = generateChatId(currentChat.members)

        const retrievedChat = await service.retrieveChat(newChatId);

        if (retrievedChat) {
          setCurrentChat(retrievedChat);

          if (!retrievedChat.id) return;

          await service.createMessage(retrievedChat.id, newMessage, true);

          await service.updateChat(
            retrievedChat.id,
            {
              recentMessage: newMessage,
            },
            true
          );

          return;
        }

        await service.updateChat(newChatId, currentChat);

        const newChat: Chat = { id: newChatId, ...currentChat } as Chat;
        setCurrentChat(newChat);
        chatId = newChatId;

        createMsgCollection = true;
      }

      await service.createMessage(chatId, newMessage, createMsgCollection);

      await service.updateChat(
        chatId,
        {
          recentMessage: newMessage,
        },
        true
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
