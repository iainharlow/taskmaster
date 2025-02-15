import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import Header from "./components/Header";
import TaskListWithInlineAdd from "./components/TaskListWithInlineAdd";
import TaskDetailModal from "./components/TaskDetailModal";
import CommandPanel from "./components/CommandPanel";
import FabCommandToggle from "./components/FabCommandToggle";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [conversation, setConversation] = useState([]);
  const [commandPanelOpen, setCommandPanelOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const activeTasks = tasksData.filter((task) => !task.completed);
      const completedTasks = tasksData.filter((task) => task.completed);
      setTasks([...activeTasks, ...completedTasks]);
    });
    return () => unsubscribe();
  }, [sortBy]);

  const handleInlineAddTask = async (taskTitle) => {
    try {
      await addDoc(collection(db, "tasks"), {
        title: taskTitle,
        type: "personal",
        completed: false,
        createdAt: serverTimestamp(),
      });
      setConversation((prev) => [
        ...prev,
        { sender: "System", text: `Added task: ${taskTitle}` },
      ]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { completed: !task.completed });
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleDetails = (task) => {
    setSelectedTask(task);
  };

  const handleSaveTask = async (task, newTitle) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { title: newTitle });
      setConversation((prev) => [
        ...prev,
        { sender: "System", text: `Updated task: ${newTitle}` },
      ]);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await deleteDoc(taskRef);
      setConversation((prev) => [
        ...prev,
        { sender: "System", text: `Deleted task: ${task.title}` },
      ]);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Updated conversational input handler to call the cloud function.
  const handleConversationalInput = async (inputText) => {
    // Add user's command to conversation history.
    setConversation((prev) => [...prev, { sender: "User", text: inputText }]);

    try {
      // Replace with your actual cloud function endpoint URL.
      const response = await fetch("https://us-central1-taskmaster-af94a.cloudfunctions.net/parseTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const newTasks = result.tasks || [];

      let llmResponseText = "";
      for (const task of newTasks) {
        await addDoc(collection(db, "tasks"), {
          title: task.title,
          type: task.type,
          completed: task.completed,
          createdAt: serverTimestamp(),
        });
        llmResponseText += `Added task: ${task.title}\n`;
      }

      // Update conversation with the cloud function's response.
      setConversation((prev) => [
        ...prev,
        { sender: "LLM", text: llmResponseText.trim() || "No tasks parsed from input." },
      ]);
    } catch (error) {
      console.error("Error processing conversational input:", error);
      setConversation((prev) => [
        ...prev,
        { sender: "LLM", text: "Error processing command." },
      ]);
    }
  };

  return (
    <div>
      <Header sortBy={sortBy} setSortBy={setSortBy} />
      <div className="container" style={{ paddingTop: "1rem", paddingBottom: "6rem" }}>
        <div className="panel">
          <TaskListWithInlineAdd
            tasks={tasks}
            onAddTask={handleInlineAddTask}
            onToggle={handleToggleComplete}
            onDetails={handleDetails}
          />
        </div>
      </div>
      <TaskDetailModal
        open={Boolean(selectedTask)}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
      />
      <FabCommandToggle onClick={() => setCommandPanelOpen(true)} />
      <CommandPanel
        open={commandPanelOpen}
        onClose={() => setCommandPanelOpen(false)}
        messages={conversation}
        onSend={handleConversationalInput}
      />
    </div>
  );
}

export default App;