import { User } from "@/types/user";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";

interface Props {
  user: User;
  last: boolean;
  selected: boolean;
  addUserToSelecteds: (email: User) => void;
  removeUserToSelecteds: (email: User) => void;
}

export default function UserTile({
  user,
  last,
  selected,
  addUserToSelecteds,
  removeUserToSelecteds,
}: Props) {
  const handleClick = () => {
    if (selected) {
      removeUserToSelecteds(user);
      return;
    }
    addUserToSelecteds(user);
  };

  return (
    <div
      className={`relative flex flex-row items-center hover:bg-[#202C33] ${
        selected && "bg-[#2A3942] "
      } hover:cursor-pointer`}
      onClick={handleClick}
    >
      {selected && (
        <CheckCircleIcon
          sx={{ color: "#00A884", fontSize: "30px" }}
          className="absolute right-2"
        />
      )}
      <div className="p-2">
        {user.photoURL ? (
          <Image
            className="rounded-full"
            alt="account-image"
            src={user.photoURL}
            width={55}
            height={55}
          />
        ) : (
          <AccountCircleIcon sx={{ color: "white", fontSize: "55px" }} />
        )}
      </div>

      <div
        className={`ml-2 w-full p-2 pb-3 ${
          !last ? "border-b-[1px] border-b-[#202C33]" : ""
        }`}
      >
        <h2 className="text-white">{user.displayName}</h2>
        <p className={`text-gray-300 text-sm`}>{user.email}</p>
      </div>
    </div>
  );
}
