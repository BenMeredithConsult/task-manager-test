'use client'
import {  RetreiveRecord, UpdateRecord } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function UpdateTask({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    
    const [name,setName]=useState("")
    const [date,setDate]=useState("")
    const [id,setId]=useState("")
    const [description,setDescription]=useState("")
    const slug2 =async() =>{ return((await params).id )} 
    useEffect(()=>{
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
    },[])
    

    const UpdateData=async ()=>{
      await UpdateRecord({table:"Task",id:id,data:{
        Name: name,
        Description: description,
        DueDate: date,
        Assignee:null,
        Status: "Pending",
      }}).then(()=>{alert("Tâche mis a jour avec succés");window.location.href="/"}).catch((error)=>alert(error.message))
    }

    return (
      <>
  <a className="btn bg-yellow" href="/">Accueil</a>
<div className="max-w-sm mx-auto mt-20">
  <div className="mb-5">
    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom de la tâche</label>
    <input type="email" id="Nom"  value={name} onChange={(e)=>setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
  </div>
  <div className="mb-5">
    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date de Fin</label>
    <input type="date" id="date" value={date} onChange={(e)=>setDate(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
  <div className="mb-5">
    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
    <textarea  id="date" value={description} onChange={(e)=>setDescription(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
 
  <button onClick={UpdateData} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
</div>

      </>
    )
}