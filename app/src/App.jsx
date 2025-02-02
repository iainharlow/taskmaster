import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import TaskList from "./components/TaskList";
import ConversationPane from "./components/ConversationPane";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "./App.css";

function App() {
  // Task-related state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  // LLM input state
  const [llmInputText, setLlmInputText] = useState("");

  // Conversation history state
  const [conversation, setConversation] = useState([]);

  // Subscribe to tasks collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
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
      setConversation((prev) => [
        ...prev,
        { sender: "System", text: `Added task: ${newTask}` }
      ]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { completed: !task.completed });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Start editing a task
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  // Save updated task title
  const handleUpdateTask = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { title: editingTaskTitle });
      setEditingTaskId(null);
      setEditingTaskTitle("");
      setConversation((prev) => [
        ...prev,
        { sender: "System", text: `Updated task: ${task.title}` }
      ]);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await deleteDoc(taskRef);
      setConversation((prev) => [
        ...prev,
        { sender: "System", text: `Deleted task: ${task.title}` }
      ]);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handler to call the LLM parsing Cloud Function
  const handleParseTasks = async () => {
    if (!llmInputText.trim()) return;
    try {
      // Replace with your deployed Cloud Function URL
      const functionUrl =
        "https://us-central1-your-project-id.cloudfunctions.net/parseTasks";
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText: llmInputText })
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setConversation((prev) => [
        ...prev,
        {
          sender: "LLM",
          text: `Parsed tasks: ${data.tasks
            .map((t) => t.title)
            .join(", ")}`
        }
      ]);
      // Add parsed tasks to Firestore
      for (const task of data.tasks) {
        await addDoc(collection(db, "tasks"), task);
      }
      setLlmInputText("");
    } catch (error) {
      console.error("Error parsing tasks:", error);
    }
  };

  return (
    <div className="container">
      <h1>Taskmaster</h1>

      {/* Manual Task Entry Panel */}
      <div className="panel">
        <h2>Add a New Task</h2>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Enter new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="subtle-button" type="submit">Add Task</button>
        </form>
      </div>

      {/* Task List Panel */}
      <div className="panel">
        <h2>Your Tasks</h2>
        <TaskList
          tasks={tasks}
          onToggle={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      </div>

      {/* LLM Task Parsing Panel */}
      <div className="panel">
        <h2>LLM Task Parsing</h2>
        <textarea
          placeholder="Enter text with tasks, each on a new line..."
          value={llmInputText}
          onChange={(e) => setLlmInputText(e.target.value)}
        />
        <button onClick={handleParseTasks}>Parse Tasks</button>
      </div>

      {/* Conversation History Panel */}
      <div className="panel">
        <ConversationPane messages={conversation} />
      </div>
    </div>
  );
}

export default App;