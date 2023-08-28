import { db } from "@/services/firebase";
import { User } from "@/types/user";
import * as fs from "firebase/firestore";
import { FC, useState } from "react";
import { useDebounce } from "react-use";

export default function useFetchUsers(
  emailValue: string,
  currentUserEmail: string
): { isLoading: boolean; users: User[]; resetFn: () => void } {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const resetFn = () => {
    setIsLoading(false);
    setUsers([]);
  };

  useDebounce(
    () => {
      if (!emailValue) return;
      fetchUsers();
    },
    500,
    [emailValue]
  );

  const fetchUsers = async () => {
    setIsLoading(true);
    const q = fs.query(
      fs.collection(db, "user"),
      fs.where("email", ">=", emailValue),
      fs.where("email", "<=", emailValue + "\uf8ff"),
      fs.where("email", "!=", currentUserEmail)
    );

    const querySnapshot = await fs.getDocs(q);

    const retrievedUsers: User[] = [];
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      retrievedUsers.push(user as User);
    });
    setUsers(retrievedUsers);
    setIsLoading(false);
  };

  return { isLoading, users, resetFn };
}
