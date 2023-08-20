import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDebounce } from "react-use";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import UserTile from "./UserTile";
import { getAuth } from "firebase/auth";
import Loading from "./Loading";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
}

export default function NewChat({ show, setShow }: Props) {
  const [emailValue, setEmailValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SimpleUser[]>([]);
  const { currentUser } = getAuth();

  const fetchUsers = async () => {
    setIsLoading(true);
    const q = query(
      collection(db, "users"),
      where("email", ">=", emailValue),
      where("email", "<=", emailValue + "\uf8ff"),
      where("email", "!=", currentUser?.email || "")
    );

    const querySnapshot = await getDocs(q);

    const retrievedUsers: User[] = [];
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      retrievedUsers.push(user as User);
    });
    setUsers(retrievedUsers);
    setIsLoading(false);
  };

  useDebounce(
    () => {
      if (!emailValue) return;
      fetchUsers();
    },
    400,
    [emailValue]
  );

  const addUserToSelecteds = (userObj: SimpleUser) => {
    setSelectedUsers((prev) => [...prev, userObj]);
  };

  const removeUserToSelecteds = (userObj: SimpleUser) => {
    setSelectedUsers((prev) => prev.filter((u) => u.email !== userObj.email));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let newChatUsers: SimpleUser[] = [
      {
        email: currentUser?.email || "",
        name: currentUser?.displayName || "",
        photoUrl: currentUser?.photoURL || "",
      },
      ...selectedUsers,
    ];

    let userColors: { [email: string]: number } = {};

    const isGroup = newChatUsers.length > 2;

    if (isGroup) {
      newChatUsers.forEach((u) => {
        userColors[u.email] = Math.floor(Math.random() * 10);
      });
    }

    const newChat: Omit<ChatBox, "createdAt" | "id"> = {
      users: newChatUsers,
      admList: [currentUser?.email || "anyone@email.com"],
      type: isGroup ? "group" : "duo",
      colors: userColors,
      messages: [
        {
          content: `Nova conversa criada por ${
            currentUser?.displayName || currentUser?.email || "-"
          }`,
          sender: "system",
          vizualizedBy: [],
          createdAt: Timestamp.fromDate(new Date()),
        },
      ],
    };
    await addDoc(collection(db, "chats"), newChat);
    close();
  };

  const close = () => {
    setShow(false);
    setEmailValue("");
    setUsers([]);
    setSelectedUsers([]);
    setIsLoading(false);
  };

  return (
    <div
      className={`bg-[#111B21] absolute inset-0 z-50 ${
        show ? "" : "-translate-x-full"
      } duration-200`}
    >
      <div className="bg-[#202C33] px-6 pb-4 pt-16">
        {show ? (
          <div className="text-white flex gap-7 fade-out">
            <button onClick={close}>
              <ArrowBackIcon sx={{ fontSize: 25 }} />
            </button>

            <h2>Nova Conversa</h2>
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        <form
          className="flex flex-col gap-3 p-3 text-white"
          onSubmit={handleSubmit}
        >
          <input
            autoComplete="none"
            name="email"
            type="text"
            className="bg-[#202C33] p-1 px-2 rounded-md autofill:none"
            value={emailValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmailValue(e.currentTarget.value)
            }
            placeholder="Email do usuário"
          />
          <button
            type="submit"
            className="bg-[#00A884] p-3 rounded-md duration-150 grid place-items-center"
            disabled={selectedUsers.length === 0}
          >
            {isLoading ? <Loading /> : "Criar Conversa"}
          </button>
        </form>
        <div>
          {users.map((u, i) => (
            <UserTile
              key={u.email}
              last={i === users.length - 1}
              user={u}
              selected={selectedUsers.map((u) => u.email).includes(u.email)}
              addUserToSelecteds={addUserToSelecteds}
              removeUserToSelecteds={removeUserToSelecteds}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
