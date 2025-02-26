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

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await FetchRecords<Task>('Task');
        setTasks(data as Task[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  if (loading) return <p>Chargement des tâches...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h1>Liste des tâches</h1>
      {tasks.length === 0 ? (
        <p>Aucune tâche disponible</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <h2>{task.Name}</h2>
              {task.Description && <p>{task.Description}</p>}
              {task.Assignee && <p>Assigné à : {task.Assignee}</p>}
              {task.DueDate && <p>Date limite : {task.DueDate}</p>}
              <p>Statut : {task.Status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
