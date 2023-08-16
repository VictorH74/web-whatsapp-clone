import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";
import { ReactNode } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface Props {
  actions?: ReactNode[];
  heading?: string;
  accountImgUrl?: string;
}

const Header = ({ actions, heading, accountImgUrl }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="w-full h-16 bg-[#222E35] flex flex-row items-center py-1 px-3 justify-between text-white">
      <div className="flex items-center gap-2">
        {accountImgUrl ? (
          <Image
            alt="account-image"
            src={accountImgUrl}
            width={45}
            height={45}
          />
        ) : (
          <AccountCircleIcon sx={{ color: "white", fontSize: "45px" }} />
        )}

        {heading ?? <h2 className="font-bold">{heading}</h2>}
      </div>
      <div className="flex flex-row gap-7 justify-evenly">
        {actions}
        <button
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon sx={{ color: "white" }} />
        </button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleClose}>Novo Chat</MenuItem>
          <MenuItem onClick={handleClose}>Sair</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
