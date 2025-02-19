"use client";

import { getOneProduct } from "@/app/actions/products";
import Header from "@/app/components/hearder/Header";
import { ButtonBack } from "@/app/ui/Button";
import { authentification_data } from "@/hooks/autentification&data";
import { getUserDetails } from "@/services/servicesUsers";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const DetailProduit = () => {
  const params = useParams();
  const [productData, setProductData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!params?.id) {
          throw new Error("ID de produit manquant");
        }

        const id = parseInt(params.id, 10);
        const { userId } = await authentification_data();
        const userDetails = await getUserDetails(userId);
        const product = await getOneProduct(id);

        setUserData(userDetails);
        setProductData(product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id]);

  if (loading) return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <Header />
      <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
        Détail du Produit 🛍️
      </h1>

      <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {productData?.name}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed mb-4">
            {productData?.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-900 font-semibold text-xl">
              {productData?.price?.toFixed(2)} €
            </span>
            <span className="text-gray-500 text-sm">ID: {productData?.id}</span>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-3">
          <p className="text-gray-700 text-base">
            Utilisateur associé :{" "}
            <span className="font-medium text-gray-800">
              {productData?.userId || "aucun"}
            </span>
          </p>
        </div>

        {userData?.role === "admin" && (
          <div className="px-6 py-4 flex gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200">
              Ajouter
            </button>
            <Link
              href={`/produits/${productData?.id}/formulaire`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200"
            >
              Modifier
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <ButtonBack />
      </div>
    </div>
  );
};

export default DetailProduit;
