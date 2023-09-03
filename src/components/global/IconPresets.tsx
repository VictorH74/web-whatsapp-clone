import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import React from "react";

const className = " rounded-full aspect-square grid place-items-center";
const fontSize = 30;
const SIZE = 55;
const color = "#CFD4D6";
const bg = "bg-gray-500";

interface Props {
  bgColor?: string;
  size?: number;
  iconSize?: number;
}

export const EmptyUserImgIcon: React.FC<Props> = ({
  size = SIZE,
  ...props
}) => (
  <div
    className={`${
      props.bgColor ? "bg-[" + props.bgColor + "]" : bg
    } ${className}`}
    style={{ width: size }}
  >
    <PersonIcon sx={{ color, fontSize: props.iconSize || fontSize }} />
  </div>
);

export const GroupIconIcon: React.FC<Props> = ({ size = SIZE, ...props }) => (
  <div
    className={`${
      props.bgColor ? "bg-[" + props.bgColor + "]" : bg
    } ${className}`}
    style={{ width: size }}
  >
    <GroupIcon sx={{ color, fontSize: props.iconSize || fontSize }} />
  </div>
);

export const ComunityIcon: React.FC<Props> = ({ size = SIZE, ...props }) => (
  <div
    className={`${
      props.bgColor ? "bg-[" + props.bgColor + "]" : bg
    } ${className}`}
    style={{ width: size }}
  >
    <GroupsIcon sx={{ color, fontSize: props.iconSize || fontSize }} />
  </div>
);
