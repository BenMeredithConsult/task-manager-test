"use client";

import React, { useEffect, useState } from 'react';
import { FetchRecords, AddRecord, UpdateRecord, DeleteRecord } from '../../lib/utils';

interface Task {
  id: string;
  Name: string;
  Description?: string;
  Assignee?: string;
  DueDate?: string;
  Status: 'Pending' | 'In Progress' | 'Completed';
}

export default function TasksPage() {
  // État pour stocker la liste des tâches
  const [tasks, setTasks] = useState<Task[]>([]);
  // États de chargement et d'erreur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // État pour gérer le formulaire d'ajout d'une nouvelle tâche
  const [newTask, setNewTask] = useState<Task>({
    id: '',
    Name: '',
    Description: '',
    Assignee: '',
    DueDate: '',
    Status: 'Pending',
  });
  // État pour filtrer les tâches selon leur statut
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Fonction pour récupérer les tâches depuis Airtable
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await FetchRecords<Task>("Task");
      setTasks(data as Task[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Gère la modification des inputs du formulaire
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Envoi du formulaire pour ajouter une nouvelle tâche
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Exclure le champ "id" avant d'envoyer les données à Airtable
      const { id, ...taskData } = newTask;
      await AddRecord({ table: "Task", data: taskData });
      fetchTasks();
      // Réinitialise le formulaire
      setNewTask({
        id: '',
        Name: '',
        Description: '',
        Assignee: '',
        DueDate: '',
        Status: 'Pending',
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Met à jour le statut d'une tâche à "Completed"
  const handleMarkComplete = async (task: Task) => {
    try {
      await UpdateRecord({ table: "Task", id: task.id, data: { Status: "Completed" } });
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Supprime une tâche
  const handleDelete = async (task: Task) => {
    try {
      await DeleteRecord({ table: "Task", id: task.id });
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Filtre les tâches selon le statut sélectionné
  const filteredTasks = tasks.filter(task =>
    filterStatus === "All" || task.Status === filterStatus
  );

  if (loading)
    return <p className="text-center text-gray-500">Chargement des tâches...</p>;
  if (error)
    return <p className="text-center text-red-500">Erreur : {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
        Liste des tâches
      </h1>

      {/* Filtrage par statut */}
      <div className="flex justify-center space-x-4 mb-6">
        {["All", "Pending", "In Progress", "Completed"].map(status => (
          <button 
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded ${filterStatus === status ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {status === "All" ? "Tous" : status}
          </button>
        ))}
      </div>

      {/* Formulaire pour ajouter une nouvelle tâche */}
      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ajouter une nouvelle tâche</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Nom de la tâche :</label>
          <input
            type="text"
            name="Name"
            value={newTask.Name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description :</label>
          <textarea
            name="Description"
            value={newTask.Description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Assigné à :</label>
          <input
            type="text"
            name="Assignee"
            value={newTask.Assignee}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date limite :</label>
          <input
            type="date"
            name="DueDate"
            value={newTask.DueDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter Tâche
        </button>
      </form>

      {/* Affichage des tâches filtrées */}
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500">Aucune tâche disponible</p>
      ) : (
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li key={task.id} className="p-4 border border-gray-300 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800">{task.Name}</h2>
              {task.Description && <p className="text-gray-600">{task.Description}</p>}
              {task.Assignee && (
                <p className="text-gray-700 font-medium">Assigné à : {task.Assignee}</p>
              )}
              {task.DueDate && <p className="text-gray-500">Date limite : {task.DueDate}</p>}
              <p className={`font-semibold ${task.Status === "Completed" ? "text-green-600" : "text-orange-600"}`}>
                Statut : {task.Status}
              </p>
              {/* Boutons pour mettre à jour ou supprimer la tâche */}
              <div className="mt-4 flex space-x-4">
                {task.Status !== "Completed" && (
                  <button 
                    onClick={() => handleMarkComplete(task)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Marquer comme complétée
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(task)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
