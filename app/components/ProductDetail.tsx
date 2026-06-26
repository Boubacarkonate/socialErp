'use client';

import { getOneProduct, getSimilarProducts } from "@/app/actions/products";
import { useProductsContext } from "@/app/Context/CartContext";
import { ChevronLeft, ChevronRight, FolderOpen, Package, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  images: string[];
  price: number;
  stock: number;
  userId: number | null;
  categoryId: number | null;
  category: { id: number; name: string } | null;
};

export default function ProductDetail({ id }: { id: number }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const { addToCart } = useProductsContext();

  useEffect(() => {
    getOneProduct(id).then(async (p) => {
      if (!p) { setLoading(false); return; }
      setProduct(p as Product);
      if (p.categoryId) {
        const sim = await getSimilarProducts(p.categoryId, p.id);
        setSimilar(sim as Product[]);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <Package size={40} className="text-surface-600 mb-4" />
        <p className="text-white font-bold text-lg">Produit introuvable</p>
        <Link href="/produits" className="mt-4 text-brand-400 text-sm hover:text-brand-300">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const allImages = [product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80", ...product.images].filter(Boolean) as string[];
  const currentImage = allImages[carouselIndex] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80";

  const handleAddToCart = (p: Product) => {
    addToCart({ ...p, image: p.image ?? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80", quantityProduct: 1 });
    setToast(`"${p.name}" ajouté au panier`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-surface-500 mb-6">
        <Link href="/produits" className="hover:text-white transition-colors">Catalogue</Link>
        <ChevronRight size={12} />
        {product.category && (
          <>
            <span className="hover:text-white transition-colors cursor-pointer">{product.category.name}</span>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-surface-300 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Carousel */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-surface-900/50 border border-surface-700/50 rounded-2xl overflow-hidden">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain p-8 transition-all duration-300"
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setCarouselIndex(i => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCarouselIndex(i => (i + 1) % allImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === carouselIndex ? 'bg-brand-400 w-4' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`relative w-16 h-16 shrink-0 rounded-xl border-2 overflow-hidden transition-all ${
                    i === carouselIndex ? 'border-brand-500' : 'border-surface-700/50 hover:border-surface-600'
                  }`}
                >
                  <Image src={url} alt="" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          {product.category && (
            <div className="flex items-center gap-1.5">
              <FolderOpen size={13} className="text-brand-400" />
              <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">{product.category.name}</span>
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">{product.name}</h1>
            {product.description && (
              <p className="text-surface-400 text-sm mt-3 leading-relaxed">{product.description}</p>
            )}
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">{product.price} €</span>
            {product.stock > 0 ? (
              <span className="text-accent-400 text-sm font-medium mb-1">{product.stock} en stock</span>
            ) : (
              <span className="text-red-400 text-sm font-medium mb-1">Épuisé</span>
            )}
          </div>

          {product.stock <= 5 && product.stock > 0 && (
            <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-xs font-medium">
              Plus que {product.stock} en stock — commandez vite !
            </div>
          )}

          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.stock === 0}
            className="btn-brand flex items-center justify-center gap-2 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            {product.stock === 0 ? "Indisponible" : "Ajouter au panier"}
          </button>

          <div className="pt-4 border-t border-surface-700/50 space-y-2 text-xs text-surface-500">
            <p>Livraison éco-responsable • Produit certifié</p>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="text-lg font-semibold text-white mb-5">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {similar.map(p => (
              <div key={p.id} className="card-hover flex flex-col overflow-hidden group">
                <Link href={`/produits/${p.id}`} className="block relative h-36 bg-surface-900/50 overflow-hidden">
                  <Image
                    src={p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80"}
                    alt={p.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="flex flex-col flex-1 p-3 gap-2">
                  <Link href={`/produits/${p.id}`}>
                    <h3 className="text-white font-semibold text-sm line-clamp-2 hover:text-brand-300 transition-colors">
                      {p.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-surface-700/50">
                    <span className="text-white font-bold text-sm">{p.price} €</span>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition-all"
                    >
                      <Plus size={11} />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-surface-800 border border-brand-500/30 rounded-xl shadow-2xl">
          <div className="w-7 h-7 bg-brand-500/20 rounded-lg flex items-center justify-center shrink-0">
            <ShoppingCart size={13} className="text-brand-400" />
          </div>
          <p className="text-white text-sm font-medium">{toast}</p>
        </div>
      )}
    </div>
  );
}
