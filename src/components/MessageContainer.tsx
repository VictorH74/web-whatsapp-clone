/* eslint-disable react-hooks/exhaustive-deps */
import useAppStates from "@/hooks/useAppStates";
import { Chat, ChatType, Message } from "@/types/chat";
import { formatNumber, getDate } from "@/utils/functions";
import { getAuth } from "firebase/auth";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import useChatBoxStates from "@/hooks/useChatBoxStates";
import RepliedMsgContainer from "./RepliedMsgContainer";

interface Props {
  message: Message;
  type: ChatType;
  senderNameColor: string;
}

export default React.memo(function MessageContainer({
  message,
  type,
  senderNameColor,
}: Props) {
  const [sender, setSender] = React.useState<string | undefined>(undefined);
  const [owner, setOwner] = React.useState<boolean>(false);
  const [mouseOver, setMouseOver] = React.useState(false);
  const { currentUser } = getAuth();
  const { service, users, setCurrentChat } = useAppStates();
  const { setReplyMsg } = useChatBoxStates();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setMouseOver(false);
    setOpen(false);
  };

  type ReplyMsgType = {
    id: string;
    sender: string;
    content: string;
  };

  const handleReply = () => {
    setMouseOver(false);
    const { id, sender, content } = message;
    setReplyMsg({ id, sender, content });
  };

  const handleReplyOnPrivate = () => {
    if (currentUser === null || !currentUser.email) return;

    const { id, sender, content } = message;

    const msg: ReplyMsgType = { id, sender, content };

    let userEmails: string[] = [currentUser.email, msg.sender];

    const chat: Chat = {
      createdAt: new Date(),
      createdBy: currentUser.email,
      members: userEmails,
      name: null,
      type: 1,
      admList: userEmails,
    };

    setMouseOver(false);
    setCurrentChat(chat);
    setReplyMsg(msg);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const date = getDate(message.sentAt);

  const getSender = async (senderId: string) => {
    if (senderId in users) {
      const user = users[senderId];
      setSender(user?.displayName);
      return;
    }
    const user = await service.retrieveUser(senderId);
    setSender(user?.displayName);
  };

  const handleMouseOver = () => {
    if (mouseOver === false) setMouseOver(() => true);
  };

  const handleMouseLeave = () => {
    if (mouseOver === true && open === false) {
      setMouseOver(() => false);
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (message.sender === "system") {
      setSender(message.sender);
      return;
    }

    if (currentUser?.email === message.sender) {
      setSender(currentUser?.displayName || "-");
      setOwner(true);
      return;
    }

    if (type !== 2) {
      setSender("x");
      return;
    }

    getSender(message.sender);
  }, []);

  if (!sender) {
    return <></>;
  }

  // #00000020

  return (
    <div
      id={message.id}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className={`bg-[#005C4B] text-sm font-normal relative p-2 rounded-md w-auto max-w-lg h-auto ${
        sender === "system"
          ? "self-center bg-gray-800"
          : owner
          ? "self-end rounded-tr-none"
          : "self-start bg-[#202C33] rounded-tl-none"
      }`}
      key={message.sentAt.toString()}
    >
      {message.replyMsg && <RepliedMsgContainer msg={message.replyMsg} />}
      {sender !== "system" && (
        <>
          <button
            ref={anchorRef}
            onClick={handleToggle}
            className={`absolute duration-150 z-10 ${
              mouseOver ? "opacity-1 scale-1" : "opacity-0 -scale-0"
            } right-0 top-0 p-1 rounded-bl-xl ${
              owner ? "bg-[#005C4B]" : "bg-[#202C33]"
            }`}
          >
            <ExpandMoreIcon />
          </button>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
            className="z-[60]"
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  zIndex: 60,
                  transformOrigin:
                    placement === "bottom-start" ? "left top" : "left bottom",
                }}
              >
                <Paper sx={{ backgroundColor: "#233138", color: "#cacaca" }}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem
                        onClick={(e) => {
                          handleReply();
                          handleClose(e);
                        }}
                      >
                        Responder
                      </MenuItem>
                      {currentUser?.email !== message.sender && (
                        <MenuItem
                          onClick={(e) => {
                            handleReplyOnPrivate();
                            handleClose(e);
                          }}
                        >
                          Responder em particular
                        </MenuItem>
                      )}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </>
      )}

      {type === 2 && !owner && sender !== "system" && (
        <p className="" style={{ color: senderNameColor }}>
          {sender}
        </p>
      )}
      <p className="break-words ">
        {message.content}
        {sender !== "system" && (
          <span className="float-right translate-x-[2px] translate-y-[6px] text-[11px] self-end w-min">{`${formatNumber(
            date.hour
          )}:${formatNumber(date.minute)}`}</span>
        )}
      </p>
    </div>
  );
});
