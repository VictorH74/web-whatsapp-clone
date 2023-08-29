import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import React from "react";

const className = " rounded-full aspect-square grid place-items-center";
const fontSize = 30;
const color = "#CFD4D6";
const bg = "bg-gray-500";

export const EmptyUserImgIcon: React.FC<{
  bgColor?: string;
  size?: number;
  iconSize?: number;
}> = ({ bgColor, size = 55, iconSize }) => (
  <div
    className={`${bgColor ? "bg-[" + bgColor + "]" : bg} ${className}`}
    style={{ width: size }}
  >
    <PersonIcon sx={{ color, fontSize: iconSize || fontSize }} />
  </div>
);

export const GroupIconIcon: React.FC<{
  bgColor?: string;
  size?: number;
  iconSize?: number;
}> = ({ bgColor, size = 55, iconSize }) => (
  <div
    className={`${bgColor ? "bg-[" + bgColor + "]" : bg} ${className}`}
    style={{ width: size }}
  >
    <GroupIcon sx={{ color, fontSize: iconSize || fontSize }} />
  </div>
);

export const ComunityIcon: React.FC<{
  bgColor?: string;
  size?: number;
  iconSize?: number;
}> = ({ bgColor, size = 55, iconSize }) => (
  <div
    className={`${bgColor ? "bg-[" + bgColor + "]" : bg} ${className}`}
    style={{ width: size }}
  >
    <GroupsIcon sx={{ color, fontSize: iconSize || fontSize }} />
  </div>
);
