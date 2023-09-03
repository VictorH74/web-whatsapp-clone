/* eslint-disable react-hooks/exhaustive-deps */
import { ReplyMsgType } from "@/contexts/chatBoxCtx";
import { getAuth } from "firebase/auth";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import useAppStates from "@/hooks/useAppStates";
import { colors } from "@/utils/constants";

interface Props {
  msg: ReplyMsgType;
  deleteFn?: () => void;
  ref?: React.RefObject<HTMLDivElement>;
  clickable?: boolean;
}

export default function RepliedMsgContainer(props: Props) {
  const [colorIndex, setColorIndex] = React.useState(0);
  const [sender, setSender] = React.useState("");
  const { currentUser } = getAuth();
  const { currentChat, users, service } = useAppStates();

  const parts = props.msg.content.split("<br>");
  const formattedText = parts.map((part, index) => {
    if (index === parts.length - 1) {
      return part;
    } else {
      return (
        <>
          {part}
          <br />
        </>
      );
    }
  });

  React.useEffect(() => {
    if (currentUser?.email === props.msg.sender) {
      setColorIndex(1);
      setSender("você");
      return;
    }

    if (currentChat && currentChat.id) {
      if (currentChat.type === 2) {
        const discoveredColorsObj = localStorage.getItem(currentChat.id);

        if (!discoveredColorsObj) return;

        const colorsObj = JSON.parse(discoveredColorsObj) as Record<
          string,
          number
        >;

        setColorIndex(() => colorsObj[props.msg.sender]);
      }

      getSender(props.msg.sender);
    }
  }, []);

  const getSender = async (senderId: string) => {
    if (senderId in users) {
      const user = users[senderId];
      setSender(user?.displayName);
      return;
    }
    const user = await service.retrieveUser(senderId);
    setSender(user?.displayName || "Usuário não encontrado");
  };

  return (
    <div className={`flex text-white h-auto  ${!props.deleteFn && "mb-1"}`}>
      <div
        className={`bg-[#00000040] grow overflow-hidden rounded-md flex  h-auto ${
          props.clickable ? "hover:cursor-pointer" : ""
        }`}
        onClick={
          props.clickable
            ? () => {
                console.log(props.ref?.current?.offsetTop, props.msg.id);
              }
            : undefined
        }
      >
        <div
          style={{ backgroundColor: colors[colorIndex] }}
          className={`w-1 h-full`}
        />
        <div className="grow py-1 px-2">
          <p style={{ color: colors[colorIndex] }} className={`text-sm mb-1`}>
            {sender ? sender : "carregando..."}
          </p>
          <p className="text-xs max-w-md h-auto break-words">
            {formattedText}
          </p>
        </div>
      </div>

      {props.deleteFn && (
        <button onClick={props.deleteFn}>
          <ClearIcon
            sx={{ color: "#8696A0", fontSize: 30, marginLeft: "15px" }}
          />
        </button>
      )}
    </div>
  );
}
