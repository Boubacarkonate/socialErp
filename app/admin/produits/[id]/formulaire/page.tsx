'use client'

import { deleteProduct, getOneProduct, upsertProduct } from "@/app/actions/products";
import { ButtonActionFunction, ButtonBack } from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type PropsData = {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    userId?: string;
}


function FormUpdateProduct({ params }: { params: Promise<{ id: string }> }) {

    const router = useRouter();
    const { id } = use(params); // Utilisation de React.use() pour gérer la promesse.

  const [data, setData] = useState<PropsData>({ 
    name: "",
    description: "",
    price: 0,
    userId: "",
})

    useEffect(()=> {
      const fetchData = async () => {
        if (id) {
           
                const dataProduct = await getOneProduct(parseInt(id, 10));
          setData({
            name: dataProduct?.name || '',
            description: dataProduct?.description || '',
            price: dataProduct?.price || 0,
            userId: dataProduct?.userId|| 'aucun'
          })
        }
      }
      fetchData()
    }, [id])

    const saveProduct = async (e) => {
        e.preventDefault();

        const formulaire = new FormData(e.target);

        try {
         const result = await upsertProduct(formulaire);
            if (result) {
                setTimeout(() => {
                  router.back(); 
                }, 2000); // Délai optionnel
        
              }
        } catch (error) {
            console.error("Erreur :", error); 
        }

    }

    const handleDelete = async () => {
     const result =  await deleteProduct(parseInt(id, 10));
     try{ 
     if (result) {
        setTimeout(() => {
          router.push('/produits'); 
        }, 2000); // Délai optionnel

      }
} catch (error) {
    console.error("Erreur :", error); 
}
    }

                             
    // const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const { name, value } = e.target; 
    // setData((dataExistentes) => ({
    //     ...dataExistentes,      
    //     [name]: value,  
    // }));
    // };
  

  return (
    <div className="h-screen flex w-full justify-center items-center flex-col">
    <h1 className="text-2xl font-bold mb-4">Pages Modification des Produits</h1>
    <form onSubmit={saveProduct} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
        <div className="mb-4">
         {/* Champ ID caché, uniquement utilisé pour l'édition */}
         {id && <input type="hidden" name="id" value={id} />}
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Nom du produit
            </label>
            <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                type="text" 
                name="name" 
                value={data.name}
                onChange={(e)=> {setData({...data, name: e.target.value})}}
            />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
            </label>
            <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                type="text" 
                name="description" 
                value={data.description}
                onChange={(e)=>{setData({...data, description: e.target.value})}}
            />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Prix en euros
            </label>
            <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                type="text" 
                name="price" 
                value={data.price || 0}
                onChange={(e)=>{setData({...data, price: parseFloat(e.target.value)})}}
            />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
                Utilisateur associé
            </label>
            <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                type="text" 
                name="userId" 
                value={data.userId}
                onChange={(e)=>{setData({...data, userId: e.target.value})}}
            />
        </div>

        <div className="flex items-center justify-between">
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="submit">
                Enregistrer
            </button>
        </div>
    </form>
    <ButtonActionFunction onClick={handleDelete} label="Supprimer" className="bg-red-500"/>
    <ButtonBack />
</div>

  )
}

export default FormUpdateProduct;