import TagFacesIcon from "@mui/icons-material/TagFaces";
import AddIcon from "@mui/icons-material/Add";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import React, { useRef } from "react";
import { Chat } from "@/types/chat";
import { generateChatId } from "@/utils/functions";
import useChatBoxStates from "@/hooks/useChatBoxStates";
import RepliedMsgContainer from "./RepliedMsgContainer";
import service from "@/services/api";
import useAppStates from "@/hooks/useAppState";
import { Message } from "@/types/message";

interface Props {
  currentUserEmail: string;
  scrollToBottom: () => void;
}

export default function ChatBoxFooter(props: Props) {
  const [content, setContent] = React.useState("");
  const { currentChat, updateCurrentChat } = useAppStates();
  const { replyMsg, setReplyMsg } = useChatBoxStates();
  const textareRef = useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareRef.current && !content) {
      textareRef.current.style.height = "auto";
    }
  }, [content]);

  React.useEffect(() => {
    if (textareRef.current && replyMsg !== null) {
      textareRef.current.focus();
    }
  }, [replyMsg]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      return;
    }

    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setContent((prevText) => {
        return prevText + "\n";
      });
      const height = e.currentTarget.scrollHeight;
      e.currentTarget.style.height = `${height + 24}px`;
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setContent(value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!content) return;

    setContent(() => "");

    let chatId = currentChat?.id;

    try {
      const newMessage: Omit<Message, "id"> = {
        content: content.split("\n").join("<br>"),
        replyMsg: replyMsg,
        sender: props.currentUserEmail,
        readBy: [props.currentUserEmail],
        sentAt: new Date().toString(),
      };

      if (replyMsg) setReplyMsg(null);

      let createMsgCollection = false;

      if (!chatId) {
        if (!currentChat) return;
        const newChatId = generateChatId(currentChat.members);

        const retrievedChat = await service.retrieveChat(newChatId);

        if (retrievedChat) {
          updateCurrentChat(retrievedChat);

          if (!retrievedChat.id) return;

          await service.createMessage(retrievedChat.id, newMessage, true);
          await service.updateChat(
            retrievedChat.id,
            { recentMessage: newMessage },
            true
          );

          return;
        }

        await service.updateChat(newChatId, currentChat);

        const newChat: Chat = { id: newChatId, ...currentChat } as Chat;
        updateCurrentChat(newChat);
        chatId = newChatId;
        createMsgCollection = true;
      }

      await service.createMessage(chatId, newMessage, createMsgCollection);

      await service.updateChat(chatId, { recentMessage: newMessage }, true);
      props.scrollToBottom();
    } catch (e) {
      alert("Error");
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
            ref={textareRef}
            rows={1}
            className="p-3 w-full text-white outline-none bg-[#2A3942] rounded-md resize-none overflow-hidden min-h-[36px] max-h-36 overflow-y-auto"
            placeholder="Mensagem"
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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
