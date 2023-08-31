import { ReactNode } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useAsideState from "@/hooks/useAsideState";
import { ContentNumberType } from "@/contexts/asideCtx";

interface Props {
  contentNumber: ContentNumberType;
  children: ReactNode;
  title: string;
  backwardFn?: () => void;
  className?: string;
}

export default function NewChatContainer(props: Props) {
  const { asideContentNumber } = useAsideState();

  const show = props.contentNumber === asideContentNumber;

  return (
    <div
      className={`bg-[#111B21] flex flex-col absolute inset-0 z-50 ${
        show ? "" : "-translate-x-full"
      } duration-200 ${props.className}`}
    >
      <div className="bg-[#202C33] px-6 pb-4 pt-16">
        {show ? (
          <div className="text-white flex gap-7 fade-out">
            <button onClick={props.backwardFn}>
              <ArrowBackIcon sx={{ fontSize: 25 }} />
            </button>

            <h2>{props.title}</h2>
          </div>
        ) : (
          ""
        )}
      </div>
      {props.children}
    </div>
  );
}
