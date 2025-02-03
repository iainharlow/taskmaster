import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, 
         TextField, Button } from "@mui/material";

const TaskDetailModal = ({ open, task, onClose, onSave, onDelete, onToggleComplete }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
    }
  }, [task]);

  const handleSave = () => {
    onSave(task, title);
  };

  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Task Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onToggleComplete(task)}>
          {task.completed ? "Mark Incomplete" : "Mark Complete"}
        </Button>
        <Button onClick={() => onDelete(task)} color="secondary">
          Delete
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailModal;