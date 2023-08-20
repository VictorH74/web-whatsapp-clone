import useChats from "@/hooks/useChats";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import { getAuth } from "firebase/auth";
import Image from "next/image";

interface Props {
  data: ChatBox;
  index: number;
  last: boolean;
}

const chatTileAfterStyle: string = "after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:bg-[#202C33] after:h-[1px]"

export default function ChatTile({ data, index, last }: Props) {
  const { currentUser } = getAuth();
  const { setCurrentChatIndexState, currentChatIndex } = useChats();

  const handleClick = () => {
    if (currentChatIndex === index) return;

    setCurrentChatIndexState(index);
  };

  const chatPhoto = data.users.filter(
    (u) => u.email !== (currentUser?.email || "")
  )[0].photoUrl;

  return (
    <div
      className={`flex flex-row items-center mb-[1px] ${
        currentChatIndex === index ? "bg-[#2A3942]" : ""
      } hover:bg-[#202C33] hover:cursor-pointer`}
      onClick={handleClick}
    >
      <div className="p-2">
        {data.type === "group" ? (
          <div className="grid place-items-center m-[5px] bg-white w-[45px] h-[45px] rounded-full">
            <GroupsIcon sx={{ color: "black", fontSize: 20 }} />
          </div>
        ) : chatPhoto ? (
          <div className="grid place-items-center overflow-hidden">
            <Image
            className="rounded-full mx-[7px] overflow-hidden"
            alt="user-photo"
            src={chatPhoto}
            width={55}
            height={55}
          />
          </div>
          
        ) : (
          <AccountCircleIcon sx={{ color: "white", fontSize: "55px" }} />
        )}
      </div>

      <div className={`
      ml-2 w-full p-2 pb-3 relative ${!last && chatTileAfterStyle}`
      }>
        <h2 className="text-white">
          {data.users
            .filter((u) => u.email !== currentUser?.email)
            .map((u) => u.name)
            .join(",")}
        </h2>
        <p
          className={`text-gray-300 text-sm ${
            !data.messages ? "opacity-0" : ""
          }`}
        >
          {data?.messages && data?.messages.length > 0
            ? data.messages[data.messages.length - 1].content
            : "-"}
        </p>
      </div>

    </div>
  );
}
