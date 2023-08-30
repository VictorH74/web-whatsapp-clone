import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";
import { ReactNode } from "react";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import GroupsIcon from "@mui/icons-material/Groups";

interface Props {
  type?: 0 | 1 | 2;
  actions?: ReactNode[];
  heading?: string;
  subHeading?: string;
  imgSrc?: string;
  menuItems?: MenuItemProps[];
}

type MenuItemProps = {
  title: string;
  onClick(): void;
};

const Header = ({
  actions,
  heading,
  imgSrc,
  menuItems,
  type = 0,
  subHeading,
}: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="w-full max-h-16 bg-[#222E35] flex flex-row items-center py-3 px-4 justify-between text-white">
      <div className="flex items-center gap-2 ">
        {type === 2 ? (
          <div className="m-[3px] grid place-items-center bg-white w-[39px] h-[39px] rounded-full">
            <GroupsIcon sx={{ color: "black", fontSize: 20 }} />
          </div>
        ) : imgSrc ? (
          <Image
            className="rounded-full"
            alt="account-image"
            src={imgSrc}
            width={40}
            height={40}
          />
        ) : (
          <AccountCircleIcon sx={{ color: "white", fontSize: "45px" }} />
        )}

        <div className="flex flex-col w-auto">
          <p className="text-sm">{heading ?? heading}</p>
          <p className="text-xs truncate">{subHeading ?? subHeading}</p>
        </div>
      </div>
      <div className="flex flex-row gap-7 justify-evenly">
        {actions}
        {menuItems && menuItems.length > 0 && (
          <>
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
              {menuItems.map((item, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    item.onClick();
                    handleClose();
                  }}
                >
                  {item.title}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
