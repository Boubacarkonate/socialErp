'use client';

import { addPlanning } from "@/app/actions/planning";
import { getOneUser } from "@/app/actions/user";
import { useUser } from "@clerk/nextjs";
import { CalendarPlus, Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface UserPropsId {
  id: number;
  firstname?: string;
  lastname?: string;
}

export const CreatePlanning = () => {
  const [dataUser, setDataUser] = useState<UserPropsId | null>(null);
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const userData = await getOneUser(user.id);
        setDataUser(userData);
      } catch (error) {
        console.error("Erreur récupération utilisateur :", error);
      }
    };
    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formulaire = new FormData(e.currentTarget);
      await addPlanning(formulaire);
      setAlertMessage("Événement ajouté avec succès !");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="card overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-surface-700/50">
          <div className="flex items-center gap-2">
            <CalendarPlus size={14} className="text-brand-400" />
            <span className="text-white text-sm font-semibold">Nouvel événement</span>
          </div>
        </div>

        {/* Fields */}
        <div className="px-5 py-4 space-y-4 border-b border-surface-700/50">

          <div>
            <label className="label-field">Nom de la tâche</label>
            <input
              type="text"
              name="title"
              className="input-field"
              placeholder="Ex : Réunion équipe"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field flex items-center gap-1.5">
                <Clock size={10} />
                Début
              </label>
              <input
                type="date"
                name="startDate"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-field flex items-center gap-1.5">
                <Clock size={10} />
                Fin
              </label>
              <input
                type="date"
                name="endDate"
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="label-field">Membre de l&apos;équipe</label>
            <select name="userId" className="input-field" required>
              <option value="">— Sélectionner —</option>
              {dataUser && (
                <option value={dataUser.id}>
                  {dataUser.firstname} {dataUser.lastname}
                </option>
              )}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 bg-surface-900/30 flex justify-end">
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
            {saving ? "Enregistrement…" : "Ajouter"}
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
};

export default CreatePlanning;
