import useChats from "@/hooks/useChats";
import { Chat } from "@/types/chat";
import GroupsIcon from "@mui/icons-material/Groups";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import { cache, useEffect, useState } from "react";
import { EmptyUserImgIcon } from "./IconPresets";
import { getDoc } from "firebase/firestore";
import { User } from "@/types/user";

interface Props {
  data: Chat;
  last: boolean;
}

const chatTileAfterStyle: string =
  "after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:bg-[#202C33] after:h-[1px]";

export default function ChatTile({ data, last }: Props) {
  const [chatPhoto, setChatPhoto] = useState<string | undefined>();
  const [chatTitle, setChatTitle] = useState<string | null>(data.name);
  const { setCurrentChat } = useChats();

  const date = new Date(data.recentMessage?.sentAt.seconds || 0 * 1000);
  const hour = date.getHours();
  const minute = date.getMinutes();

  const fetchUser = cache(async () => {
    const { currentUser } = getAuth();

    if (!currentUser?.email) return;

    const userRef = data.members.filter((m) => m.id !== currentUser.email)[0];

    const user = (await getDoc(userRef)).data() as User;

    setChatPhoto(user.photoURL);
    setChatTitle(user.displayName);
  });

  useEffect(() => {
    if (data.type === 1) {
      fetchUser();
    }
  }, []);

  return (
    <li
      className={`flex flex-row items-center mb-[1px] ${
        false ? "bg-[#2A3942]" : ""
      } hover:bg-[#202C33] hover:cursor-pointer`}
      onClick={() => setCurrentChat(data)}
    >
      <div className="p-2 shrink-0">
        {data.type === 2 ? (
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
          <EmptyUserImgIcon />
        )}
      </div>

      <div
        className={`
      ml-2 w-full p-2 pb-3 relative ${!last && chatTileAfterStyle}`}
      >
        <h2 className="text-white">{chatTitle || "Chat sem nome"}</h2>
        <div
          className={`text-gray-300 text-sm flex ${
            !data.recentMessage ? "opacity-0" : ""
          }`}
        >
          <p className="truncate grow w-32">
            {data?.recentMessage?.content || "-"}
          </p>

          <p className="ml-2">{`${hour}:${minute}`}</p>
        </div>
      </div>
    </li>
  );
}
