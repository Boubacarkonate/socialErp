'use client'

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { addPlanning } from "../actions/planning";
import { getOneUser } from "../actions/user";

interface UserPropsId {
  id: number;
  firstname?: string;
  lastname?: string;
}



export const CreatePlanning =  () => {
  const[dataUserId, setUserId]= useState<UserPropsId>('')
  const { user } = useUser();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        const dataUserId = await getOneUser(user.id)
        setUserId(dataUserId);
        
      } catch (error) {
        console.error("erreur dans la récupération de l'id de la bdd", error);
        
      }
    }
    fetchData();
  }, [user])


    const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formulaire = new FormData(e.currentTarget);
               // Debug : Vérifiez le contenu de FormData
      for (const [key, value] of formulaire.entries()) {
        console.log(`${key}: ${value}`);
      }
            await addPlanning(formulaire)
            setAlertMessage("Date ajoutée avec succès !"); // Afficher le message de succès

        } catch (error) {
            console.error(error);
        }
       
    }
  return (          /*h-screen flex w-full*/
    <div className=" justify-center items-center flex-col">
      <h1 className="text-2xl font-bold mb-4 text-amber-300">Modifier le planning</h1>
      <form
        onSubmit={handlesubmit}
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
      >
        <div className="mb-4">
          <label className="block text-amber-300 font-medium text-sm mb-2" htmlFor="title">
            Nom de la tâche
          </label>
          <input
  className="bg-amber-100 border-2 border-amber-300 text-gray-900 placeholder-amber-500 rounded-md w-full py-1 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all duration-200 ease-in-out font-medium"
  type="text"
            name="title"
           placeholder="nom"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-amber-300 font-medium text-sm mb-2" htmlFor="startDate">
            Début
          </label>
          <input
          type="date"
          className="bg-amber-100 border-2 border-amber-300 text-gray-900 placeholder-amber-500 rounded-md w-full py-1 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all duration-200 ease-in-out font-medium"
          name="startDate"
            required
          />    
        </div>
        <div className="mb-4">
          <label className="block text-amber-300 font-medium text-sm mb-2" htmlFor="endDate">
            Fin
          </label>
          <input
          type="date"
          className="bg-amber-100 border-2 border-amber-300 text-gray-900 placeholder-amber-500 rounded-md w-full py-1 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all duration-200 ease-in-out font-medium"
          name="endDate"
            required
          />    
        </div>

        <div className="mb-4">
          <label className="block text-amber-300 font-medium text-sm mb-2" htmlFor="userId">
            Choisir un membre de l'équipe
          </label>
          <select
        id="userId"
        name="userId"
        className="bg-amber-100 border-2 border-amber-300 text-gray-900 rounded-md py-1 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ease-in-out font-medium w-full"
            required
      >
            <option value="">-- Selectionner --</option>
            {dataUserId && (
              <option value={dataUserId.id}>
                {dataUserId.firstname} {dataUserId.lastname}
              </option>
            )}
      </select>
        </div>

        <div className="flex items-center justify-center">
          <button
      className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 ease-in-out shadow-sm"
      type="submit"
          >
            Enregistrer
          </button>
        </div>
      </form>
      {alertMessage && (
        <p className=" mx-auto text-white text-sm font-bold p-1 bg-green-500 rounded-xl flex items-center justify-center animate-bounce  w-1/2">{alertMessage}</p>
      )}
    </div>
  );

}

export default CreatePlanning;