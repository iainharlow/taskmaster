import React from "react";

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  return (
    <li className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
      />
      <span
        className="task-title"
        style={{
          textDecoration: task.completed ? "line-through" : "none"
        }}
      >
        {task.title}
      </span>
      <button className="subtle-button" onClick={() => onEdit(task)}>
        Edit
      </button>
      <button className="subtle-button" onClick={() => onDelete(task)}>
        Delete
      </button>
    </li>
  );
};

export default TaskItem;