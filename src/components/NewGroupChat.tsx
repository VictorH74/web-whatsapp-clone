import { FC, FormEvent, ReactNode, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import UserListItem from "./UserListItem";
import { getAuth } from "firebase/auth";
import Loading from "./Loading";
import { User } from "@/types/user";
import { Chat, Message } from "@/types/chat";
import NewChatContainer from "./NewChatContainer";
import useFetchUsers from "@/hooks/useFetchUsers";
import { createUserRef } from "@/utils/functions";
import SearchUserInput from "./SearchUserInput";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { GroupIconIcon } from "./IconPresets";
import CheckIcon from "@mui/icons-material/Check";
import useChats from "@/hooks/useChats";
import useSidebarState from "@/hooks/useSidebarState";

export default function NewGroupChat() {
  const [emailValue, setEmailValue] = useState("");
  const [groupName, setGroupName] = useState("");
  const [next, setNext] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { currentUser } = getAuth();
  const { service } = useChats();
  const { newGroupChatArea, setNewGroupChatArea, setNewPrivateChatArea } =
    useSidebarState();
  const { isLoading, users, resetFn } = useFetchUsers(
    emailValue,
    currentUser?.email || ""
  );

  const handleItemClick = (userObj: User, selected?: boolean) => {
    if (selected) {
      return setSelectedUsers((prev) =>
        prev.filter((u) => u.email !== userObj.email)
      );
    }
    setSelectedUsers((prev) => [...prev, userObj]);
  };

  const handleSubmit = async (e: FormEvent) => {
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

    let userRefs: DocumentReference[] = [
      createUserRef(currentUser.email),
      ...selectedUsers.map((u) => createUserRef(u.email)),
    ];

    const owner = currentUser?.email;

    const newChat: Omit<Chat, "id"> = {
      members: userRefs,
      admList: [createUserRef(owner)],
      type: 2,
      createdBy: owner,
      name: groupName,
      createdAt: Timestamp.fromDate(new Date()),
    };

    const createdChatRef = await service.createChat(newChat);

    const newMessage: Message = {
      content: `Nova conversa criada por ${currentUser?.displayName}`,
      sender: "system",
      readBy: [],
      sentAt: Timestamp.fromDate(new Date()),
    };

    if (!createdChatRef.id) {
      console.error();
      return;
    }

    // MESSAGE
    await setDoc(doc(db, "message", createdChatRef.id), {});
    await addDoc(
      collection(db, `/message/${createdChatRef.id}/messages`),
      newMessage
    );

    close();
  };

  const close = () => {
    setSubmiting(false);
    setNewGroupChatArea(false);
    setNewPrivateChatArea(false);
    setEmailValue("");
    setGroupName("");
    setSelectedUsers([]);
    resetFn();
  };

  return (
    <>
      <NewChatContainer
        show={newGroupChatArea}
        title="Adicionar Participantes ao Grupo"
        backwardFn={close}
        className="z-[60]"
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
              placeholder="Nome do grupo"
              className="py-1 w-full bg-transparent outline-none border-b-2 border-b-gray-500 focus:border-b-[#00A884]"
              onChange={(e) => setGroupName(e.currentTarget.value)}
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
}

const Button: FC<{
  children: ReactNode;
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
