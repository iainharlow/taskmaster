import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onToggle, onEdit, onDelete }) => {
  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TaskList;