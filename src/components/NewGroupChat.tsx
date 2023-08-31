import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserListItem from "./UserListItem";
import { getAuth } from "firebase/auth";
import Loading from "./Loading";
import { User } from "@/types/user";
import { Chat, Message } from "@/types/chat";
import NewChatContainer from "./NewChatContainer";
import useFetchUsers from "@/hooks/useFetchUsers";
import SearchUserInput from "./SearchUserInput";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { GroupIconIcon } from "./IconPresets";
import CheckIcon from "@mui/icons-material/Check";
import useAppStates from "@/hooks/useAppStates";
import useAsideState from "@/hooks/useAsideState";

export default React.memo(function NewGroupChat() {
  const [submiting, setSubmiting] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);
  const [emailValue, setEmailValue] = React.useState("");
  const [groupName, setGroupName] = React.useState("");
  const [next, setNext] = React.useState(false);
  const { currentUser } = getAuth();
  const { service, setCurrentChat } = useAppStates();
  const { setAsideContentNumber } = useAsideState();
  const { isLoading, users, resetFn } = useFetchUsers(
    emailValue,
    currentUser?.email || ""
  );
  const handleItemClick = (userObj: User, selected?: boolean) => {
    if (selected) {
      setSelectedUsers((prev) => prev.filter((u) => u.email !== userObj.email));
    }
    setSelectedUsers((prev) => [...prev, userObj]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmiting(true);

    if (!currentUser?.email) {
      alert("Email não encontrado");
      return;
    }
    if (!currentUser?.displayName) {
      alert("Nome do usuário não encontrado");
      return;
    }

    let usersEmail: string[] = [
      currentUser.email,
      ...selectedUsers.map((u) => u.email),
    ];

    const owner = currentUser?.email;

    const newChat: Chat = {
      members: usersEmail,
      admList: [owner],
      type: 2,
      createdBy: owner,
      name: groupName,
      createdAt: new Date(),
    };

    const createdChat = await service.createChat(newChat);

    const newMessage: Omit<Message, "id"> = {
      content: `Nova conversa criada por ${currentUser?.displayName}`,
      sender: "system",
      readBy: [],
      replyMsg: null,
      sentAt: new Date(),
    };

    if (!createdChat.id) {
      console.error();
      return;
    }

    await service.createMessage(createdChat.id, newMessage, true);

    setCurrentChat({ id: createdChat.id, ...newChat });

    close();
  };

  const close = () => {
    setAsideContentNumber(0);
    setNext(false);
    setEmailValue("");
    setGroupName("");
    setSubmiting(false);
    setSelectedUsers([]);
    resetFn();
  };

  return (
    <>
      <NewChatContainer
        title="Adicionar Participantes ao Grupo"
        backwardFn={close}
        className="z-[60]"
        contentNumber={2}
      >
        <div className="text-white grow">
          <div className="grid p-2">
            <SearchUserInput
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.currentTarget.value);
              }}
            />
          </div>
          <ul>
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
                  selected={selectedUsers.map((u) => u.email).includes(u.email)}
                  onClick={handleItemClick}
                />
              ))
            )}
          </ul>
        </div>
        {selectedUsers.length > 0 && (
          <Button onClick={() => setNext(true)}>
            <ArrowForwardIcon sx={{ fontSize: 25 }} />
          </Button>
        )}
      </NewChatContainer>

      <div
        className={`text-white bg-[#111B21] flex flex-col absolute z-[60] inset-0 ${
          next ? "" : "-translate-x-full"
        } duration-200`}
      >
        <div className="bg-[#202C33] px-6 pb-4 pt-16">
          {next && (
            <div className="text-white flex gap-7 fade-out">
              <button onClick={() => setNext(false)}>
                <ArrowBackIcon sx={{ fontSize: 25 }} />
              </button>

              <h2>Novo grupo</h2>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col px-6 py-9 items-center gap-14">
            <GroupIconIcon size={200} iconSize={150} />
            <input
              type="text"
              name="groupName"
              placeholder="Nome do grupo"
              className="py-1 w-full bg-transparent outline-none border-b-2 border-b-gray-500 focus:border-b-[#00A884]"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.currentTarget.value);
              }}
            />

            <Button
              className={`duration-100 ${groupName ? "scale-1" : "-scale-0"}`}
              type="submit"
              disabled={submiting || !groupName}
            >
              <CheckIcon sx={{ fontSize: 25 }} />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
});

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
}> = (props) => (
  <div className={`grid place-items-center py-10 ${props.className}`}>
    <button
      className="bg-[#00A884] text-white aspect-square w-11 rounded-full"
      onClick={props.onClick}
      type={props.type || "button"}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  </div>
);

//
