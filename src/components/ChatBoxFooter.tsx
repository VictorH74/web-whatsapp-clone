import TagFacesIcon from "@mui/icons-material/TagFaces";
import AddIcon from "@mui/icons-material/Add";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { ChangeEvent, FormEvent, useState } from "react";
import { Chat, Message } from "@/types/chat";
import useAppStates from "@/hooks/useAppStates";
import { generateChatId } from "@/utils/functions";
import useChatBoxStates from "@/hooks/useChatBoxStates";
import RepliedMsgContainer from "./RepliedMsgContainer";

interface Props {
  currentUserEmail: string;
  scrollToBottom: () => void;
}

export default function ChatBoxFooter({
  currentUserEmail,
  scrollToBottom,
}: Props) {
  const [content, setContent] = useState("");
  const { currentChat, setCurrentChat, service } = useAppStates();
  const { replyMsg, setReplyMsg } = useChatBoxStates();

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
      const newMessage: Omit<Message, "id"> = {
        content,
        replyMsg: replyMsg,
        sender: currentUserEmail,
        readBy: [currentUserEmail],
        sentAt: new Date(),
      };

      if (replyMsg) setReplyMsg(null);

      let createMsgCollection = false;

      if (!chatId) {
        if (!currentChat) return;

        const newChatId = generateChatId(currentChat.members);

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
    <div className="flex flex-col bg-[#202C33] py-3 px-5 gap-2">
      {replyMsg && (
        <RepliedMsgContainer
          msg={replyMsg}
          deleteFn={() => {
            setReplyMsg(null);
          }}
        ></RepliedMsgContainer>
      )}
      <form onSubmit={handleSubmit}>
        <div className=" flex flex-row items-center gap-3 custom-scrollbar">
          <button onClick={() => alert("Não funcional")}>
            <TagFacesIcon sx={{ color: "#8696A0", fontSize: 30 }} />
          </button>
          <button onClick={() => alert("Não funcional")}>
            <AddIcon sx={{ color: "#8696A0", fontSize: 30 }} />
          </button>

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
            <button
              type="button"
              onClick={() =>
                alert("Não é possivel mandar audio... 😥 (ainda 😎)")
              }
            >
              <MicIcon sx={{ color: "#8696A0", fontSize: 30 }} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
