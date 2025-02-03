import React, { useState } from "react";
import { IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskItem from "./TaskItem";

const TaskListWithInlineAdd = ({ tasks, onAddTask, onToggle, onDetails }) => {
  const [inlineTask, setInlineTask] = useState("");

  const handleAdd = () => {
    if (inlineTask.trim() !== "") {
      onAddTask(inlineTask);
      setInlineTask("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      {/* Inline Add New Task Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Add new task..."
          value={inlineTask}
          onChange={(e) => setInlineTask(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          size="small"
          InputProps={{ style: { paddingRight: 0 } }}
        />
        <IconButton color="primary" onClick={handleAdd}>
          <AddIcon />
        </IconButton>
      </div>
      {/* Task List */}
      <div>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDetails={onDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskListWithInlineAdd;