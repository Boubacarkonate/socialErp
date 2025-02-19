"use client";

import { getOneProduct } from "@/app/actions/products";
import Header from "@/app/components/hearder/Header";
import { useProductsContext } from "@/app/Context/CartContext";
import { ButtonBack } from "@/app/ui/Button";
import { getUserDetails } from "@/services/servicesUsers";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PropsProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};

interface ProspUser {
  role: string;
};

function DetailProduit() {
  const params = useParams();
  const id = params?.id ? parseInt(params.id, 10) : null;

  const [productData, setProductData] = useState<PropsProduct | null>(null);
  const [userData, setUserData] = useState<ProspUser | null>(null);
  const { addToCart } = useProductsContext();
  const { user } = useUser();

  useEffect(() => {
    if (!id || isNaN(id)) return;

    const fetchData = async () => {
      try {
        const fetchedUserData = user?.id ? await getUserDetails(user.id) : null;
        setUserData(fetchedUserData);

        const product = await getOneProduct(id);
        if (!product) {
          throw new Error("Produit introuvable.");
        }
        setProductData(product);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, [id, user?.id]);

  const handleAddProduct = () => {
    if (productData) {
      addToCart({ ...productData, quantityProduct: 1 });
      alert(`"${productData.name}" a été ajouté au panier`);
    }
  };

  if (!productData) {
    return <p className="text-center text-gray-500">Chargement du produit...</p>;
  }

  return (
    <div className="px-4 py-8 mx-auto">
      <Header />
      <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
        Détail du Produit 🛍️
      </h1>

      <div className="max-w-4xl px-4 py-8 mx-auto">
        <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
          {/* Contenu principal */}
          <div className="px-6 py-5">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {productData.name}
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              {productData.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-900 font-semibold text-xl">
                {productData?.price ? productData.price.toFixed(2) : "Prix indisponible"} €
              </span>
              {userData?.role === "admin" && (
                <span className="text-gray-500 text-sm">ID: {productData.id}</span>
              )}
            </div>
          </div>

          {/* Boutons pour l'admin */}
          <div className="px-6 py-4 flex gap-4">
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200"
            >
              Ajouter
            </button>
            {userData?.role === "admin" && (
              <Link
                href={`/admin/produits/${productData.id}/formulaire`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200"
              >
                Modifier
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bouton retour */}
      <div className="mt-8 flex justify-center">
        <ButtonBack />
      </div>
    </div>
  );
}

export default DetailProduit;
