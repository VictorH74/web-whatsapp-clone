import useChats from "@/hooks/useChats";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getAuth } from "firebase/auth";

interface Props {
  data: ChatBox;
  index: number;
  last: boolean;
}

export default function ChatTile({ data, index, last }: Props) {
  const auth = getAuth();
  const { setCurrentChatIndexState, currentChatIndex } = useChats();

  const handleClick = () => {
    console.count()
    if (currentChatIndex === index) return
    console.log("click")
    setCurrentChatIndexState(index);
  };

  // console.log(data); #2A3942 
  return (
    <div
      className={`flex flex-row items-center ${currentChatIndex === index ? "bg-[#2A3942]" : ""} hover:bg-[#202C33] hover:cursor-pointer`}
      onClick={handleClick}
    >
      <div className="p-2">
        <AccountCircleIcon sx={{ color: "white", fontSize: "55px" }} />
      </div>

      <div
        className={`ml-2 w-full p-2 pb-3 ${
          !last ? "border-b-[1px] border-b-[#202C33]" : ""
        }`}
      >
        <h2 className="text-white">
          {data.users
            .filter((u) => u !== auth.currentUser?.email)
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
