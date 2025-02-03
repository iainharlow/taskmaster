import React, { useState } from "react";
import { TextField, IconButton, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const LLMInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() !== "") {
      onSend(text);
      setText("");
    }
  };

  return (
    <Paper
      elevation={3}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "0.5rem",
        display: "flex",
        alignItems: "center"
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter your command..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        size="small"
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default LLMInput;