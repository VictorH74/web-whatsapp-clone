import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import React from "react";

const className = " rounded-full aspect-square w-[55px] grid place-items-center";
const fontSize = 30;
const color = "#CFD4D6";
const bg = "bg-gray-500";


export const EmptyUserImgIcon: React.FC<{ bgColor?: string }> = ({
  bgColor,
}) => (
  <div className={`${bgColor ? "bg-[" + bgColor + "]" : bg} ${className} `}>
    <PersonIcon sx={{ color, fontSize }} />
  </div>
);

export const GroupIconIcon: React.FC<{ bgColor?: string }> = ({ bgColor }) => (
  <div className={`${bgColor ? "bg-[" + bgColor + "]" : bg} ${className}`}>
    <GroupIcon sx={{ color, fontSize }} />
  </div>
);

export const ComunityIcon: React.FC<{ bgColor?: string }> = ({ bgColor }) => (
  <div className={`${bgColor ? "bg-[" + bgColor + "]" : bg} ${className}`}>
    <GroupsIcon sx={{ color, fontSize }} />
  </div>
);
