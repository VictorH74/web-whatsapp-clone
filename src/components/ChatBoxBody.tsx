import { ChatType, Message } from "@/types/chat";
import MessageContainer from "./MessageContainer";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import useAppStates from "@/hooks/useAppStates";

interface Props {
  messages: Message[];
  type: ChatType;
}

type ColorIndexesType = Record<string, number>;

const colors: string[] = [
  "#43da7d",
  "#e0554b",
  "#9c71e2",
  "#e04bd8",
  "#b66a3e",
  "#43cf5b",
  "#db4242",
  "#329497",
  "#477cdf",
  "#dee03e",
];

export default forwardRef(function ChatBoxBody(
  { messages, type }: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const [colorIndexes, setColorsIndexes] = useState<ColorIndexesType>({});
  const { currentChat } = useAppStates();

  useLayoutEffect(() => {
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
    <div className="flex flex-col grow justify-end text-white overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div
        className="flex flex-col gap-3 p-4 overflow-y-auto  overflow-x-hidden"
        ref={ref}
      >
        {messages.map((m) => (
          <MessageContainer
            key={m.sentAt.toString()}
            message={m}
            type={type}
            senderNameColor={colors[colorIndexes[m.sender] || 0]}
          />
        ))}
      </div>
    </div>
  );
});
