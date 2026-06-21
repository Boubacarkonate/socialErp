import { authentification_data } from '@/hooks/autentification&data';
import { getUserDetails } from '@/services/servicesUsers';
import { FileText, Receipt } from 'lucide-react';
import { productsByUser } from '../actions/order';
import PdfGenerator from './PdfGenerator';

export default async function ResumeBuy() {
  const { userId } = await authentification_data();
  const userData = await getUserDetails(userId);
  const listOrders = await productsByUser(userData?.id);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Receipt size={14} className="text-brand-400" />
        <span className="text-white text-sm font-semibold">Factures</span>
        {listOrders?.length > 0 && (
          <span className="badge-brand ml-auto">{listOrders.length}</span>
        )}
      </div>

      {listOrders?.length > 0 ? (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {listOrders.map((element) => {
            const date = new Date(element.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const time = new Date(element.createdAt).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={element.id}
                className="flex items-center justify-between gap-3 px-3 py-3 bg-surface-900/50 border border-surface-700/50 rounded-xl hover:border-brand-500/30 transition-colors duration-150"
              >
                <div className="w-8 h-8 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={13} className="text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold">{date}</p>
                  <p className="text-surface-500 text-[11px] mt-0.5">{time}</p>
                </div>
                <span className="text-brand-300 font-bold text-sm shrink-0">
                  {element.totalPrice} €
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
          <div className="w-12 h-12 bg-surface-800 rounded-2xl flex items-center justify-center mb-3">
            <Receipt size={20} className="text-surface-600" />
          </div>
          <p className="text-surface-400 text-sm font-medium">Aucune facture</p>
          <p className="text-surface-600 text-xs mt-1">Vos achats apparaîtront ici</p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-surface-700/50">
        <PdfGenerator />
      </div>
    </div>
  );
}
