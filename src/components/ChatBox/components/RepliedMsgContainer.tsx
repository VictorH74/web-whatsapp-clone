/* eslint-disable react-hooks/exhaustive-deps */
import { ReplyMsgType } from "@/contexts/chatBoxCtx";
import { getAuth } from "firebase/auth";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { colors } from "@/utils/constants";
import useAppStates from "@/hooks/useAppState";
import { formatMsgContent } from "@/utils/functions";

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
  const { currentChat, getUser } = useAppStates();

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

      getUser(props.msg.sender, (user) => {
        setSender(user?.displayName || "Usuário não encontrado");
      });
    }
  }, []);

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
        <div className="grow py-1 px-2 break-words w-full">
          <div
            className="flex flex-row text-sm gap-1 items-center"
            style={{ color: colors[colorIndex] }}
          >
            <p>{sender ? sender : "carregando..."}</p>
            {props.msg.group && (
              <>
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: colors[colorIndex] }}
                />
                <p>{props.msg.group.name}</p>
              </>
            )}
          </div>
          {formatMsgContent(props.msg.content, "text-sm max-w-full")}
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
