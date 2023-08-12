import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ReactNode } from "react";

interface Props {
  actions: ReactNode[];
}

const Header = ({ actions }: Props) => {
  return (
    <div className="w-full h-14 bg-[#222E35] flex flex-row items-center py-1 px-3 justify-between">
      <div>
        <AccountCircleIcon sx={{ color: "white", fontSize: "45px" }} />
      </div>
      <div className="flex flex-row gap-7 justify-evenly">
        {actions}
        <button>
          <MoreVertIcon sx={{ color: "white" }} />
        </button>
      </div>
    </div>
  );
};

export default Header;
