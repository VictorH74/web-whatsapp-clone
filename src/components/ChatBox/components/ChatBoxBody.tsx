/* eslint-disable react-hooks/exhaustive-deps */
import { ChatType } from "@/types/chat";
import MessageContainer from "./MessageContainer";
import React from "react";
import { colors } from "@/utils/constants";
import useAppStates from "@/hooks/useAppState";
import { Message } from "@/types/message";

interface Props {
  messages: Message[];
  type: ChatType;
  scrollToMsg: (msgId: string, groupId?: string) => void;
}

type RefType = React.ForwardedRef<HTMLDivElement>;
type ColorIndexesType = Record<string, number>;

export default React.forwardRef(function ChatBoxBody(
  props: Props,
  ref: RefType
) {
  const [colorIndexes, setColorsIndexes] = React.useState<ColorIndexesType>({});
  const { currentChat } = useAppStates();

  React.useLayoutEffect(() => {
    if (currentChat === null) return;
    if (!currentChat.id || currentChat.type !== 2) return;

    const discoveredColors = localStorage.getItem(currentChat.id);

    if (discoveredColors) {
      setColorsIndexes(JSON.parse(discoveredColors));
      return;
    }

    const groupColorIndexes = currentChat.members.reduce(
      (obj, m) => ({
        ...obj,
        [m]: Math.floor(Math.random() * colors.length),
      }),
      {}
    );

    localStorage.setItem(currentChat.id, JSON.stringify(groupColorIndexes));
    setColorsIndexes(groupColorIndexes);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto grow justify-end text-white overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div
        className="grid gap-1 px-10 pb-4 relative h-auto scroll-smooth pt-40 overflow-x-hidden"
        ref={ref}
      >
        {props.messages.map((m, i) => (
          <MessageContainer
            key={m.id}
            message={m}
            type={props.type}
            scrollToMsg={props.scrollToMsg}
            senderNameColor={colors[colorIndexes[m.sender] || 0]}
            sameSender={i > 0 ? props.messages[i-1].sender === m.sender : false}
          />
        ))}
      </div>
    </div>
  );
});