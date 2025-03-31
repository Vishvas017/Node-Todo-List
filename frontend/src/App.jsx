import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await axios.post(API_URL, { text: newTask });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const updateTask = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <h1 style={{ color: "#4A90E2" }}>To-Do List</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          style={{ padding: "10px", width: "250px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button onClick={addTask} style={{ marginLeft: "10px", padding: "10px 15px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Add
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li key={task._id} style={{ backgroundColor: "#fff", margin: "10px auto", padding: "10px", width: "300px", borderRadius: "5px", boxShadow: "0px 2px 5px rgba(0,0,0,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#888" : "#333" }}>
              {task.text}
            </span>
            <div>
              <button onClick={() => updateTask(task._id, task.completed)} style={{ marginRight: "5px", padding: "5px 10px", backgroundColor: task.completed ? "#ffc107" : "#007bff", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}>
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button onClick={() => deleteTask(task._id)} style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
