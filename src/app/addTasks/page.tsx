'use client'
import { AddRecord } from "@/lib/utils"
import {  useState } from "react"

export default function UpdateTask() {
   const [name,setName]=useState("")
   const [date,setDate]=useState("")
   const [description,setDescription]=useState("")

    const Register =async ()=>{
       await  AddRecord({table:"Task",data:{
            Name: name,
           Description: description,
            Assignee: null,
            DueDate: date,
             Status: "Pending" ,
        }}).then(()=>{alert("enregistrer avec succés")}).catch((error)=>{alert(error.message)});
    }



return (
      <>
<a style={{paddingTop:"20px"}} href="/">Accueil</a>
<div className="max-w-sm mx-auto mt-20" >
  <div className="mb-5">
    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom de la tâche</label>
    <input type="text" id="Nom" onChange={(e)=>{setName(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required />
  </div>
  <div className="mb-5">
    <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date de Fin</label>
    <input type="date" id="date" onChange={(e)=>{setDate(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
  <div className="mb-5">
    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
    <textarea onChange={(e)=>{setDescription(e.target.value)}}  id="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
 
  <button onClick={Register} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
</div>

      </>
    )
}