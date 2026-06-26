import { getRecentActivity } from '@/app/actions/activityLog';
import { Activity } from 'lucide-react';

const entityColor: Record<string, string> = {
  user:     'text-brand-400 bg-brand-500/10 border-brand-500/20',
  product:  'text-accent-400 bg-accent-500/10 border-accent-500/20',
  planning: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

const entityLabel: Record<string, string> = {
  user:     'Utilisateur',
  product:  'Produit',
  planning: 'Planning',
};

export default async function ActivityLog() {
  const logs = await getRecentActivity(20);

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={13} className="text-brand-400" />
        <span className="text-white text-sm font-semibold">Historique des modifications</span>
        {logs.length > 0 && (
          <span className="badge-brand ml-auto">{logs.length}</span>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Activity size={24} className="text-surface-600 mb-2" />
          <p className="text-surface-400 text-sm">Aucune activité enregistrée</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {logs.map((log) => {
            const colorClass = entityColor[log.entity] ?? 'text-surface-400 bg-surface-700/30 border-surface-600/30';
            const date = new Date(log.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            });
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-surface-900/40 border border-surface-700/40 rounded-xl"
              >
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0 mt-0.5 ${colorClass}`}>
                  {entityLabel[log.entity] ?? log.entity}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium">{log.action}</p>
                  {log.details && (
                    <p className="text-surface-500 text-[11px] mt-0.5 truncate">{log.details}</p>
                  )}
                  <p className="text-surface-600 text-[11px] mt-1">{log.userEmail} · {date}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
