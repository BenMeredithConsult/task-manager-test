"use client";

import React, { useEffect, useState } from 'react';
import { FetchRecords, AddRecord, UpdateRecord, DeleteRecord } from '../../lib/utils';

interface Task {
  id: string;
  Name: string;
  Description?: string;
  Image?: string;
  DueDate?: string;
  Status: 'Pending' | 'In Progress' | 'Completed';
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Contrôle l'affichage du formulaire
  const [showForm, setShowForm] = useState(false);
  
  // État du formulaire d'ajout (sans l'id)
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    Name: '',
    Description: '',
    Image: '',
    DueDate: '',
    Status: 'Pending',
  });
  
  // Pour gérer le fichier image à uploader (optionnel)
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  
  // Fonction d'upload d'image (pour la démonstration, retourne une URL blob)
  const uploadImage = async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  };

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
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Fonction Register inspirée de ta syntaxe, sans le champ "Assigné à"
  const Register = async () => {
    try {
      await AddRecord({
        table: "Task",
        data: {
          Name: newTask.Name,
          Description: newTask.Description,
          DueDate: newTask.DueDate,
          Status: "Pending",
          ...(imageFile ? { Image: await uploadImage(imageFile) } : {}),
        },
      }).then(() => {
        alert("Enregistré avec succès");
      }).catch((error: any) => {
        alert(error.message);
      });
      fetchTasks();
      // Réinitialisation du formulaire
      setNewTask({
        Name: '',
        Description: '',
        Image: '',
        DueDate: '',
        Status: 'Pending',
      });
      setImageFile(null);
      setShowForm(false);
    } catch (err: any) {
      alert(err.message);
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await Register();
  };
  
  const handleMarkInProgress = async (task: Task) => {
    try {
      await UpdateRecord({ table: "Task", id: task.id, data: { Status: "In Progress" } });
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleMarkComplete = async (task: Task) => {
    try {
      await UpdateRecord({ table: "Task", id: task.id, data: { Status: "Completed" } });
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleDelete = async (task: Task) => {
    try {
      await DeleteRecord({ table: "Task", id: task.id });
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTask({
      Name: task.Name,
      Description: task.Description,
      DueDate: task.DueDate,
      Status: task.Status,
    });
  };
  
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveEdit = async (taskId: string) => {
    try {
      await UpdateRecord({ table: "Task", id: taskId, data: editedTask });
      setEditingTaskId(null);
      setEditedTask({});
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTask({});
  };
  
  const filteredTasks = tasks.filter(task =>
    filterStatus === "All" || task.Status === filterStatus
  );
  
  if (loading)
    return <p className="text-center text-gray-500">Chargement des tâches...</p>;
  if (error)
    return <p className="text-center text-red-500">Erreur : {error}</p>;
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Liste des tâches</h1>
      
      {/* Bouton pour afficher/masquer le formulaire */}
      <div className="flex justify-center mb-4">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showForm ? "Annuler" : "Ajouter une tâche"}
        </button>
      </div>
      
      {/* Formulaire d'ajout, masqué par défaut */}
      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white border rounded shadow mb-6">
          <h2 className="text-xl font-semibold text-center text-indigo-600 mb-4">Nouvelle tâche</h2>
          <div className="mb-3">
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
          <div className="mb-3">
            <label className="block text-gray-700">Description :</label>
            <textarea
              name="Description"
              value={newTask.Description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">État :</label>
            <select
              name="Status"
              value={newTask.Status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="Pending">En attente</option>
              <option value="In Progress">En cours</option>
              <option value="Completed">Terminée</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">Date limite :</label>
            <input
              type="date"
              name="DueDate"
              value={newTask.DueDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">Image (optionnel) :</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
          >
            Enregistrer la tâche
          </button>
        </form>
      )}
      
      {/* Filtrage des tâches */}
      <div className="flex justify-center space-x-2 mb-4">
        {["All", "Pending", "In Progress", "Completed"].map(status => (
          <button 
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded ${filterStatus === status ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-800"}`}
          >
            {status === "All" ? "Tous" : status}
          </button>
        ))}
      </div>
      
      {/* Affichage de la liste des tâches */}
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500">Aucune tâche disponible</p>
      ) : (
        <ul className="space-y-4">
          {filteredTasks.map(task => (
            <li key={task.id} className="p-4 border border-gray-300 rounded bg-white">
              {editingTaskId === task.id ? (
                <div>
                  <input
                    type="text"
                    name="Name"
                    value={editedTask.Name || ''}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                  />
                  <textarea
                    name="Description"
                    value={editedTask.Description || ''}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                  />
                  <select
                    name="Status"
                    value={editedTask.Status || 'Pending'}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                  >
                    <option value="Pending">En attente</option>
                    <option value="In Progress">En cours</option>
                    <option value="Completed">Terminée</option>
                  </select>
                  <input
                    type="date"
                    name="DueDate"
                    value={editedTask.DueDate || ''}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{task.Name}</h2>
                  {task.Description && <p className="text-gray-600">{task.Description}</p>}
                  {task.Image && (
                    <img src={task.Image} alt="Task" className="w-32 h-32 object-cover my-2 rounded" />
                  )}
                  {task.DueDate && <p className="text-gray-500">Date limite : {task.DueDate}</p>}
                  <p className={`font-semibold ${
                    task.Status === "Completed" ? "text-green-600" : 
                    task.Status === "In Progress" ? "text-blue-600" : "text-yellow-600"
                  }`}>
                    Statut : {task.Status}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {task.Status === "Pending" && (
                      <button 
                        onClick={() => handleMarkInProgress(task)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Mettre en cours
                      </button>
                    )}
                    {task.Status === "In Progress" && (
                      <button 
                        onClick={() => handleMarkComplete(task)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Terminer
                      </button>
                    )}
                    <button 
                      onClick={() => handleEditClick(task)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(task)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
