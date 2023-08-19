import useChats from "@/hooks/useChats";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import { getAuth } from "firebase/auth";

interface Props {
  data: ChatBox;
  index: number;
  last: boolean;
}

export default function ChatTile({ data, index, last }: Props) {
  const { currentUser } = getAuth();
  const { setCurrentChatIndexState, currentChatIndex } = useChats();

  const handleClick = () => {
    if (currentChatIndex === index) return;

    setCurrentChatIndexState(index);
  };

  return (
    <div
      className={`flex flex-row items-center ${
        currentChatIndex === index ? "bg-[#2A3942]" : ""
      } hover:bg-[#202C33] hover:cursor-pointer`}
      onClick={handleClick}
    >
      <div className="p-2">
        {data.users.length > 2 ? (
          <div className="m-[6px] grid place-items-center bg-white w-[45px] h-[45px] rounded-full">
            <GroupsIcon sx={{ color: "black", fontSize: 20 }} />
          </div>
        ) : (
          <AccountCircleIcon sx={{ color: "white", fontSize: "55px" }} />
        )}
      </div>

      <div
        className={`ml-2 w-full p-2 pb-3 ${
          !last ? "border-b-[1px] border-b-[#202C33]" : ""
        }`}
      >
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
