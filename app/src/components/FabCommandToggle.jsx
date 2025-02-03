import React from "react";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

const FabCommandToggle = ({ onClick }) => {
  return (
    <Fab
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
      }}
      color="primary"
    >
      <ChatIcon />
    </Fab>
  );
};

export default FabCommandToggle;