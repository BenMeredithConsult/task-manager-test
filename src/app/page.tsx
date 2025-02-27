"use client";

import { DeleteRecord, FetchRecords, UpdateRecord } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [allData, setAllData] = useState<any>();

  useEffect(() => {
    FetchRecords("Task", "NOT({Name} = '')")
      .then((records) => setAllData(records))
      .catch((error) => console.log(error));
  }, []);

  const Confirmation = (taskId: string) => {
    if (confirm("Voulez-vous supprimer cet élément ?")) {
      DeleteRecord({ table: "Task", id: taskId })
        .then(() => {
          alert("Supprimé avec succès");
          window.location.reload();
        })
        .catch((error) => alert(error.message));
    } else {
      alert("Annulé");
    }
  };

  const Done = (taskId: string) => {
    if (confirm("Voulez-vous terminer cette tâche ?")) {
      UpdateRecord({ table: "Task", id: taskId, data: { Status: "Completed" } })
        .then(() => {
          alert("Terminée avec succès");
          window.location.reload();
        })
        .catch((error) => alert(error.message));
    } else {
      alert("Annulé");
    }
  };

  if (allData) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Liste des Tâches</h1>
            <a
              href="/addTasks"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Ajouter une Tâche
            </a>
          </div>

          {/* Liste des tâches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allData.map((data: any, index: number) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
                  data?.Status === "Completed" ? "opacity-80" : ""
                }`}
              >
                {/* Statut */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      data?.Status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {data?.Status}
                  </span>
                </div>

                {/* Titre et description */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{data.Name}</h3>
                <p className="text-gray-600 mb-4">{data.Description}</p>
                <p className="text-gray-600 mb-4">
                  <strong>Deadline : </strong>
                  {data.DueDate}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => Confirmation(data.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                  >
                    Supprimer
                  </button>
                  <a
                    href={`/edit/${data.id}`}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all"
                  >
                    Modifier
                  </a>
                  {data.Status !== "Completed" && (
                    <button
                      onClick={() => Done(data.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                    >
                      Terminer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="loader"></div>
      </div>
    );
  }
}