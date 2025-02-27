'use client'
import { RetreiveRecord, UpdateRecord } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function UpdateTask({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [id, setId] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const slug2 = async() => { return((await params).id )} 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const slugged = await slug2();
        const records:any = await RetreiveRecord('Task', slugged);
        setName(records?.fields?.Name);
        setDate(records?.fields?.DueDate);
        setDescription(records?.fields?.Description);
        setId(records?.id);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [])
  
  const UpdateData = async () => {
    setIsLoading(true);
    try {
      await UpdateRecord({
        table: "Task",
        id: id,
        data: {
          Name: name,
          Description: description,
          DueDate: date,
          Assignee: null,
          Status: "Pending",
        }
      });
      alert("Tâche mise à jour avec succès");
      window.location.href = "/";
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* En-tête avec bouton de retour */}
        <div className="mb-8 flex items-center">
          <a href="/" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour à l'accueil
          </a>
        </div>
        
        {/* Carte principale */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Modifier la tâche</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {/* Nom de la tâche */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la tâche
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Entrez le nom de la tâche"
                  required
                />
              </div>
              
              {/* Date de fin */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Décrivez cette tâche..."
                  required
                />
              </div>
              
              {/* Bouton de soumission */}
              <div className="pt-4">
                <button
                  onClick={UpdateData}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mise à jour...
                    </>
                  ) : (
                    "Mettre à jour la tâche"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}