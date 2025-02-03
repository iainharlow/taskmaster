import React from "react";
import { Button, Checkbox } from "@mui/material";

const TaskItem = ({ task, onToggle, onDetails }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task)}
      />
      <span
        style={{
          flex: 1,
          marginLeft: "0.75rem",
          textDecoration: task.completed ? "line-through" : "none",
          color: task.completed ? "#a0a0a0" : "inherit",
        }}
      >
        {task.title}
      </span>
      <Button
        variant="contained"
        size="small"
        onClick={() => onDetails(task)}
        style={{
          fontSize: "0.75rem",
          padding: "0.25rem 0.5rem",
        }}
      >
        Details
      </Button>
    </div>
  );
};

export default TaskItem;