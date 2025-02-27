"use client";

import { useState } from "react";
import { AddRecord } from "@/lib/utils";


type Task = {
    id: string;
    Name: string;
    Description: string;
    Assignee: string;
    DueDate: string;
    Status: "Pending" | "In Progress" | "Completed";
};
  

type TaskFormProps = {
    task?: Task | null;
  onClose: () => void; 
  onTaskAdded: () => Promise<void>; //fonction to refresh the list
};

export default function TaskForm({ task, onClose, onTaskAdded }: TaskFormProps) {
  const [newTask, setNewTask] = useState({
    Name: "",
    Description: "",
    Assignee: "",
    DueDate: "",
    Status: "Pending",
  });

  // form submitting function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Deleting spaces
    const cleanedTask = {
      Name: newTask.Name.trim(), // Supprimer les espaces autour du nom
      Description: newTask.Description.trim(), // Supprimer les espaces autour de la description
      DueDate: newTask.DueDate.trim(), // Supprimer les espaces autour de la date
      Status: newTask.Status.trim(), // Supprimer les espaces autour du statut
    };

    console.log("Form data before submit:", cleanedTask);

    if (!cleanedTask.Name) {
      console.error("Le nom de la tâche est requis.");
      return;
    }

    try {
      //Send datas to Airtable database
      await AddRecord({ table: "Task", data: cleanedTask });

      //Refresh the list after adding a task
      onTaskAdded();

      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  //Form template
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Nouvelle Tâche</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom"
            value={newTask.Name}
            onChange={(e) => setNewTask({ ...newTask, Name: e.target.value })}
            className="p-2 border rounded-md"
            required
          />
          <textarea
            placeholder="Description"
            value={newTask.Description}
            onChange={(e) => setNewTask({ ...newTask, Description: e.target.value })}
            className="p-2 border rounded-md"
            required
          />
          <input
            type="date"
            value={newTask.DueDate}
            onChange={(e) => setNewTask({ ...newTask, DueDate: e.target.value })}
            className="p-2 border rounded-md"
          />
          <select
            value={newTask.Status}
            onChange={(e) => setNewTask({ ...newTask, Status: e.target.value })}
            className="p-2 border rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded-md" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
