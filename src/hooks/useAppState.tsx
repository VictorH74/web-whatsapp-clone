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

const useAppStates = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChats);
  const currentChat = useAppSelector(selectCurrentChat);
  const users = useAppSelector(selectUsers);

  const updateChats = (chats: Chat[]) => dispatch(updtChats(chats));
  const updateCurrentChat = (chat: Chat | null) =>
    dispatch(updtCurrentChat(chat));

  return { chats, currentChat, users, updateChats, updateCurrentChat };
};

export default useAppStates;
