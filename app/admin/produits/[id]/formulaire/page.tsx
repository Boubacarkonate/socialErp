'use client';

import { deleteProduct, getOneProduct, upsertProduct } from "@/app/actions/products";
import { getAllCategories } from "@/app/actions/categories";
import { ArrowLeft, Check, FolderOpen, ImageIcon, Package, Plus, Tag, Text, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type Category = { id: number; name: string };

type PropsData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  images: string[];
  categoryId: number | null;
};

function FormUpdateProduct({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [data, setData] = useState<PropsData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
    images: [],
    categoryId: null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    getAllCategories().then(setCategories);
    if (id) {
      getOneProduct(parseInt(id, 10)).then(p => {
        if (p) setData({
          name: p.name || "",
          description: p.description || "",
          price: p.price || 0,
          stock: p.stock || 0,
          image: p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
          images: p.images || [],
          categoryId: p.categoryId || null,
        });
      });
    }
  }, [id]);

  const addExtraImage = () => {
    const url = newImageUrl.trim();
    if (url && !data.images.includes(url)) {
      setData({ ...data, images: [...data.images, url] });
      setNewImageUrl("");
    }
  };

  const removeExtraImage = (url: string) =>
    setData({ ...data, images: data.images.filter(u => u !== url) });

  const saveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formulaire = new FormData(e.currentTarget);
      formulaire.set("images", data.images.join('\n'));
      const result = await upsertProduct(formulaire);
      if (result) {
        setAlertMessage("Modifications enregistrées !");
        setTimeout(() => router.back(), 1800);
      }
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteProduct(parseInt(id, 10));
      if (result) {
        setIsModalOpen(false);
        setTimeout(() => router.push("/admin/produits"), 500);
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-surface-500 hover:text-white text-sm font-medium transition-colors duration-150 group mb-5"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
        Retour
      </button>

      <form onSubmit={saveProduct} className="card overflow-hidden">

        {/* Informations produit */}
        <div className="px-5 pt-5 pb-4 border-b border-surface-700/50 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={14} className="text-brand-400" />
            <span className="text-white text-sm font-semibold">Informations produit</span>
          </div>

          {id && <input type="hidden" name="id" value={id} />}

          <div>
            <label className="label-field flex items-center gap-1.5">
              <Tag size={10} /> Nom du produit
            </label>
            <input
              type="text"
              name="name"
              className="input-field"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label-field flex items-center gap-1.5">
              <Text size={10} /> Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="input-field resize-none"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
          </div>

          <div>
            <label className="label-field flex items-center gap-1.5">
              <FolderOpen size={10} /> Catégorie
            </label>
            <select
              name="categoryId"
              className="input-field"
              value={data.categoryId ?? ""}
              onChange={(e) => setData({ ...data, categoryId: e.target.value ? parseInt(e.target.value) : null })}
            >
              <option value="">— Sans catégorie —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Prix & stock */}
        <div className="px-5 py-4 border-b border-surface-700/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-brand-400 text-xs font-bold">€</span>
            <span className="text-white text-sm font-semibold">Prix & stock</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Prix (€)</label>
              <div className="relative">
                <input
                  type="number" name="price" step="0.01" min="0"
                  className="input-field pr-8"
                  value={data.price}
                  onChange={(e) => setData({ ...data, price: parseFloat(e.target.value) })}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 text-sm">€</span>
              </div>
            </div>
            <div>
              <label className="label-field">Stock</label>
              <input
                type="number" name="stock" min="0"
                className="input-field"
                value={data.stock}
                onChange={(e) => setData({ ...data, stock: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="px-5 py-4 border-b border-surface-700/50 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={14} className="text-brand-400" />
            <span className="text-white text-sm font-semibold">Images</span>
          </div>

          {/* Image principale */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface-900/50 border border-surface-700/50 flex items-center justify-center overflow-hidden shrink-0">
              <Image src={data.image} alt="Aperçu" width={64} height={64} className="object-contain" />
            </div>
            <div className="flex-1">
              <label className="label-field">Image principale</label>
              <input
                type="text" name="image" className="input-field" placeholder="https://…"
                value={data.image}
                onChange={(e) => setData({ ...data, image: e.target.value })}
              />
            </div>
          </div>

          {/* Images supplémentaires */}
          <div>
            <label className="label-field">Images supplémentaires</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field flex-1"
                placeholder="https://… (URL image)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExtraImage(); } }}
              />
              <button type="button" onClick={addExtraImage} className="btn-ghost px-3 py-2 shrink-0">
                <Plus size={14} />
              </button>
            </div>
            {data.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.images.map((url, i) => (
                  <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-surface-700/50 group">
                    <Image src={url} alt="" width={56} height={56} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeExtraImage(url)}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 flex items-center justify-between gap-3 bg-surface-900/30">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-150"
          >
            <Trash2 size={13} /> Supprimer
          </button>
          <button type="submit" disabled={saving} className="btn-brand text-sm px-5 py-2 flex items-center gap-2 disabled:opacity-60">
            {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>

      {alertMessage && (
        <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-accent-500/15 border border-accent-500/30 rounded-xl text-accent-400 text-sm font-medium">
          <Check size={14} className="shrink-0" />
          {alertMessage}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative card p-6 w-full max-w-sm">
            <div className="w-11 h-11 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-base mb-1">Supprimer ce produit ?</h3>
            <p className="text-surface-400 text-sm mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost flex-1 text-sm">Annuler</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormUpdateProduct;
