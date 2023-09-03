/* eslint-disable react-hooks/exhaustive-deps */
import { ChatType, Message } from "@/types/chat";
import MessageContainer from "./MessageContainer";
import React from "react";
import useAppStates from "@/hooks/useAppStates";
import { colors } from "@/utils/constants";

interface Props {
  messages: Message[];
  type: ChatType;
  scrollToMsg: (msgId: string) => void;
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
        className="flex flex-col relative h-auto scroll-smooth pt-40 overflow-x-hidden"
        ref={ref}
      >
        {props.messages.map((m) => (
          <MessageContainer
            key={m.sentAt.toString()}
            message={m}
            type={props.type}
            scrollToMsg={props.scrollToMsg}
            senderNameColor={colors[colorIndexes[m.sender] || 0]}
          />
        ))}
      </div>
    </div>
  );
});
