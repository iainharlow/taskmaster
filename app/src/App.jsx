// app/src/App.jsx

import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  // State to store the list of tasks
  const [tasks, setTasks] = useState([]);
  // State for the new task input
  const [newTask, setNewTask] = useState("");
  // State to track which task is being edited (by its id)
  const [editingTaskId, setEditingTaskId] = useState(null);
  // State to hold the edited title
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  // Subscribe to the "tasks" collection on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Firestore snapshot received:", tasksData); // Debug line
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  // Handler to add a new task to Firestore
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    console.log("Attempting to add task:", newTask);  // Debug log
    try {
      await addDoc(collection(db, "tasks"), {
        title: newTask,
        type: "personal",
        completed: false,
        createdAt: serverTimestamp()
      });
      console.log("Task added successfully!");
      setNewTask(""); // Clear input after adding
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Handler to toggle task completion
  const handleToggleComplete = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        completed: !task.completed
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Handler to start editing a task
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  // Handler to save an updated task title
  const handleUpdateTask = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        title: editingTaskTitle
      });
      // Reset editing state
      setEditingTaskId(null);
      setEditingTaskTitle("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Handler to delete a task
  const handleDeleteTask = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Taskmaster</h1>
      {/* Form to add a new task */}
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Enter new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ padding: "0.5rem", width: "250px" }}
        />
        <button type="submit" style={{ marginLeft: "0.5rem", padding: "0.5rem" }}>
          Add Task
        </button>
      </form>
      <hr style={{ margin: "1rem 0" }} />
      <h2>Your Tasks</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: "1rem" }}>
            {/* Checkbox to mark complete/incomplete */}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
            />
            {editingTaskId === task.id ? (
              // If this task is being edited, show an input field
              <>
                <input
                  type="text"
                  value={editingTaskTitle}
                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                  style={{ marginLeft: "0.5rem" }}
                />
                <button onClick={() => handleUpdateTask(task)} style={{ marginLeft: "0.5rem" }}>
                  Save
                </button>
                <button onClick={() => setEditingTaskId(null)} style={{ marginLeft: "0.5rem" }}>
                  Cancel
                </button>
              </>
            ) : (
              // Otherwise, display the task title along with edit and delete buttons
              <>
                <span
                  style={{
                    marginLeft: "0.5rem",
                    textDecoration: task.completed ? "line-through" : "none"
                  }}
                >
                  {task.title}
                </span>
                <button onClick={() => handleEditTask(task)} style={{ marginLeft: "0.5rem" }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteTask(task)} style={{ marginLeft: "0.5rem" }}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;