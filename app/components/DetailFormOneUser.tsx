'use client';

import { getOneUser, upsertUsertDATA } from "@/app/actions/user";
import { ButtonActionFunction } from "@/app/ui/Button";
import { Check, Mail, ShieldCheck, Trash2, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type PropsData = {
  clerkUserId: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  photo: string;
};

type Props = {
  params: { id: string };
};

const roleOptions = [
  { value: "admin", label: "Administrateur", desc: "Accès complet à la plateforme" },
  { value: "team",  label: "Équipe",          desc: "Accès aux produits et au planning" },
  { value: "user",  label: "Utilisateur",     desc: "Accès boutique uniquement" },
];

const roleDot: Record<string, string> = {
  admin: "bg-brand-400",
  team:  "bg-accent-400",
  user:  "bg-surface-400",
};

const DetailFormOneUser = ({ params }: Props) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { id } = params;

  const [data, setData] = useState<PropsData>({
    clerkUserId: '',
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    photo: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const userData = await getOneUser(id);
        setData({
          clerkUserId: userData.clerkUserId || '',
          firstname: userData?.firstname || '',
          lastname: userData?.lastname || '',
          email: userData?.email || '',
          role: userData?.role || '',
          photo: userData?.photo || '',
        });
      }
    };
    fetchData();
  }, [id]);

  const envoyer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await upsertUsertDATA(formData);
      setAlertMessage("Modifications enregistrées");
      if (result) setTimeout(() => router.back(), 1800);
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setSaving(false);
    }
  };

  const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={envoyer} className="card overflow-hidden">

        {/* ── Section : Informations personnelles */}
        <div className="px-5 pt-5 pb-4 border-b border-surface-700/50">
          <div className="flex items-center gap-2 mb-4">
            <UserPen size={14} className="text-brand-400" />
            <span className="text-white text-sm font-semibold">Informations personnelles</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Nom</label>
              <input
                type="text"
                name="lastname"
                className="input-field"
                placeholder="Nom"
                value={data.lastname}
                onChange={changeValue}
              />
            </div>
            <div>
              <label className="label-field">Prénom</label>
              <input
                type="text"
                name="firstname"
                className="input-field"
                placeholder="Prénom"
                value={data.firstname}
                onChange={changeValue}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="label-field flex items-center gap-1.5">
              <Mail size={10} />
              Adresse email
            </label>
            <div className="relative">
              <input
                type="text"
                name="email"
                readOnly
                className="input-field pr-24 opacity-60 cursor-not-allowed"
                value={data.email}
                onChange={changeValue}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-surface-500 bg-surface-700 px-2 py-0.5 rounded-md border border-surface-600">
                non modifiable
              </span>
            </div>
          </div>
        </div>

        {/* ── Section : Accès & rôle */}
        <div className="px-5 py-4 border-b border-surface-700/50">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={14} className="text-brand-400" />
            <span className="text-white text-sm font-semibold">Accès & rôle</span>
          </div>

          <div className="space-y-2">
            {roleOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                  data.role === opt.value
                    ? "bg-brand-500/10 border-brand-500/40"
                    : "bg-surface-900/40 border-surface-700/50 hover:border-surface-600"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={opt.value}
                  checked={data.role === opt.value}
                  onChange={changeValue}
                  className="sr-only"
                />
                {/* Dot indicator */}
                <span className={`w-2 h-2 rounded-full shrink-0 ${data.role === opt.value ? roleDot[opt.value] : "bg-surface-600"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-none ${data.role === opt.value ? "text-white" : "text-surface-400"}`}>
                    {opt.label}
                  </p>
                  <p className="text-surface-500 text-xs mt-0.5">{opt.desc}</p>
                </div>
                {data.role === opt.value && (
                  <Check size={14} className="text-brand-400 shrink-0" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Hidden fields */}
        <input type="hidden" name="photo" value={data.photo} onChange={changeValue} />
        <input type="hidden" name="clerUserId" value={data.clerkUserId} onChange={changeValue} />

        {/* ── Actions */}
        <div className="px-5 py-4 flex items-center justify-between gap-3 bg-surface-900/30">
          <ButtonActionFunction
            label="Supprimer le compte"
            className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-150"
            onClick={() => setIsModalOpen(true)}
          />
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
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>

      {/* Success toast */}
      {alertMessage && (
        <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-accent-500/15 border border-accent-500/30 rounded-xl text-accent-400 text-sm font-medium animate-fade-in">
          <Check size={14} className="shrink-0" />
          {alertMessage}
        </div>
      )}

      {/* Delete modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative card p-6 w-full max-w-sm animate-fade-in">
            <div className="w-11 h-11 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-base mb-1">Supprimer ce compte ?</h3>
            <p className="text-surface-400 text-sm mb-6">Cette action est irréversible. Toutes les données associées seront perdues.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost flex-1 text-sm">
                Annuler
              </button>
              <button
                onClick={() => { alert("Supprimé !"); setIsModalOpen(false); }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-150"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailFormOneUser;
