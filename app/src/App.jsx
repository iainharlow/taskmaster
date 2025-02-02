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
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  
  // State for the LLM text input
  const [llmInputText, setLlmInputText] = useState("");
  
  // Subscribe to tasks collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  // Handler to add a new task manually
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await addDoc(collection(db, "tasks"), {
        title: newTask,
        type: "personal",
        completed: false,
        createdAt: serverTimestamp()
      });
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle task completion
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

  // Begin editing a task
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  // Save an updated task title
  const handleUpdateTask = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        title: editingTaskTitle
      });
      setEditingTaskId(null);
      setEditingTaskTitle("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handler to call the LLM parsing Cloud Function
  const handleParseTasks = async () => {
    if (!llmInputText.trim()) return;
    try {
      // Replace this URL with the URL of your deployed parseTasks Cloud Function
      const functionUrl = "https://us-central1-taskmaster-af94a.cloudfunctions.net/parseTasks";
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText: llmInputText })
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Parsed tasks:", data.tasks);
      // Option 1: Simply log the parsed tasks.
      // Option 2: Iterate through data.tasks and add them to Firestore.
      for (const task of data.tasks) {
        await addDoc(collection(db, "tasks"), task);
      }
      // Clear the textarea after processing
      setLlmInputText("");
    } catch (error) {
      console.error("Error parsing tasks:", error);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Taskmaster</h1>
      {/* Manual Task Entry */}
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
      
      {/* Display Tasks */}
      <h2>Your Tasks</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: "1rem" }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
            />
            {editingTaskId === task.id ? (
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
      
      <hr style={{ margin: "1rem 0" }} />
      
      {/* LLM Task Parsing Section */}
      <h2>LLM Task Parsing</h2>
      <textarea
        placeholder="Enter a block of text with tasks, each on a new line..."
        value={llmInputText}
        onChange={(e) => setLlmInputText(e.target.value)}
        style={{ width: "100%", height: "100px", padding: "0.5rem" }}
      />
      <br />
      <button onClick={handleParseTasks} style={{ marginTop: "0.5rem", padding: "0.5rem" }}>
        Parse Tasks
      </button>
    </div>
  );
}

export default App;