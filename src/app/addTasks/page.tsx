'use client';
import { AddRecord } from "@/lib/utils";
import { useState } from "react";

export default function UpdateTask() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const Register = async () => {
    await AddRecord({
      table: "Task",
      data: {
        Name: name,
        Description: description,
        Assignee: null,
        DueDate: date,
        Status: "Pending",
      },
    })
      .then(() => {
        alert("Enregistré avec succès");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        {/* Bouton de retour */}
        <a
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour à l'accueil
        </a>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Ajouter une Tâche</h1>

        {/* Formulaire */}
        <div className="space-y-6">
          {/* Nom de la tâche */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la tâche
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Entrez le nom de la tâche"
              required
            />
          </div>

          {/* Date de fin */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              rows={4}
              placeholder="Entrez la description de la tâche"
              required
            />
          </div>

          {/* Bouton de soumission */}
          <button
            onClick={Register}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 transition-all"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}