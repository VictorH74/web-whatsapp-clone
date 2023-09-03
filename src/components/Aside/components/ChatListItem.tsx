/* eslint-disable react-hooks/exhaustive-deps */
import useAppStates from "@/hooks/useAppStates";
import { Chat } from "@/types/chat";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import React from "react";
import {
  EmptyUserImgIcon,
  GroupIconIcon,
} from "@/components/global/IconPresets";
import { formatNumber, getDate } from "@/utils/functions";

interface Props {
  data: Chat;
  isLastItem: boolean;
}

export default function ChatListItem({ data, isLastItem }: Props) {
  const [chatPhoto, setChatPhoto] = React.useState<string | undefined>();
  const [chatTitle, setChatTitle] = React.useState<string | null>(data.name);
  const [left, setLeft] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const { setCurrentChat, service, users } = useAppStates();

  React.useEffect(() => {
    let left = ref.current?.offsetLeft;
    if (!left) return;
    setLeft(() => left as number);
  }, [ref]);

  const date = getDate(data.recentMessage?.sentAt);

  const fetchUser = React.cache(async () => {
    const { currentUser } = getAuth();
    if (!currentUser?.email) return;
    const userId = data.members.filter((id) => id !== currentUser.email)[0];

    const user = await service.retrieveUser(userId);

    setChatPhoto(user?.photoURL);
    setChatTitle(user?.displayName || "Usuário não encontrado");
  });

  React.useEffect(() => {
    if (data.type === 1) {
      fetchUser();
    }
  }, []);

  return (
    <li
      className={`relative flex flex-row pt-2 pb-3 items-center mb-[1px] ${
        false ? "bg-[#2A3942]" : ""
      } hover:bg-[#202C33] hover:cursor-pointer`}
      onClick={() => setCurrentChat(data)}
    >
      <div className="px-3 shrink-0">
        {data.type === 2 ? (
          <GroupIconIcon />
        ) : chatPhoto ? (
          <Image
            className="rounded-full overflow-hidden"
            alt="user-photo"
            src={chatPhoto}
            width={55}
            height={55}
          />
        ) : (
          <EmptyUserImgIcon />
        )}
      </div>

      <div className={`w-full p-2`}>
        <h2 ref={ref} className="text-white">
          {chatTitle || "Chat sem nome"}
        </h2>

        <div
          className={`text-gray-300 text-sm flex ${
            !data.recentMessage ? "opacity-0" : ""
          }`}
        >
          <p className="truncate grow w-32">
            {data?.recentMessage?.content.replace(/<br>/g, " ") || "-"}
          </p>

          <p className="mx-2">{`${formatNumber(date.hour)}:${formatNumber(
            date.minute
          )}`}</p>
        </div>

        {!isLastItem && (
          <div
            className="absolute bg-[#202C33] h-[1px] bottom-0"
            style={{ right: 0, left: `${left}px` }}
          ></div>
        )}
      </div>
    </li>
  );
}
