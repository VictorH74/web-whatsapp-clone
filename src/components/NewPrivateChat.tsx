import {  FC, ReactNode, useEffect, useRef, useState } from "react";
import { DocumentReference, Timestamp } from "firebase/firestore";
import UserListItem from "./UserListItem";
import { getAuth } from "firebase/auth";
import Loading from "./Loading";
import { User } from "@/types/user";
import NewChatContainer from "./NewChatContainer";

import { ComunityIcon, GroupIconIcon } from "./IconPresets";
import useChats from "@/hooks/useChats";
import { Chat } from "@/types/chat";
import useFetchUsers from "@/hooks/useFetchUsers";
import { createUserRef } from "@/utils/functions";
import SearchUserInput from "./SearchUserInput";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
}

export default function NewPrivateChat({ show, setShow }: Props) {
  const [emailValue, setEmailValue] = useState("");
  const { currentUser } = getAuth();
  const { setCurrentChat } = useChats();
  const { isLoading, users, resetFn } = useFetchUsers(
    emailValue,
    currentUser?.email || ""
  );

  const handleItemClick = async (userObj: User) => {
    if (!currentUser?.email) {
      alert("Email não encontrado");
      return;
    }

    let userRefs: DocumentReference[] = [
      createUserRef(currentUser.email),
      createUserRef(userObj.email),
    ];
    const chat: Chat = {
      createdAt: Timestamp.fromDate(new Date()),
      createdBy: currentUser.email,
      members: userRefs,
      name: null,
      type: 1,
      admList: userRefs,
    };
    setCurrentChat(chat);
    close();
  };

  const close = () => {
    setShow(false);
    setEmailValue("");
    resetFn();
  };

  return (
    <NewChatContainer show={show} title="Nova Conversa" backwardFn={close}>
      <div>
        <div className="p-3 text-white">
          <SearchUserInput
            value={emailValue}
            onChange={(e) => {
              setEmailValue(e.currentTarget.value);
            }}
          />
        </div>

        <ul>
          <AditionalItem
            icon={<GroupIconIcon bgColor="#00A884" />}
            label="Novo grupo"
          />
          <AditionalItem
            icon={<ComunityIcon bgColor="#00A884" />}
            label="Nova comunidade"
          />

          {isLoading ? (
            <div className="p-10 w-full h-full grid place-items-center">
              <Loading />
            </div>
          ) : (
            users.map((u, i) => (
              <UserListItem
                key={u.email}
                isLastItem={i === users.length - 1}
                user={u}
                onClick={handleItemClick}
              />
            ))
          )}
        </ul>
      </div>
    </NewChatContainer>
  );
}

const AditionalItem: FC<{
  icon: ReactNode;
  label: string;
  disabled?: boolean;
}> = ({ icon, label, disabled = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    let left = ref.current?.offsetLeft;
    if (!left) return;
    setLeft(() => left as number);
  }, [ref]);

  return (
    <li
      className={`
        px-2
        py-4
        relative 
        flex 
        flex-row 
        items-center 
        hover:bg-[#202C33] 
        hover:cursor-pointer
      `}
      onClick={() => {}}
    >
      {icon}

      <div className={`ml-2 w-full p-2`}>
        <h2 ref={ref} className="text-white">
          {label}
        </h2>
        <div
          className="absolute bg-[#202C33] h-[1px] bottom-0"
          style={{ right: 0, left: `${left}px` }}
        ></div>
      </div>
    </li>
  );
};
