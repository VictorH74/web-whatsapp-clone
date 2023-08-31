import { User } from "@/types/user";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import React from "react";
import { EmptyUserImgIcon } from "./IconPresets";

interface Props {
  user: User;
  isLastItem: boolean;
  selected?: boolean;
  onClick: (userObj: User, selected?: boolean) => void;
}

export default function UserListItem({
  user,
  isLastItem,
  selected,
  onClick,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [left, setLeft] = React.useState(0);

  React.useEffect(() => {
    let left = ref.current?.offsetLeft;
    if (!left) return;
    setLeft(() => left as number);
  }, [ref]);

  const handleClick = () => {
    onClick(user, selected);
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
      ${selected && "bg-[#2A3942] "} 
      hover:cursor-pointer  
      `}
      onClick={handleClick}
    >
      {selected && (
        <CheckCircleIcon
          sx={{ color: "#00A884", fontSize: "30px" }}
          className="absolute right-2"
        />
      )}
      {user.photoURL ? (
        <Image
          className="rounded-full"
          alt="account-image"
          src={user.photoURL}
          width={50}
          height={50}
        />
      ) : (
        <EmptyUserImgIcon />
      )}

      <div className={`ml-2 w-full p-2`}>
        <h2 ref={ref} className="text-white">
          {user.displayName}
        </h2>
        <p className={`text-gray-300 text-sm`}>{user.email}</p>
        {!isLastItem && (
          <div
            className="absolute bg-[#202C33] h-[1px] bottom-0"
            style={{ right: 0, left: `${left}px` }}
          ></div>
        )}
      </div>
    </li>
  );
}
