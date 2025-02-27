"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FetchRecords, DeleteRecord } from "@/lib/utils";
import { FaEdit, FaTrash } from "react-icons/fa";
import TaskForm from "@/components/taskForm";

type Task = {
  id: string;
  Name: string;
  Description: string;
  Assignee: string;
  DueDate: string;
  Status: "Pending" | "In Progress" | "Completed";
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const fetchTasks = async (status?: string) => {
    try {
      const filter = status ? `Status="${status}"` : "";
      const data = await FetchRecords<Task>("Task", {}, filter);
      setTasks(data as Task[]);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches :", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await FetchRecords<Task>("Task") as Task[];
        data.sort((a, b) => new Date(b.DueDate).getTime() - new Date(a.DueDate).getTime());
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    fetchTasks(statusFilter);
  }, [statusFilter]);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setShowModal(true);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
      try {
        await DeleteRecord({ table: "Task", id: taskId });
        fetchTasks(statusFilter);
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  return (
    <div>
      <header className="row-start-3 flex gap-6 flxex-wrap items-center justify-center">
        <nav className="navbar navbar-light bg-light">
          <div className="container flex justify-between items-center">
            <a href="#" className="flex items-center">
              <Image
                className="dark"
                src="/favicon5.ico"
                alt="Logo"
                width={40}
                height={30}
              />
            </a>
          </div>
        </nav>
        <h1 id="titre_header">
          Note<span>Book</span>
        </h1>
      </header>

      <main>
        <h1 className="center">Hey, qu'est ce qu'on fait aujourd'hui?</h1>
        <br />
        {loading ? (
          <p>Téléchargement...</p>
        ) : (
          <div className="min-h-screen p-8">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium"></label>
                <select
                  className="mt-1 p-2 border rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button
                type="button"
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
                onClick={() => {
                  setTaskToEdit(null);
                  setShowModal(true);
                }}
              >
                Ajouter une tâche
              </button>
            </div>

            <ul className="space-y-4">
              {tasks.length === 0 ? (
                <p>Aucune tâche trouvée.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="container">
                    <li className="p-4 border rounded-md shadow">
                      <h2 className="text-lg font-semibold">{task.Name}</h2>
                      <p>{task.Description}</p>
                      <span
                        className={`px-2 py-1 text-sm font-medium rounded ${getStatusColor(task.Status)}`}
                      >
                        {task.Status}
                      </span>
                      <div className="flex gap-4">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(task)}
                      >
                        <FaEdit size={20} />
                      </button>

                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(task.id)}
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                    </li>
                    
                  </div>
                ))
              )}
            </ul>
          </div>
        )}

        {showModal && (
          <TaskForm
            task={taskToEdit}  // Assurez-vous que cette prop est bien définie dans TaskFormProps
            onClose={() => {
              setTaskToEdit(null);
              setShowModal(false);
            }}
            onTaskAdded={() => fetchTasks(statusFilter)}
          />
        )}
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "Pending":
      return "bg-yellow-200 text-yellow-800";
    case "In Progress":
      return "bg-blue-200 text-blue-800";
    case "Completed":
      return "bg-green-200 text-green-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
}
