import React from "react";
import { Dialog, DialogContent, IconButton, TextField, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const CommandPanel = ({ open, onClose, messages, onSend }) => {
  const [inputText, setInputText] = React.useState("");

  const handleSend = () => {
    if (inputText.trim() !== "") {
      onSend(inputText);
      setInputText("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: { 
          position: "fixed", 
          bottom: 0, 
          margin: 0, 
          borderTopLeftRadius: 16, 
          borderTopRightRadius: 16,
          padding: "1rem"
        },
      }}
    >
      <DialogContent style={{ paddingBottom: "4rem" }}>
        <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "1rem" }}>
          {messages.length === 0 ? (
            <p style={{ color: "#777" }}>No conversation history yet.</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: "0.5rem" }}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))
          )}
        </div>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Enter your command..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </DialogContent>
      <div
        style={{
          position: "absolute",
          bottom: "0.5rem",
          right: "0.5rem",
        }}
      >
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
    </Dialog>
  );
};

export default CommandPanel;