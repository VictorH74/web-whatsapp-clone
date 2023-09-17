import {
  selectChats,
  selectCurrentChat,
  updateCurrentChat as updtCurrentChat,
  updateChats as updtChats,
} from "@/reduxStateSlices/chatsSlice";
import useAppSelector from "./useAppSelector";
import { selectUsers } from "@/reduxStateSlices/usersSlice";
import useAppDispatch from "./useDispatch";
import { Chat } from "@/types/chat";
import { User } from "@/types/user";
import service from "@/services/api";

type callbackFnUser =
  | (Omit<User, "lastTimeOnline"> & Record<"lastTimeOnline", string>)
  | User
  | undefined;

const useAppStates = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChats);
  const currentChat = useAppSelector(selectCurrentChat);
  const users = useAppSelector(selectUsers);

  const updateChats = (chats: Chat[]) => dispatch(updtChats(chats));
  const updateCurrentChat = (chat: Chat | null) =>
    dispatch(updtCurrentChat(chat));

  const getUser = async (
    senderId: string,
    callbackFn: (user: callbackFnUser) => void,
    retrieveUser = true
  ) => {
    let user: callbackFnUser;
    let hasUserId = false;

    if (senderId in users) {
      user = users[senderId];
      hasUserId = true;
    }
    if (retrieveUser && !hasUserId) user = await service.retrieveUser(senderId);

    callbackFn(user);
  };

  return { currentChat, chats, updateChats, updateCurrentChat, getUser };
};

export default useAppStates;
