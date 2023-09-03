/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

interface Props {
  owner: boolean;
  mouseOver: boolean;
  mouseLeave: boolean;
  handleReply: () => void;
  handleReplyOnPrivate?: () => void;
  onClose: () => void;
}

export default function MessageMenuBtn(props: Props) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) anchorRef.current!.focus();

    prevOpen.current = open;
  }, [open]);

  React.useEffect(() => {
    if (props.mouseOver === true && open === false) {
      props.onClose();
      setOpen(false);
    }
  }, [props.mouseLeave]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
    props.onClose();
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        ref={anchorRef}
        onClick={handleToggle}
        className={`absolute duration-150 z-10 ${
          props.mouseOver ? "opacity-1 scale-1" : "opacity-0 -scale-0"
        } right-0 top-0 p-1 rounded-bl-xl ${
          props.owner ? "bg-[#005C4B]" : "bg-[#202C33]"
        }`}
      >
        <ExpandMoreIcon />
      </button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="top-start"
        transition
        disablePortal
        className="z-[60]"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              zIndex: 60,
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper sx={{ backgroundColor: "#233138", color: "#cacaca" }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem
                    onClick={(e) => {
                      props.handleReply();
                      handleClose(e);
                    }}
                  >
                    Responder
                  </MenuItem>
                  {!props.owner && props.handleReplyOnPrivate && (
                    <MenuItem
                      onClick={(e) => {
                        if (!props.handleReplyOnPrivate) return;
                        props.handleReplyOnPrivate();
                        handleClose(e);
                      }}
                    >
                      Responder em particular
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
