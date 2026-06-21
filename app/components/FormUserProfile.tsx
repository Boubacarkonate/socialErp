'use client'

import { useUser } from "@clerk/nextjs";
import { Check, Lock, Mail, Shield, Trash2, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteUser, getOneUser, upsertUsertDATA } from "../actions/user";

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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const [data, setData] = useState<PropsData>({
    clerkUserId: "",
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    photo: "",
  });

  useEffect(() => {
    if (!user) return;
    getOneUser(user.id)
      .then((userData) => {
        setData({
          clerkUserId: userData.clerkUserId || user.id,
          firstname: userData.firstname || user.firstName || "",
          lastname: userData.lastname || user.lastName || "",
          email: userData.email || user.emailAddresses[0]?.emailAddress || "",
          role: userData.role || "",
          photo: userData.photo || user.imageUrl || "",
        });
      })
      .catch(() => {
        setData({
          clerkUserId: user.id,
          firstname: user.firstName || "",
          lastname: user.lastName || "",
          email: user.emailAddresses[0]?.emailAddress || "",
          role: "",
          photo: user.imageUrl || "",
        });
      });
  }, [user]);

  const envoyer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await upsertUsertDATA(formData);
      setAlertMessage("Profil mis à jour avec succès !");
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!data.clerkUserId) return;
    setDeleting(true);
    try {
      await deleteUser(data.clerkUserId);
      router.push("/");
    } catch (error) {
      console.error("Erreur suppression :", error);
      setDeleting(false);
      setIsModalOpen(false);
    }
  };

  const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const initials = `${data.firstname?.[0] ?? ""}${data.lastname?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="w-full max-w-sm space-y-3">
      <form onSubmit={envoyer} className="card overflow-hidden">

        {/* Avatar banner */}
        <div className="h-14 bg-gradient-to-r from-brand-900/70 via-brand-800/30 to-surface-800 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 15% 50%, #6366f1 0%, transparent 55%)" }} />
        </div>

        <div className="px-5 pb-5">
          {/* Avatar + name */}
          <div className="flex items-end justify-between -mt-7 mb-4">
            <div className="relative">
              {data.photo ? (
                <Image
                  src={data.photo}
                  alt="Avatar"
                  height={56}
                  width={56}
                  className="rounded-xl ring-4 ring-surface-800 object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl ring-4 ring-surface-800 bg-brand-600/30 border border-brand-500/30 flex items-center justify-center">
                  <span className="text-brand-300 font-bold text-base">{initials || <User size={20} />}</span>
                </div>
              )}
            </div>
            {data.role && (
              <span className={roleBadgeStyles[data.role] || roleBadgeStyles.user}>
                {roleLabels[data.role] || data.role}
              </span>
            )}
          </div>

          <p className="text-white font-semibold text-sm mb-4">
            {data.firstname || data.lastname
              ? `${data.firstname} ${data.lastname}`.trim()
              : "—"}
          </p>

          <input type="hidden" name="photo" value={data.photo} onChange={changeValue} />
          <input type="hidden" name="clerUserId" value={data.clerkUserId} onChange={changeValue} />

          {/* Séparateur */}
          <div className="border-t border-surface-700/50 mb-4" />

          {/* Champs */}
          <div className="space-y-4">
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
                <span className="ml-auto flex items-center gap-1 text-surface-600 text-[10px] font-normal">
                  <Lock size={8} /> non modifiable
                </span>
              </label>
              <input
                type="text"
                name="email"
                readOnly
                className="input-field opacity-40 cursor-not-allowed select-none"
                value={data.email}
                onChange={changeValue}
              />
            </div>

            {/* Rôle */}
            <div>
              <label className="label-field flex items-center gap-1.5">
                <Shield size={10} />
                Rôle
              </label>
              {data.role === "admin" ? (
                <select name="role" value={data.role} onChange={changeValue} className="input-field">
                  <option value="admin">Administrateur</option>
                  <option value="team">Équipe</option>
                  <option value="user">Utilisateur</option>
                </select>
              ) : (
                <>
                  <input type="hidden" name="role" value={data.role} />
                  <div className="input-field opacity-40 cursor-not-allowed select-none text-surface-300">
                    {roleLabels[data.role] || "—"}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5 pt-4 border-t border-surface-700/50">
            <button
              type="submit"
              disabled={saving}
              className="btn-brand flex-1 text-sm py-2.5 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement…
                </>
              ) : (
                <>
                  <Check size={13} />
                  Enregistrer
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-danger text-sm py-2.5 px-3 flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              Supprimer
            </button>
          </div>
        </div>
      </form>

      {/* Toast succès */}
      {alertMessage && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-accent-500/15 border border-accent-500/30 rounded-xl text-accent-400 text-sm font-medium animate-fade-in">
          <Check size={14} className="shrink-0" />
          {alertMessage}
        </div>
      )}

      {/* Modal suppression */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !deleting && setIsModalOpen(false)} />
          <div className="relative card p-6 w-full max-w-sm animate-fade-in">
            <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-base mb-1">Supprimer le compte</h3>
            <p className="text-surface-400 text-sm mb-5">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={deleting}
                className="btn-ghost flex-1 text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-150 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Suppression…
                  </>
                ) : (
                  "Confirmer la suppression"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormUserProfile;
