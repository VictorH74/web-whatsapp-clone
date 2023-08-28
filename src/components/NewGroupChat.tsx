import { FormEvent, useState } from "react";
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

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
}

export default function NewGroupChat({ show, setShow }: Props) {
  const [emailValue, setEmailValue] = useState("");
  const [next, setNext] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { currentUser } = getAuth();
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
    // setIsLoading(true);

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

    const newChat: Omit<Chat, "createdAt" | "id"> = {
      members: userRefs,
      admList: [createUserRef(owner)],
      type: 2,
      createdBy: owner,
      name: "Group Name",
    };

    const createdChatRef = await addDoc(collection(db, "chat"), newChat);

    const newMessage: Message = {
      content: `Nova conversa criada por ${currentUser?.displayName}`,
      sender: "system",
      readBy: [],
      sentAt: Timestamp.fromDate(new Date()),
    };
    await setDoc(doc(db, "message", createdChatRef.id), {});
    await addDoc(
      collection(db, `/message/${createdChatRef.id}/messages`),
      newMessage
    );

    close();
  };

  const close = () => {
    setShow(false);
    setEmailValue("");
    setSelectedUsers([]);
    resetFn();
  };

  return (
    <>
      <NewChatContainer
        show={next}
        title="Nome do Grupo"
        backwardFn={() => setNext(false)}
      >
        <div>sdfsdfdfsdf</div>
      </NewChatContainer>

      <NewChatContainer
        show={show}
        title="Adicionar Participantes ao Grupo"
        backwardFn={close}
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
            {users.map((u, i) => (
              <UserListItem
                key={u.email}
                isLastItem={i === users.length - 1}
                user={u}
                selected={selectedUsers.map((u) => u.email).includes(u.email)}
                onClick={handleItemClick}
              />
            ))}
          </ul>
        </div>
        {selectedUsers.length > 0 && (
          <div className="grid place-items-center py-10">
            <button
              className="bg-[#00A884] text-white aspect-square w-11 rounded-full"
              onClick={() => {
                setNext(true);
              }}
            >
              <ArrowForwardIcon />
            </button>
          </div>
        )}
      </NewChatContainer>
    </>
  );
}
