'use client'

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getOneUser, upsertUsertDATA } from "../actions/user";
import { ButtonActionFunction } from "../ui/Button";

type PropsData = {
  clerkUserId?: string;
  lastname: string;
  firstname: string;
 email: string;
 role: string;
 photo: string;

}

// type Props = {
//   params: { id: string };
// };
const FormUserProfile = () => {
// const FormUpdate = ( { params }: Props) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const { user } = useUser();   //propriété de Clerk qui me permet les données de l'utilisateur actuellement 

  // const { id } = params;

  const [data, setData] = useState<PropsData>({
    clerkUserId: "",
    firstname: "",
    lastname: '',
    email: '',
    role: '',
    photo: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const userData = await getOneUser(user.id);
  
          setData({
            clerkUserId: userData.clerkUserId || user.id,
            firstname: userData.firstname || user.firstName || '',
            lastname: userData?.lastname || user.lastName || '',
            email: userData?.email || user.emailAddresses[0]?.emailAddress || '',
            role: userData?.role || '',
            photo: userData?.photo || user.imageUrl || ''
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Vous pouvez gérer ici un fallback si nécessaire
          setData({
            clerkUserId: user.id,
            firstname: user.firstName || '',
            lastname: user.lastName || '',
            email: user.emailAddresses[0]?.emailAddress || '',
            role: '',
            photo: user.imageUrl 
          });
        }
      }
    };
  
    fetchData();
  }, [user]);
  

 const envoyer = async (e) => {
     e.preventDefault();
   
     const formData = new FormData(e.target);
 
     try {
       await upsertUsertDATA(formData);
       setAlertMessage("Modification avec succès !"); // Afficher le message de succès
      console.log(formData);
      
       // Masquer l'alerte après 3 secondes
       setTimeout(() => {
         setAlertMessage(null);
       }, 3000);
     } catch (error) {
       console.error("Erreur :", error);
     }
   
   };
 
                           //ce typage signifie que e est un événement qui provient d'un champ HTML <input> ou <select>.
   const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
     const { name, value } = e.target; // Récupère le nom et la valeur du champ modifié
     setData((dataExistentes) => ({
       ...dataExistentes,       // Copie toutes les propriétés existantes dans `data`
       [name]: value, // Remplace uniquement la propriété correspondant au champ modifié   [name] représente la clé/propriété et value est la valeur de cette clé => c'est le "Computed Property Names" (noms de propriétés calculés): pour définir dynamiquement les clés et ses valeurs 
     }));
   };

   const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour ouvrir le modal
  const openModal = () => setIsModalOpen(true);

  // Fonction pour fermer le modal
  const closeModal = () => setIsModalOpen(false);

  // Fonction de suppression
  const handleDelete = () => {
    alert("Supprimé avec succès !");
    closeModal();
  };

  const roleStyles = {
    admin: {
      form: "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700 text-gray-900 rounded-badge p-6  max-w-xl",
      label: "text-amber-300 font-medium text-sm mb-2",
      input: "bg-amber-100 border-2 border-amber-300 text-gray-900 placeholder-amber-500 rounded-md w-full py-1 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all duration-200 ease-in-out font-medium",
      button: "bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 ease-in-out shadow-sm",
    },
    team: {
      form: "bg-gradient-to-br from-blue-900 via-indigo-700 to-purple-600 rounded-badge p-8 max-w-xl",
      label: "text-blue-300 font-medium text-sm mb-2",
      input: "bg-blue-100 border-2 border-blue-400 text-blue-900 placeholder-blue-500 rounded-md w-full py-1 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-all duration-200 ease-in-out font-medium",
      button: "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out shadow-sm",
    },
    user: {
      form: "bg-gray-100 text-gray-900 rounded-badge p-6  max-w-xl shadow-md",
      label: "text-gray-700 font-medium text-sm mb-2",
      input: "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md w-full py-1 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition-all duration-200 ease-in-out",
      button: "bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 ease-in-out shadow-sm",
    }
  };  

  return (
    
     <div className=" items-center justify-center">

      <form onSubmit={envoyer} className={`${roleStyles[data.role]?.form} mt-5`}>
                {/* Champ ID caché, uniquement utilisé pour l'édition */}
                {/* {data.id && <input type="hidden" name="id" value={data.id} />} */}
      <div className="flex justify-center items-center flex-col">   
      <label htmlFor="photo" className={`${roleStyles[data.role]?.label}`}>Photo</label>
        <input type="text" name="photo" value={data.photo}onChange={changeValue} className={`${roleStyles[data.role]?.input} cursor-not-allowed grayscale `} disabled/>
      
                {/* Affiche la photo si une URL valide est saisie */}
        {data.photo && (
        <Image src={data.photo} alt="Avatar profil" height={130} width={130} className="rounded-full pt-3" />
        )}
     
        {/* <label htmlFor="idClerk" className="block text-gray-700 font-bold mb-2 w-full">ID Clerk</label> */}
        <input type="hidden" name="clerUserId" className="bg-gray-100 text-gray-900 rounded-md px-4 py-2 w-full" value={data.clerkUserId} onChange={changeValue} />
         
        <div className="flex items-center justify-between gap-4 mt-8">
  <div className="flex flex-col w-full">
    <label htmlFor="lastname" className={`${roleStyles[data.role]?.label}`}>Nom</label>
    <input
  type="text"
  name="lastname"
  className={`${roleStyles[data.role]?.input}`}
  placeholder="Nom"
  value={data.lastname}
  onChange={changeValue}
/>

  </div>

  <div className="flex flex-col w-full">
    <label htmlFor="firstname" className={`${roleStyles[data.role]?.label}`}>Prénom</label>
    <input
      type="text"
      name="firstname"
      className={`${roleStyles[data.role]?.input}`}
      placeholder="Prénom"
      value={data.firstname}
      onChange={changeValue}
    />
  </div>
</div>
        
        <label htmlFor="nom" className={`${roleStyles[data.role]?.label} w-full mt-8`}>Email</label>
          <input type="text" readOnly name="email" className={`${roleStyles[data.role]?.input} cursor-not-allowed grayscale `} placeholder="email" value={data.email}  onChange={changeValue} />
       {
        data.role !== 'admin' ? ( 
        <input type="hidden" name="role" value={data.role} />
       ) : (
          <label htmlFor="nom" className={`${roleStyles[data.role]?.label} w-full pt-2 mt-8 `}>Rôle
          <select name="role" value={data.role} onChange={changeValue} className={`${roleStyles[data.role]?.input}`}>
            <option value="admin">ADMIN</option>
            <option value="team">TEAM</option>
            <option value="user">USER</option>
          </select>
        </label>
        
       )
      }
 <div>
  <div className="flex space-x-4 mt-6">
    <button
      type="submit"
      className={`${roleStyles[data.role]?.button}`}
    >
      Modifier
    </button>

    <ButtonActionFunction
        label="Supprimer"
        className={`${roleStyles[data.role]?.button}`}
        onClick={openModal}
      />

      {/* Modal de confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Êtes-vous sûr ?</h3>
            <p className="text-gray-700 mb-4">Voulez-vous vraiment supprimer cet élément ? Cette action est irréversible.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}  </div>
</div>

      </div>
      </form>
     
      {alertMessage && (
        <p className=" mx-auto text-white text-sm font-bold p-1 bg-green-500 rounded-xl flex items-center justify-center animate-bounce  w-1/2">{alertMessage}</p>
      )}
      
     
    </div>
  )
}

export default FormUserProfile;
