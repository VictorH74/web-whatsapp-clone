/* eslint-disable react-hooks/exhaustive-deps */
import { Chat, ChatType, Message } from "@/types/chat";
import { formatNumber, getDate, convertToTimestamp } from "@/utils/functions";
import { getAuth } from "firebase/auth";
import React from "react";
import useChatBoxStates from "@/hooks/useChatBoxStates";
import RepliedMsgContainer from "./RepliedMsgContainer";
import MessageMenuBtn from "./MessageMenuBtn";
import MessagePhoto from "./MessagePhoto";
import { ReplyMsgType } from "@/contexts/chatBoxCtx";
import service from "@/services/chat";
import useAppStates from "@/hooks/useAppState";
import { Timestamp } from "firebase/firestore";

interface Props {
  message: Message;
  type: ChatType;
  senderNameColor: string;
  scrollToMsg: (msgId: string, groupId?: string) => void;
  sameSender: boolean;
}

export default React.memo(function MessageContainer(props: Props) {
  const [sender, setSender] = React.useState<string | undefined>(undefined);
  const [senderImgSrc, setSenderPhoto] = React.useState<string | undefined>(
    undefined
  );
  const [owner, setOwner] = React.useState<boolean>(false);
  const [mouseOver, setMouseOver] = React.useState(false);
  const [mouseLeave, setMouseLeave] = React.useState(false);
  const { currentUser } = getAuth();
  const { users, currentChat, updateCurrentChat } = useAppStates();
  const { setReplyMsg } = useChatBoxStates();
  // return focus to the button when we transitioned from !open -> open

  React.useEffect(() => {
    if (props.message.sender === "system") {
      setSender(props.message.sender);
      return;
    }

    if (currentUser?.email === props.message.sender) {
      setSender(currentUser?.displayName || "Usuário não encontrado");
      setOwner(true);
      return;
    }

    if (props.type !== 2) {
      setSender("x");
      return;
    }
    getSender(props.message.sender);
  }, []);

  const handleReply = () => {
    setMouseOver(false);
    const { id, sender, content } = props.message;
    setReplyMsg({ id, sender, content });
  };

  const handleReplyOnPrivate = () => {
    if (
      currentUser === null ||
      !currentUser.email ||
      props.type !== 2 ||
      !currentChat?.id
    )
      return;
    const { id: chatId, name } = currentChat;
    const { id, sender, content } = props.message;
    const msg: ReplyMsgType = {
      id,
      sender,
      content,
      group: { id: chatId, name: name || "Grupo sem nome" },
    };
    const userEmails: string[] = [currentUser.email, sender];
    const chat: Chat = {
      createdAt: new Date(),
      createdBy: currentUser.email,
      members: userEmails,
      name: null,
      type: 1,
      admList: userEmails,
    };

    updateCurrentChat(chat);
    setReplyMsg(msg);
  };

  const getSender = async (senderId: string) => {
    if (senderId in users) {
      const user = users[senderId];
      setSender(user?.displayName);
      setSenderPhoto(user.photoURL);
      return;
    }
    const user = await service.retrieveUser(senderId);
    setSender(user?.displayName);
  };

  const handleMouseOver = () => {
    if (mouseLeave === true) setMouseLeave(false);
    if (mouseOver === false) setMouseOver(() => true);
  };

  const handleMouseLeave = () => {
    setMouseLeave(true);
  };

  const date = getDate(props.message.sentAt as unknown as Timestamp);

  const replyMsgId = props.message.replyMsg?.id;

  const parts = props.message.content.split("<br>");
  const formattedText = parts.map((part, index) => (
    <p
      className={index !== parts.length - 1 ? "block" : "inline-block"}
      key={part}
    >
      {part}
    </p>
  ));

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className={`bg-[#005C4B] text-sm font-normal relative p-2 rounded-md  max-w-lg h-auto ${
        owner
          ? "rounded-tr-none place-self-end"
          : props.message.sender === "system"
          ? "bg-gray-800 place-self-center"
          : `bg-[#202C33] ${
              !props.sameSender && "rounded-tl-none"
            } place-self-start`
      }`}
      key={props.message.id}
      id={props.message.id}
    >
      {props.message.sender !== "system" &&
        props.type === 2 &&
        !owner &&
        !props.sameSender && <MessagePhoto imgSrc={senderImgSrc} />}

      {props.message.replyMsg && (
        <button
          className="w-full text-left hover:cursor-pointer"
          onClick={
            replyMsgId
              ? () => {
                  props.scrollToMsg(replyMsgId);
                }
              : undefined
          }
        >
          <RepliedMsgContainer msg={props.message.replyMsg} />
        </button>
      )}
      {sender !== "system" && (
        <MessageMenuBtn
          owner={owner}
          mouseOver={mouseOver}
          mouseLeave={mouseLeave}
          handleReply={handleReply}
          handleReplyOnPrivate={
            props.type === 2 ? handleReplyOnPrivate : undefined
          }
          onClose={() => setMouseOver(false)}
        />
      )}

      {props.sameSender ||
        (props.type === 2 && !owner && sender !== "system" && (
          <p style={{ color: props.senderNameColor }}>{sender}</p>
        ))}
        {formattedText}

        {sender !== "system" && (
          <span className="float-right translate-x-[2px] translate-y-[6px] ml-1 text-[11px] self-end w-min">{`${formatNumber(
            date.hour
          )}:${formatNumber(date.minute)}`}</span>
        )}
    
    </div>
  );
});
