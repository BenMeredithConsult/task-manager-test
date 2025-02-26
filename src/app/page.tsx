"use client";

import React, { useEffect, useState } from 'react';
import { FetchRecords, AddRecord } from '../../lib/utils';

interface Task {
  id: string;
  Name: string;
  Description?: string;
  Assignee?: string;
  DueDate?: string;
  Status: 'Pending' | 'In Progress' | 'Completed';
}

export default function TasksPage() {
  // État pour stocker les tâches récupérées
  const [tasks, setTasks] = useState<Task[]>([]);
  // État pour le chargement et les erreurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // État pour le formulaire de nouvelle tâche
  const [newTask, setNewTask] = useState<Task>({
    id: '',
    Name: '',
    Description: '',
    Assignee: '',
    DueDate: '',
    Status: 'Pending',
  });

  // Fonction pour récupérer les tâches depuis Airtable
  const fetchTasks = async () => {
    try {
      const data = await FetchRecords<Task>("Task");
      setTasks(data as Task[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Récupère les tâches au chargement du composant
  useEffect(() => {
    fetchTasks();
  }, []);

  // Met à jour l'état newTask lors des changements dans les inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Gère l'envoi du formulaire pour ajouter une nouvelle tâche
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Appelle la fonction pour ajouter la tâche dans Airtable
      await AddRecord({ table: "Task", data: newTask });
      // Après ajout, on récupère de nouveau la liste des tâches
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

  if (loading)
    return <p className="text-center text-gray-500">Chargement des tâches...</p>;
  if (error)
    return <p className="text-center text-red-500">Erreur : {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
        Liste des tâches
      </h1>

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

      {/* Affichage de la liste des tâches */}
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">Aucune tâche disponible</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 border border-gray-300 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800">{task.Name}</h2>
              {task.Description && <p className="text-gray-600">{task.Description}</p>}
              {task.Assignee && (
                <p className="text-gray-700 font-medium">Assigné à : {task.Assignee}</p>
              )}
              {task.DueDate && <p className="text-gray-500">Date limite : {task.DueDate}</p>}
              <p
                className={`font-semibold ${
                  task.Status === "Completed" ? "text-green-600" : "text-orange-600"
                }`}
              >
                Statut : {task.Status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
