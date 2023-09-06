import React from "react";
import UserListItem from "./UserListItem";
import { getAuth } from "firebase/auth";
import Loading from "@/components/global/Loading";
import { User } from "@/types/user";
import NewChatContainer from "./NewChatContainer";

import { ComunityIcon, GroupIconIcon } from "@/components/global/IconPresets";
import { Chat } from "@/types/chat";
import useFetchUsers from "@/hooks/useFetchUsers";
import SearchUserInput from "./SearchUserInput";
import useAsideState from "@/hooks/useAsideState";
import useAppStates from "@/hooks/useAppState";

export default function NewPrivateChat() {
  const [emailValue, setEmailValue] = React.useState("");
  const { currentUser } = getAuth();
  const { updateCurrentChat } = useAppStates();
  const { setAsideContentNumber } = useAsideState();
  const { isLoading, users, resetFn } = useFetchUsers(
    emailValue,
    currentUser?.email || ""
  );

  const handleItemClick = async (userObj: User) => {
    if (!currentUser?.email) {
      alert("Email não encontrado");
      return;
    }

    const userEmails: string[] = [currentUser.email, userObj.email];

    const chat: Chat = {
      createdAt: new Date().toString(),
      createdBy: currentUser.email,
      members: userEmails,
      name: null,
      type: 1,
      admList: userEmails,
    };

    updateCurrentChat(chat);
    close();
  };

  const close = () => {
    setAsideContentNumber(0);
    setEmailValue("");
    resetFn();
  };

  return (
    <NewChatContainer
      title="Nova Conversa"
      backwardFn={close}
      contentNumber={1}
    >
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
            onClick={() => setAsideContentNumber(2)}
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

const AditionalItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ icon, label, disabled = false, onClick }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [left, setLeft] = React.useState(0);

  React.useEffect(() => {
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
      onClick={onClick}
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
