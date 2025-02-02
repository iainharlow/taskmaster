// app/src/App.jsx

import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  // State to store the list of tasks
  const [tasks, setTasks] = useState([]);
  // State for the new task input
  const [newTask, setNewTask] = useState("");

  // Subscribe to Firestore's "tasks" collection on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      // Map Firestore documents into an array of task objects
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    });

    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, []);

  // Function to add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      // Add a new document to the "tasks" collection in Firestore
      await addDoc(collection(db, "tasks"), {
        title: newTask,
        type: "personal", // Default task type; later you can allow user to choose
        completed: false,
        createdAt: serverTimestamp()
      });
      // Clear the input field
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Taskmaster</h1>
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
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.type} — {task.completed ? "Done" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
