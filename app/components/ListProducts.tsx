"use client";

import { useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Package, Plus, Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "../actions/products";
import { getOneUser } from "../actions/user";
import { useProductsContext } from "../Context/CartContext";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  userId: string;
}

const PAGE_SIZE = 8;

function ListProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price_asc" | "price_desc" | "stock">("name");
  const [page, setPage] = useState(1);

  const { user } = useUser();
  const { addToCart } = useProductsContext();

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((err) => setError("Impossible de charger les produits. " + err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    getOneUser(user.id)
      .then((data) => { if (data) setUserRole(data.role); })
      .catch(() => {});
  }, [user?.id]);

  // Reset page on search/sort change
  useEffect(() => { setPage(1); }, [search, sortBy]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "stock") list.sort((a, b) => b.stock - a.stock);
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAddProduct = (product: Product) => {
    addToCart({ ...product, quantityProduct: 1 });
    setToastMessage(`"${product.name}" ajouté au panier`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full px-6 py-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-500/15 border border-brand-500/25 rounded-xl flex items-center justify-center">
            <Package size={16} className="text-brand-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">Nos Produits</h1>
            <p className="text-surface-500 text-xs mt-0.5">Catalogue éco-responsable</p>
          </div>
        </div>
        {!loading && <span className="badge-brand">{filtered.length} produit{filtered.length !== 1 ? 's' : ''}</span>}
      </div>

      {/* Search + sort */}
      {!loading && !error && products.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit…"
              className="input-field pl-8 text-sm"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="input-field pl-8 text-sm pr-8 appearance-none"
            >
              <option value="name">Nom (A-Z)</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="stock">Stock</option>
            </select>
          </div>
        </div>
      )}

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

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 bg-surface-800 rounded-2xl flex items-center justify-center mb-4">
            <Package size={24} className="text-surface-500" />
          </div>
          <p className="text-white font-semibold">
            {search ? `Aucun résultat pour "${search}"` : "Aucun produit disponible"}
          </p>
          {search && (
            <button onClick={() => setSearch("")} className="mt-3 text-brand-400 text-sm hover:text-brand-300 transition-colors">
              Effacer la recherche
            </button>
          )}
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && paginated.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginated.map((product) => (
            <div key={product.id} className="card-hover flex flex-col overflow-hidden group animate-fade-in">
              <Link href={`/produits/${product.id}`} className="block relative overflow-hidden bg-surface-900/50 h-44">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-md text-amber-300 text-[10px] font-semibold">
                    Stock bas
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded-md text-red-300 text-[10px] font-semibold">
                    Épuisé
                  </span>
                )}
              </Link>
              <div className="flex flex-col flex-1 p-4 gap-3">
                <div className="flex-1">
                  <Link href={`/produits/${product.id}`}>
                    <h2 className="text-white font-semibold text-sm leading-snug line-clamp-2 hover:text-brand-300 transition-colors">
                      {product.name}
                    </h2>
                  </Link>
                  {product.description && (
                    <p className="text-surface-500 text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-surface-700/50">
                  <span className="text-white font-bold text-base">{product.price} €</span>
                  <button
                    onClick={() => handleAddProduct(product)}
                    disabled={product.stock === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-brand hover:shadow-glow group/btn"
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-400 hover:text-white hover:border-brand-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                p === page
                  ? "bg-brand-600 text-white border border-brand-500"
                  : "bg-surface-800 border border-surface-700 text-surface-400 hover:text-white hover:border-brand-500/40"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-400 hover:text-white hover:border-brand-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Admin link */}
      {userRole === "admin" && !loading && (
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
