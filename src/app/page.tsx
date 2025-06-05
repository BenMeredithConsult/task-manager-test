"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import Image from "next/image";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  image?: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [imageURL, setImageURL] = useState<string>("");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);
  
  const saveTasks = (tasks: Task[]) => {
    setTasks(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const addTask = () => {
    if (!taskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: taskTitle,
      completed: false,
      image: imageURL, 
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    setTaskTitle("");
    setImageURL(""); 
  };

  const toggleTask = (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex justify-center items-center">
        <div className="p-8 bg-white shadow-lg rounded-lg w-1/2 text-center">
          <div className="mb-4 flex space-x-2">
            <input
              type="text"
              className="border p-2 rounded flex-grow text-black focus-within:outline-amber-200"
              placeholder="Ajouter une  tâche"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <input
              type="url"
              className="border p-2 rounded flex-grow text-black focus-within:outline-amber-200"
              placeholder="URL de l'image"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
            <button
              className="bg-amber-500 text-white px-4 py-2 rounded"
              onClick={addTask}
            >
              Ajouter
            </button>
          </div>

          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="flex justify-between items-center p-2 border rounded mb-2">
                <span className={`text-black ${task.completed ? "line-through" : ""}`}>
                  {task.title}
                  {task.image && (
                    <Image
                      src={task.image}
                      alt="Task Image"
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                  )}
                </span>
                <div>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    {task.completed ? "Annuler" : "Terminer"}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
