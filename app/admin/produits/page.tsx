import ListProducts from "@/app/components/ListProducts"
import Link from "next/link"

function FormCreateProduct() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700">
       
       <Link
  href="/admin/produits/formulaire"
  className="inline-flex items-center mt-5 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-300"
>
  <span className="mr-2">🛠️</span>
  Créer un nouveau produit
</Link>
        
        <ListProducts />
    </div>
  )
}

export default FormCreateProduct