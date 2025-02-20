'use client';

import { createProduct } from "@/app/actions/products";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOneUser } from "../actions/user";



function CreateProduct() {
  const [image, setImage] = useState<string>("/produit.png");
  const [role, setRole] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchDataUserBdd = async () => {
      const data  = await getOneUser(user.id);
      setRole(data.role)
    }
    fetchDataUserBdd();
  }, [user]);

// const displayImage = (e) => {
//   setImage(e.target.value);
// }

  // Gestionnaire pour mettre à jour les champs dynamiquement


  const saveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const formulaire = new FormData(e.currentTarget);
  
      // Debug : Vérifiez le contenu de FormData
      for (const [key, value] of formulaire.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      const result = await createProduct(formulaire);
      if (result) {
        setAlertMessage("Création du produit avec succès !"); // Afficher le message de succès
        setTimeout(()=> {
          setAlertMessage(null);
        }, 1000);

        setTimeout(() => {
          router.back();
        }, 3000); // Délai optionnel
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const roleStyles = {
    admin: {
      form: "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700 text-gray-900 rounded-badge p-6 w-screen max-w-xl",
      label: "text-amber-300 font-medium text-sm mb-2",
      input: "bg-amber-100 border-2 border-amber-300 text-gray-900 placeholder-amber-500 rounded-md w-full py-1 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all duration-200 ease-in-out font-medium",
      textarea: "bg-amber-100 border-2 border-amber-300 text-gray-900 placeholder-amber-500 rounded-md w-full py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all duration-200 ease-in-out font-medium resize-none h-32",
      button: "bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 ease-in-out shadow-sm",
    },
    team: {
      form: "bg-gradient-to-br from-blue-900 via-indigo-700 to-purple-600 rounded-badge p-8 w-screen max-w-xl",
      label: "text-blue-300 font-medium text-sm mb-2",
      input: "bg-blue-100 border-2 border-blue-400 text-blue-900 placeholder-blue-500 rounded-md w-full py-1 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-all duration-200 ease-in-out font-medium",
      textarea: "bg-blue-100 border-2 border-blue-400 text-blue-900 placeholder-blue-500 rounded-md w-full py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-all duration-200 ease-in-out font-medium resize-none h-32",
      button: "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out shadow-sm",
    },
  }
  
  return (
    <div className="h-full flex w-full justify-center items-center flex-col">
      <h1 className="text-xl font-bold mb-4">Pages Modification des Produits</h1>
      <form
        onSubmit={saveProduct}
        className={`${roleStyles[role]?.form} flex justify-center items-center flex-col gap-4`}
      >
             

       <input type="hidden" name="id" />
       <div className="flex flex-col w-full">
          <label className={`${roleStyles[role]?.label}`} htmlFor="name" >
            Nom du produit
          </label>
          <input
            className={`${roleStyles[role]?.input}`}
            type="text"
            name="name"
           
          />
        </div>
        <div className="flex flex-col w-full">
          <label className={`${roleStyles[role]?.label}`}>
            Image
          </label>
             {/* Affichage de la prévisualisation de l'image */}
        {image && (
          <div className="mb-4">
            <Image
              src={image}
              height={150}
              width={150}
              alt="Prévisualisation"
              className=" object-fill rounded-full"
            />
          </div>
        )}
          <input
            className={`${roleStyles[role]?.input}`}
            type="hidden"
            name="image"
            value={image}
            onChange={(e)=> {setImage(e.target.value)}}
          />
        </div>

        <div className="flex flex-col w-full">
          <label
            className={`${roleStyles[role]?.label}`}
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className={`${roleStyles[role]?.textarea}`}
        
          ></textarea>
        </div>

        <div className="flex flex-col w-full">
          <label className={`${roleStyles[role]?.label}`} htmlFor="price">
            Prix en euros
          </label>
          <input
            className={`${roleStyles[role]?.input}`}
            type="text"
            name="price"
        
          />
        </div>
        <div className="flex flex-col w-full">
          <label className={`${roleStyles[role]?.label}`} htmlFor="price">
            Stock
          </label>
          <input
            className={`${roleStyles[role]?.input}`}
            type="number"
            name="stock"
          placeholder="stock"
          />
        </div>
{/* 
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
            Utilisateur associé
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="userId"
         
          />
        </div> */}

        <div className="flex items-center justify-between">
          <button
            className={`${roleStyles[role]?.button}`}
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

export default CreateProduct;
