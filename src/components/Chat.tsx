import AccountCircleIcon from "@mui/icons-material/AccountCircle";

type ChatData = {
  id: number;
  username: string;
  messages?: string[] | [];
};

interface Props {
  data: ChatData;
  last: boolean;
}

export default function Chat({ data, last }: Props) {
  return (
    <div className="flex flex-row items-center hover:bg-[#202C33]">
      <div className="p-2">
        <AccountCircleIcon sx={{ color: "white", fontSize: "55px" }} />
      </div>
      
      <div className={`ml-2 w-full p-2 pb-3 ${!last ? "border-b-[1px] border-b-[#202C33]" : ""}`}>
        <h2 className="text-white">{data.username}</h2>
        <p
          className={`text-gray-300 text-sm ${
            !data.messages ? "opacity-0" : ""
          }`}
        >
          {data?.messages ? data.messages[-1] : "-"}
        </p>
      </div>
    </div>
  );
}
