import { User } from "@/types/user";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import React from "react";
import { EmptyUserImgIcon } from "./IconPresets";

interface Props {
  user: User;
  last: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function ListItemContainer(props: Props) {
  const [left, setLeft] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let left = ref.current?.offsetLeft;
    if (!left) return;
    setLeft(() => left as number);
  }, [ref]);

  return (
    <li
      className={`
      p-2 
      relative 
      flex 
      flex-row 
      items-center 
      hover:bg-[#202C33] 
      ${props.selected && "bg-[#2A3942] "} 
      hover:cursor-pointer  
      `}
      onClick={props.onClick}
    >
      {props.selected && (
        <CheckCircleIcon
          sx={{ color: "#00A884", fontSize: "30px" }}
          className="absolute right-2"
        />
      )}
      {props.user.photoURL ? (
        <Image
          className="rounded-full"
          alt="account-image"
          src={props.user.photoURL}
          width={50}
          height={50}
        />
      ) : (
        <EmptyUserImgIcon />
      )}

      <div className={`ml-2 w-full p-2`}>
        <h2 ref={ref} className="text-white">
          {props.user.displayName}
        </h2>
        <p className={`text-gray-300 text-sm`}>{props.user.email}</p>
        {!props.last && (
          <div
            className="absolute bg-[#202C33] h-[1px] bottom-0"
            style={{ right: 0, left: `${left}px` }}
          ></div>
        )}
      </div>
    </li>
  );
}
