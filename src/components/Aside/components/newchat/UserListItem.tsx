import { User } from "@/types/user";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import React from "react";
import { EmptyUserImgIcon } from "@/components/global/IconPresets";

interface Props {
  user: User;
  isLastItem: boolean;
  selected?: boolean;
  onClick: (userObj: User, selected?: boolean) => void;
}

export default function UserListItem(props: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [left, setLeft] = React.useState(0);

  React.useEffect(() => {
    let left = ref.current?.offsetLeft;
    if (!left) return;
    setLeft(() => left as number);
  }, [ref]);

  const handleClick = () => {
    props.onClick(props.user, props.selected);
  };

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
      onClick={handleClick}
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
        {!props.isLastItem && (
          <div
            className="absolute bg-[#202C33] h-[1px] bottom-0"
            style={{ right: 0, left: `${left}px` }}
          ></div>
        )}
      </div>
    </li>
  );
}
