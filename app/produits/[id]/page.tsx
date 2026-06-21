"use client";

import { getOneProduct } from "@/app/actions/products";
import Header from "@/app/components/hearder/Header";
import { useProductsContext } from "@/app/Context/CartContext";
import { ButtonBack } from "@/app/ui/Button";
import { getUserDetails } from "@/services/servicesUsers";
import { useUser } from "@clerk/nextjs";
import { Edit, Package, Plus, ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PropsProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

function DetailProduit() {
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string, 10) : null;

  const [productData, setProductData] = useState<PropsProduct | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useProductsContext();
  const { user } = useUser();

  useEffect(() => {
    if (!id || isNaN(id)) return;
    const fetchData = async () => {
      try {
        const [product, fetchedUser] = await Promise.all([
          getOneProduct(id),
          user?.id ? getUserDetails(user.id) : null,
        ]);
        if (product) setProductData(product);
        if (fetchedUser) setUserRole(fetchedUser.role);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user?.id]);

  const handleAddProduct = () => {
    if (!productData) return;
    addToCart({ ...productData, quantityProduct: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-surface-400 text-sm">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={24} className="text-surface-500" />
            </div>
            <p className="text-white font-semibold">Produit introuvable</p>
            <p className="text-surface-400 text-sm mt-1">Ce produit n&apos;existe pas ou a été supprimé.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Back */}
        <div className="mb-6">
          <ButtonBack />
        </div>

        {/* Product card */}
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-surface-700/50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Package size={18} className="text-brand-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white leading-tight">{productData.name}</h1>
                  {userRole === "admin" && (
                    <p className="text-surface-500 text-xs mt-0.5">ID : {productData.id}</p>
                  )}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-brand-300 font-bold text-2xl">
                  {productData.price.toFixed(2)} €
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Description */}
            {productData.description && (
              <div>
                <p className="label-field">Description</p>
                <p className="text-surface-300 text-sm leading-relaxed">{productData.description}</p>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-3 p-3 bg-surface-900/50 border border-surface-700/50 rounded-xl">
              <Tag size={14} className="text-surface-500 shrink-0" />
              <div className="flex items-center justify-between w-full">
                <span className="text-surface-400 text-sm">Stock disponible</span>
                <span className={`font-semibold text-sm ${productData.stock > 0 ? 'text-accent-400' : 'text-red-400'}`}>
                  {productData.stock > 0 ? `${productData.stock} unités` : 'Rupture de stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleAddProduct}
                disabled={productData.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  added
                    ? 'bg-accent-500/20 border border-accent-500/30 text-accent-400'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    Ajouter au panier
                  </>
                )}
              </button>

              {userRole === "admin" && (
                <Link
                  href={`/admin/produits/${productData.id}/formulaire`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-surface-700 hover:bg-surface-600 border border-surface-600 hover:border-surface-500 text-surface-300 hover:text-white rounded-xl font-semibold text-sm transition-all duration-200"
                >
                  <Edit size={14} />
                  Modifier
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Cart hint */}
        <div className="mt-4 flex items-center gap-2 text-surface-500 text-xs justify-center">
          <ShoppingCart size={11} />
          Cliquez sur l&apos;icône panier en haut pour finaliser votre commande
        </div>
      </div>
    </div>
  );
}

export default DetailProduit;
