"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllProducts } from "../actions/products";
import { getOneUser } from "../actions/user";
import { useProductsContext } from "../Context/CartContext";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  userId: string;
}

function ListProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  const { user } = useUser();
  const { addToCart } = useProductsContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError("Impossible de charger les produits. Veuillez réessayer.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      const userData = await getOneUser(user?.id);
      setUserRole(userData.role);
    };
    fetchUserRole();
  }, [user]);

  const roleStyles = {
    admin: {
      title: "text-3xl text-center mb-6 font-bold text-amber-300",
    },
    team: {
      title: "text-3xl text-center mb-6 font-bold text-blue-50",
    },
  };

  const handleAddProduct = (product: Product) => {
    addToCart({ ...product, quantityProduct: 1 });

    // Déclencher le toast
    setToastMessage(`"${product.name}" a été ajouté au panier`);

    // Masquer le toast après 3 secondes
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className={
          userRole === "admin" || userRole === "team"
            ? roleStyles[userRole]?.title
            : "text-3xl font-bold text-gray-900 text-center mb-6"
        }
      >
        Découvrez Nos Produits 🛍️
      </h1>

      {loading && (
        <p className="text-center text-gray-600 animate-pulse">Chargement...</p>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl duration-300 w-64"
              >
                <Link href={`/produits/${product.id}`} className="block">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={256}
                    height={256}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {product.name}
                  </h2>

                  <p className="text-gray-900 font-bold text-lg mt-2">
                    {product.price} €
                  </p>

                  <button
                    onClick={() => handleAddProduct(product)}
                    className="w-full mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 text-sm rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M16 11V9H8V4H6v5H0v2h6v5h2v-5h8z" />
                    </svg>
                    <span>Ajouter au panier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default ListProducts;
