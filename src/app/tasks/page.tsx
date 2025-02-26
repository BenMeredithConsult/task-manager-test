"use client";

import React, { useEffect, useState } from 'react';
import { FetchRecords } from '../../lib/utils';

interface Task {
  id: string;
  Name: string;
  Description?: string;
  Assignee?: string;
  DueDate?: string;
  Status: 'Pending' | 'In Progress' | 'Completed';
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newTask, setNewTask] = useState<Task>({
        id: '', // Gérer un identifiant unique au moment de l'ajout (si nécessaire).
        Name: '',
        Description: '',
        Assignee: '',
        DueDate: '',
        Status: 'Pending',
      });
 
    useEffect(() => {
      async function fetchTasks() {
        try {
          const data = await FetchRecords<Task>("Task");
          setTasks(data as Task[]);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchTasks();
    }, []);
  
    if (loading) return <p className="text-center text-gray-500">Chargement des tâches...</p>;
    if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;
  
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Liste des tâches</h1>
        
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">Aucune tâche disponible</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="p-4 border border-gray-300 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800">{task.Name}</h2>
                {task.Description && <p className="text-gray-600">{task.Description}</p>}
                {task.Assignee && <p className="text-gray-700 font-medium">Assigné à : {task.Assignee}</p>}
                {task.DueDate && <p className="text-gray-500">Date limite : {task.DueDate}</p>}
                <p className={`font-semibold ${task.Status === "Completed" ? "text-green-600" : "text-orange-600"}`}>
                  Statut : {task.Status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  