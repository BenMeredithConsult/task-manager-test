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
    if (confirm("VOulez vous supprimer l'element suivant?")) {
      DeleteRecord({ table: "Task", id: taskId })
        .then(() => {
          alert("supprimer avec succès");
          window.location.reload();
        })
        .catch((error) => alert(error.message));
    } else {
      alert("error");
    }
  };

  const Done = (taskId: string) => {
    if (confirm("VOulez vous terminer la tâche suivant?")) {
      UpdateRecord({ table: "Task", id: taskId, data: { Status: "Completed" } })
        .then(() => {
          alert("Terminée avec succès");
          window.location.reload();
        })
        .catch((error) => alert(error.message));
    } else {
      alert("error");
    }
  };

  if (allData) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px]  min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-wrap justify-between min-w-full mb-10">
          <h1 className="text-2xl">Listes des Tâches</h1>
          <a
            href="/addTasks"
            className="btn py-2 px-4 border-2 dark:border-blue-300 border-blue-700 dark:bg-blue-300  dark:text-black rounded"
          >
            Ajouter une Tâche
          </a>
        </div>
        <div className="flex flex-wrap sm:flex-col lg:flex-row gap-16 justify-center">
          {allData.map((data: any, index: number) => (
            <>
              {data?.Status == "Completed" ? (
                <article
                  key={index}
                  className="flex lg:w-3/12 shadow-xl sm:w-2/4 0px flex-col items-start  justify-between bg-gray-500  dark:bg-white dark:text-black border-solid border-2 border-black rounded-xl p-5 cursor-pointer"
                >
                  <div className="flex justify-between items-center flex-wrap text-lg">
                    <p className="relative z-10 rounded-full bg-yellow-50 px-3 py-1.5 font-medium text-green-600 hover:text-green-700 hover:bg-yellow-50">
                      {data?.Status}
                    </p>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-xl/6 font-semibold text-gray-900 group-hover:text-gray-600">
                      <a href="#">
                        <span className="absolute inset-0"></span>
                        {data.Name}
                      </a>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-lg/6 text-gray-600">
                      {data.Description}
                    </p>
                    <p className="mt-5 line-clamp-3 text-lg/6 text-gray-600">
                      <strong>Deadline: </strong>
                      {data.DueDate}
                    </p>
                  </div>
                  <div className=" mt-8 flex flex-wrap items-center gap-x-4">
                    {/* <a
            href="{% url 'activity_details' activity.id %}"
            className="btn bg-blue-600 text-white hover:bg-blue-800 cursor-pointer border-solid border-2 rounded p-2"
            >Details</a
          > */}
                    <a
                      href="#"
                      onClick={() => Confirmation(data.id)}
                      className="btn bg-red-600 text-white hover:bg-red-800 cursor-pointer border-solid border-2 rounded p-2"
                    >
                      Supprimer
                    </a>
                    <a
                      href={`/edit/${data.id}`}
                      className="btn bg-yellow-600 text-white hover:bg-yellow-800 cursor-pointer border-solid border-2 rounded p-2"
                    >
                      Modifier
                    </a>
                    {data.Status != "Completed" ? (
                      <a
                        href="#"
                        onClick={() => Done(data.id)}
                        className="btn bg-green-600 text-white hover:bg-green-800 cursor-pointer border-solid border-2 rounded p-2"
                      >
                        Terminer
                      </a>
                    ) : (
                      <></>
                    )}
                  </div>
                </article>
              ) : (
                <article
                  key={index}
                  className="flex lg:w-3/12 shadow-xl sm:w-2/4 0px flex-col items-start  justify-between  dark:bg-white dark:text-black border-solid border-2 border-black rounded-xl p-5 cursor-pointer"
                >
                  <div className="flex justify-between items-center flex-wrap text-lg">
                    <p className="relative z-10 rounded-full bg-yellow-50 px-3 py-1.5 font-medium text-orange-600 hover:text-orange-700 hover:bg-yellow-50">
                      {data?.Status}
                    </p>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-xl/6 font-semibold text-gray-900 group-hover:text-gray-600">
                      <a href="#">
                        <span className="absolute inset-0"></span>
                        {data.Name}
                      </a>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-lg/6 text-gray-600">
                      {data.Description}
                    </p>
                    <p className="mt-5 line-clamp-3 text-lg/6 text-gray-600">
                      <strong>Deadline: </strong>
                      {data.DueDate}
                    </p>
                  </div>
                  <div className=" mt-8 flex flex-wrap items-center gap-x-4">
                    {/* <a
      href="{% url 'activity_details' activity.id %}"
      className="btn bg-blue-600 text-white hover:bg-blue-800 cursor-pointer border-solid border-2 rounded p-2"
      >Details</a
    > */}
                    <a
                      href="#"
                      onClick={() => Confirmation(data.id)}
                      className="btn bg-red-600 text-white hover:bg-red-800 cursor-pointer border-solid border-2 rounded p-2"
                    >
                      Supprimer
                    </a>
                    <a
                      href={`/edit/${data.id}`}
                      className="btn bg-yellow-600 text-white hover:bg-yellow-800 cursor-pointer border-solid border-2 rounded p-2"
                    >
                      Modifier
                    </a>
                    {data.Status != "Completed" ? (
                      <a
                        href="#"
                        onClick={() => Done(data.id)}
                        className="btn bg-green-600 text-white hover:bg-green-800 cursor-pointer border-solid border-2 rounded p-2"
                      >
                        Terminer
                      </a>
                    ) : (
                      <></>
                    )}
                  </div>
                </article>
              )}
            </>
          ))}
        </div>
      </div>
    );
  } else {
    <div className="loader"></div>;
  }
}
