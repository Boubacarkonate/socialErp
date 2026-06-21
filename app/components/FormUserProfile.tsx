'use client'

import { useUser } from "@clerk/nextjs";
import { Camera, Mail, Shield, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getOneUser, upsertUsertDATA } from "../actions/user";
import { ButtonActionFunction } from "../ui/Button";

type PropsData = {
  clerkUserId?: string;
  lastname: string;
  firstname: string;
  email: string;
  role: string;
  photo: string;
};

const roleBadgeStyles: Record<string, string> = {
  admin: "badge bg-brand-500/20 text-brand-300 border border-brand-500/30",
  team:  "badge bg-accent-500/20 text-accent-400 border border-accent-500/30",
  user:  "badge bg-surface-600/30 text-surface-300 border border-surface-500/30",
};

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  team:  "Équipe",
  user:  "Utilisateur",
};

const FormUserProfile = () => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();

  const [data, setData] = useState<PropsData>({
    clerkUserId: "",
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    photo: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const userData = await getOneUser(user.id);
          setData({
            clerkUserId: userData.clerkUserId || user.id,
            firstname: userData.firstname || user.firstName || "",
            lastname: userData?.lastname || user.lastName || "",
            email: userData?.email || user.emailAddresses[0]?.emailAddress || "",
            role: userData?.role || "",
            photo: userData?.photo || user.imageUrl || "",
          });
        } catch {
          setData({
            clerkUserId: user.id,
            firstname: user.firstName || "",
            lastname: user.lastName || "",
            email: user.emailAddresses[0]?.emailAddress || "",
            role: "",
            photo: user.imageUrl,
          });
        }
      }
    };
    fetchData();
  }, [user]);

  const envoyer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await upsertUsertDATA(formData);
      setAlertMessage("Profil mis à jour avec succès !");
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={envoyer} className="card p-6 space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 pb-4 border-b border-surface-700/50">
          <div className="relative">
            {data.photo ? (
              <Image
                src={data.photo}
                alt="Avatar"
                height={80}
                width={80}
                className="rounded-full ring-2 ring-brand-500/40 ring-offset-2 ring-offset-surface-800"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-surface-700 flex items-center justify-center ring-2 ring-surface-600">
                <User size={32} className="text-surface-500" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-surface-700 border border-surface-600 rounded-full flex items-center justify-center">
              <Camera size={10} className="text-surface-400" />
            </div>
          </div>
          <input type="hidden" name="photo" value={data.photo} onChange={changeValue} />

          <div className="text-center">
            <p className="text-white font-semibold text-sm">{data.firstname} {data.lastname}</p>
            {data.role && (
              <span className={`${roleBadgeStyles[data.role] || roleBadgeStyles.user} mt-1 inline-block`}>
                {roleLabels[data.role] || data.role}
              </span>
            )}
          </div>
        </div>

        <input type="hidden" name="clerUserId" value={data.clerkUserId} onChange={changeValue} />

        {/* Nom / Prénom */}
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

        {/* Email */}
        <div>
          <label className="label-field flex items-center gap-1.5">
            <Mail size={10} />
            Email
          </label>
          <input
            type="text"
            name="email"
            readOnly
            className="input-field opacity-50 cursor-not-allowed"
            value={data.email}
            onChange={changeValue}
          />
        </div>

        {/* Rôle */}
        {data.role === "admin" ? (
          <div>
            <label className="label-field flex items-center gap-1.5">
              <Shield size={10} />
              Rôle
            </label>
            <select name="role" value={data.role} onChange={changeValue} className="input-field">
              <option value="admin">Administrateur</option>
              <option value="team">Équipe</option>
              <option value="user">Utilisateur</option>
            </select>
          </div>
        ) : (
          <input type="hidden" name="role" value={data.role} />
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button type="submit" className="btn-brand flex-1 text-sm py-2.5">
            Enregistrer
          </button>
          <ButtonActionFunction
            label="Supprimer"
            className="btn-danger text-sm py-2.5 px-4"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </form>

      {/* Success toast */}
      {alertMessage && (
        <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-accent-500/15 border border-accent-500/30 rounded-xl text-accent-400 text-sm font-medium animate-fade-in">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {alertMessage}
        </div>
      )}

      {/* Delete modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative card p-6 w-full max-w-sm animate-fade-in">
            <h3 className="text-white font-bold text-base mb-2">Confirmer la suppression</h3>
            <p className="text-surface-400 text-sm mb-6">Cette action est irréversible. Voulez-vous vraiment supprimer ce profil ?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-ghost flex-1 text-sm"
              >
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

export default FormUserProfile;
