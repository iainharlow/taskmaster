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

  const handleConversationalInput = async (inputText) => {
    setConversation((prev) => [
      ...prev,
      { sender: "User", text: inputText },
      { sender: "LLM", text: `Simulated response: tasks parsed from "${inputText}"` },
    ]);
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