"use client";

import { useUser } from "@clerk/nextjs";
import { Package, Plus, ShoppingCart } from "lucide-react";
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
        setError("Impossible de charger les produits. Veuillez réessayer. " + err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const fetchRole = async () => {
      try {
        const data = await getOneUser(user.id);
        if (data) setUserRole(data.role);
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle :", error);
      }
    };
    fetchRole();
  }, [user?.id]);

  const handleAddProduct = (product: Product) => {
    addToCart({ ...product, quantityProduct: 1 });
    setToastMessage(`"${product.name}" ajouté au panier`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full px-6 py-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-500/15 border border-brand-500/25 rounded-xl flex items-center justify-center">
            <Package size={16} className="text-brand-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">Nos Produits</h1>
            <p className="text-surface-500 text-xs mt-0.5">Catalogue éco-responsable</p>
          </div>
        </div>
        {products.length > 0 && (
          <span className="badge-brand">{products.length} produits</span>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-surface-400 text-sm">Chargement des produits...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 bg-surface-800 rounded-2xl flex items-center justify-center mb-4">
            <Package size={24} className="text-surface-500" />
          </div>
          <p className="text-white font-semibold">Aucun produit disponible</p>
          <p className="text-surface-400 text-sm mt-1">Les produits apparaîtront ici une fois ajoutés.</p>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="card-hover flex flex-col overflow-hidden group animate-fade-in"
            >
              {/* Image */}
              <Link href={`/produits/${product.id}`} className="block relative overflow-hidden bg-surface-900/50 h-44">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4 gap-3">
                <div className="flex-1">
                  <Link href={`/produits/${product.id}`}>
                    <h2 className="text-white font-semibold text-sm leading-snug line-clamp-2 hover:text-brand-300 transition-colors">
                      {product.name}
                    </h2>
                  </Link>
                  {product.description && (
                    <p className="text-surface-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-700/50">
                  <span className="text-white font-bold text-base">{product.price} €</span>
                  <button
                    onClick={() => handleAddProduct(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-brand hover:shadow-glow group/btn"
                    title="Ajouter au panier"
                  >
                    <Plus size={12} className="group-hover/btn:rotate-90 transition-transform duration-200" />
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin/team: link to edit products if admin */}
      {(userRole === "admin") && !loading && (
        <div className="mt-8 flex justify-center">
          <Link
            href="/admin/produits/formulaire"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-800 hover:bg-surface-700 border border-surface-600 hover:border-brand-500/40 text-surface-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-200"
          >
            <Plus size={14} />
            Ajouter un produit
          </Link>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-surface-800 border border-brand-500/30 rounded-xl shadow-2xl animate-fade-in">
          <div className="w-7 h-7 bg-brand-500/20 rounded-lg flex items-center justify-center shrink-0">
            <ShoppingCart size={13} className="text-brand-400" />
          </div>
          <p className="text-white text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}

export default ListProducts;
