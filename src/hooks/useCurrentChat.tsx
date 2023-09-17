/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import useMessages from "./useMessages";
import useAppStates from "./useAppState";
import { getAuth } from "firebase/auth";
import * as fs from "firebase/firestore";
import { db } from "@/services/firebase";
import { Message } from "@/types/message";
import service from "@/services/api";
import { formatNumber, generateChatId } from "@/utils/functions";
import { ChatType } from "@/types/chat";
import { User } from "@/types/user";
import { updateUsersObj } from "@/reduxStateSlices/usersSlice";
import useAppDispatch from "./useDispatch";

export default function useCurrentChat(onMessagesChange: () => void) {
  const [imageUrl, setImageUrl] = React.useState<string | undefined>();
  const [title, setTitle] = React.useState<string | undefined>();
  const [subHeading, setSubHeading] = React.useState<
    string | undefined
  >();
  const [isLoading, setIsLoading] = React.useState(true);
  const [prevChatId, setPrevChatId] = React.useState<string | undefined>();

  const { messages, updateMessages } = useMessages(onMessagesChange);
  const { currentChat, updateCurrentChat, getUser } = useAppStates();

  const { currentUser } = getAuth();
  const dispatch = useAppDispatch();

//   const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (currentChat === null || !currentUser) return;

    // Reset chatbox header
    setImageUrl(undefined);
    setTitle(undefined);
    setSubHeading(undefined);

    let unSubscribeUser: fs.Unsubscribe | undefined;

    const chatId = currentChat.id;

    setPrevChatId(chatId);

    if (!chatId || (chatId && prevChatId && chatId !== prevChatId)) {
      setIsLoading(true);
    }

    if (!chatId) {
      fetchChat(currentChat.members, () => {
        updateMessages([]);
        unSubscribeUser = fetchUser(currentChat.members, currentChat.type);
        return;
      });
    }

    const q = fs.query(
      fs.collection(db, `/message/${chatId}/messages`),
      fs.orderBy("sentAt", "asc")
    );

    const unsubscribeMessages = fs.onSnapshot(q, (querySnapshot) => {
      const msgList: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgList.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });
      updateMessages(msgList);
      if (currentChat.type === 1) {
        unSubscribeUser = fetchUser(currentChat.members, currentChat.type);
        return;
      }
      setIsLoading(false);
      setTitle(currentChat.name || "Grupo sem nome");
      setSubHeading(currentChat.members.join(", "));
    });

    return () => {
      if (unSubscribeUser) unSubscribeUser();
      unsubscribeMessages();
    };
  }, [currentChat]);

  const fetchChat = async (members: string[], onChatNotExist: () => void) => {
    const retrievedChat = await service.retrieveChat(generateChatId(members));
    if (retrievedChat) updateCurrentChat(retrievedChat);
    else onChatNotExist();
  };

  const fetchUser = React.cache((members: string[], type: ChatType) => {
    if (type !== 1) {
      setIsLoading(false);
      return;
    }

    const { currentUser } = getAuth();

    if (!currentUser?.email) return;
    const userId = members.filter((id) => id !== currentUser.email)[0];
    let hasUserId = false;
    getUser(
      userId,
      (user) => {
        if (user) {
          hasUserId = true;
          setImageUrl(() => user.photoURL);
          setTitle(() => user.displayName);
          setIsLoading(false);
        }
      },
      false
    );

    // ** Real time user data (firebase) **
    return fs.onSnapshot(fs.doc(db, "user", userId), (doc) => {
      if (doc.exists()) {
        const user: User = doc.data() as User;
        const diferentUserName = title !== user.displayName;
        const diferentUserImg = imageUrl !== user.photoURL;

        if (diferentUserName) setTitle(user.displayName);
        if (diferentUserImg) setImageUrl(user.photoURL);
        if (!hasUserId) {
          dispatch(updateUsersObj({ id: userId, data: user }));
          setIsLoading(false);
        }

        let subHeading;

        if (user.online) subHeading = "online";
        else {
          // ** format online last time inrfomation **
          const unknowDate = user.lastTimeOnline as unknown;
          const date = new Date((unknowDate as fs.Timestamp).seconds * 1000);

          const [day, month, year] = [
            date.getDay(),
            date.getMonth(),
            date.getFullYear(),
          ];

          const currenDate = new Date();
          const [cDay, cMonth, cYear] = [
            currenDate.getDay(),
            currenDate.getMonth(),
            currenDate.getFullYear(),
          ];

          const sameDay = day === cDay;
          const sameMounth = month === cMonth;
          const sameYear = year === cYear;
          const yesteday = day === cDay - 1 && sameMounth && sameYear;

          const hour = formatNumber(date.getHours());
          const minutes = formatNumber(date.getMinutes());
          const dayF = formatNumber(day);
          const monthF = formatNumber(month);
          const yearF = formatNumber(year);

          subHeading = yesteday
            ? `visto por ultimo ontem às ${hour}:${minutes}`
            : sameDay && sameMounth && sameYear
            ? `visto por ultimo hoje às ${hour}:${minutes}`
            : `visto por ultimo em ${dayF}/${monthF}/${yearF}`;
        }
        setSubHeading(subHeading);
      }
    });
  });

  return {imageUrl, title, subHeading, isLoading, messages}
}
