import { User } from "@/types/user";
import { useState } from "react";
import { useDebounce } from "react-use";
import useChats from "./useChats";

export default function useFetchUsers(
  emailValue: string,
  currentUserEmail: string
): { isLoading: boolean; users: User[]; resetFn: () => void } {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { service } = useChats();

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
    const retrievedUsers = await service.getUsersByEmail(
      emailValue,
      currentUserEmail
    );
    setUsers(retrievedUsers);
    setIsLoading(false);
  };

  return { isLoading, users, resetFn };
}
