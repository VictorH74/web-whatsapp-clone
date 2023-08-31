/* eslint-disable react-hooks/exhaustive-deps */
import { ReplyMsgType } from "@/contexts/chatBoxCtx";
import { getAuth } from "firebase/auth";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import { colors } from "./ChatBoxBody";
import useAppStates from "@/hooks/useAppStates";

interface Props {
  msg: ReplyMsgType;
  deleteFn?: () => void;
}

export default function RepliedMsgContainer({ msg, deleteFn }: Props) {
  const [colorIndex, setColorIndex] = useState(0);
  const [sender, setSender] = useState("");
  const { currentUser } = getAuth();
  const { currentChat, users, service } = useAppStates();

  const getSender = async (senderId: string) => {
    if (senderId in users) {
      const user = users[senderId];
      setSender(user?.displayName);
      return;
    }
    const user = await service.retrieveUser(senderId);
    setSender(user?.displayName || "Indefinido");
  };

  useEffect(() => {
    if (currentUser?.email === msg.sender) {
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

        setColorIndex(() => colorsObj[msg.sender]);
      }

      getSender(msg.sender);
    }
  }, []);

  if (!sender) return <div></div>;

  return (
    <div className={`flex text-white h-auto ${!deleteFn && "mb-1"}`}>
      <div className="bg-[#00000040] grow overflow-hidden rounded-md flex  h-auto">
        <div
          style={{ backgroundColor: colors[colorIndex] }}
          className={`w-1 h-full`}
        />
        <div className="grow py-1 px-2">
          <p style={{ color: colors[colorIndex] }} className={`text-sm mb-1`}>
            {sender || msg.sender}
          </p>
          <p className="text-xs max-w-md h-auto break-words">{msg.content}</p>
        </div>
      </div>

      {deleteFn && (
        <button onClick={deleteFn}>
          <ClearIcon
            sx={{ color: "#8696A0", fontSize: 30, marginLeft: "15px" }}
          />
        </button>
      )}
    </div>
  );
}
