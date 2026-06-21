import Planning from "@/app/components/Planning";
import { Calendar } from "lucide-react";

function PagePlanning() {
  return (
    <div className="p-6 h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-500/15 border border-brand-500/25 rounded-xl flex items-center justify-center">
          <Calendar size={16} className="text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-none">Planning</h1>
          <p className="text-surface-500 text-xs mt-0.5">Consultez les événements et tâches planifiées</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="card p-4 flex-1 overflow-auto max-h-[75vh]">
        <Planning />
      </div>
    </div>
  );
}

export default PagePlanning;
