'use client';

import { createProduct } from "@/app/actions/products";
import { Check, ImageIcon, Package, Tag, Text } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

function CreateProduct() {
  const [image, setImage] = useState<string>("/produit.png");
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const router = useRouter();

  const saveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formulaire = new FormData(e.currentTarget);
      const result = await createProduct(formulaire);
      if (result) {
        setAlertMessage("Produit créé avec succès !");
        setTimeout(() => router.back(), 1800);
      }
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={saveProduct} className="card overflow-hidden">

        {/* ── Section : Informations produit */}
        <div className="px-5 pt-5 pb-4 border-b border-surface-700/50 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={14} className="text-brand-400" />
            <span className="text-white text-sm font-semibold">Informations produit</span>
          </div>

          <input type="hidden" name="id" />

          <div>
            <label className="label-field flex items-center gap-1.5">
              <Tag size={10} />
              Nom du produit
            </label>
            <input
              type="text"
              name="name"
              className="input-field"
              placeholder="Ex : Sac en coton bio"
              required
            />
          </div>

          <div>
            <label className="label-field flex items-center gap-1.5">
              <Text size={10} />
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="input-field resize-none"
              placeholder="Décrivez le produit en quelques mots…"
            />
          </div>
        </div>

        {/* ── Section : Prix & stock */}
        <div className="px-5 py-4 border-b border-surface-700/50 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-brand-400 text-xs font-bold">€</span>
            <span className="text-white text-sm font-semibold">Prix & stock</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Prix (€)</label>
              <div className="relative">
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  className="input-field pr-8"
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 text-sm">€</span>
              </div>
            </div>
            <div>
              <label className="label-field">Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* ── Section : Image */}
        <div className="px-5 py-4 border-b border-surface-700/50 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={14} className="text-brand-400" />
            <span className="text-white text-sm font-semibold">Image</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface-900/50 border border-surface-700/50 flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src={image}
                alt="Aperçu"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <label className="label-field">URL de l&apos;image</label>
              <input
                type="text"
                name="image"
                className="input-field"
                placeholder="https://…"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Actions */}
        <div className="px-5 py-4 flex items-center justify-end gap-3 bg-surface-900/30">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost text-sm px-4 py-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-brand text-sm px-5 py-2 flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check size={14} />
            )}
            {saving ? "Création…" : "Créer le produit"}
          </button>
        </div>
      </form>

      {alertMessage && (
        <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-accent-500/15 border border-accent-500/30 rounded-xl text-accent-400 text-sm font-medium animate-fade-in">
          <Check size={14} className="shrink-0" />
          {alertMessage}
        </div>
      )}
    </div>
  );
}

export default CreateProduct;
