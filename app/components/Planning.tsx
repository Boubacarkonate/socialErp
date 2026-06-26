'use client';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { deleteDatePlanning, getAllPlannings } from '../actions/planning';

const BRAND_COLORS = [
  '#6366f1', '#8b5cf6', '#10b981', '#f59e0b',
  '#3b82f6', '#ec4899', '#14b8a6', '#f97316',
];

let colorIndex = 0;
const getNextColor = () => {
  const color = BRAND_COLORS[colorIndex % BRAND_COLORS.length];
  colorIndex++;
  return color;
};

type CalendarEvent = {
  id: number;
  title: string;
  start: string;
  end: string;
  color: string;
};

type SelectedEvent = {
  id: number;
  title: string;
};

export const Planning = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selected, setSelected] = useState<SelectedEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    const data = await getAllPlannings();
    colorIndex = 0;
    setEvents(
      data.map((planning) => ({
        id: planning.id,
        title: planning.title,
        start: new Date(planning.startDate).toISOString().split('T')[0],
        end: new Date(planning.endDate).toISOString().split('T')[0],
        color: getNextColor(),
      }))
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      await deleteDatePlanning(selected.id);
      setEvents((prev) => prev.filter((e) => e.id !== selected.id));
      setSelected(null);
    } catch (err) {
      console.error('Erreur suppression planning', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="planning-wrapper">
      <style>{`
        .planning-wrapper .fc {
          --fc-border-color: rgba(51, 65, 85, 0.5);
          --fc-button-bg-color: #334155;
          --fc-button-border-color: #475569;
          --fc-button-hover-bg-color: #4f46e5;
          --fc-button-hover-border-color: #4338ca;
          --fc-button-active-bg-color: #4f46e5;
          --fc-button-active-border-color: #4338ca;
          --fc-today-bg-color: rgba(99, 102, 241, 0.1);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: #1e293b;
          --fc-list-event-hover-bg-color: rgba(99,102,241,0.1);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8rem;
        }
        .planning-wrapper .fc-toolbar-title {
          color: #f1f5f9;
          font-size: 1rem !important;
          font-weight: 600;
        }
        .planning-wrapper .fc-col-header-cell-cushion,
        .planning-wrapper .fc-daygrid-day-number {
          color: #94a3b8;
          text-decoration: none;
        }
        .planning-wrapper .fc-day-today .fc-daygrid-day-number {
          color: #818cf8;
          font-weight: 700;
        }
        .planning-wrapper .fc-button {
          border-radius: 0.5rem !important;
          font-size: 0.75rem !important;
          font-weight: 500 !important;
          padding: 0.25rem 0.625rem !important;
          color: #e2e8f0 !important;
        }
        .planning-wrapper .fc-button:focus {
          box-shadow: none !important;
        }
        .planning-wrapper .fc-daygrid-day-frame {
          min-height: 60px;
        }
        .planning-wrapper .fc-event {
          border-radius: 4px !important;
          border: none !important;
          font-size: 0.7rem !important;
          font-weight: 500 !important;
          padding: 1px 4px !important;
          cursor: pointer !important;
        }
        .planning-wrapper .fc-scrollgrid {
          border-radius: 0.75rem;
          overflow: hidden;
        }
        .planning-wrapper .fc-theme-standard td,
        .planning-wrapper .fc-theme-standard th,
        .planning-wrapper .fc-theme-standard .fc-scrollgrid {
          border-color: rgba(51, 65, 85, 0.4) !important;
        }
        .planning-wrapper .fc-daygrid-day:hover {
          background: rgba(99,102,241,0.04);
        }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale="fr"
        editable={true}
        selectable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        buttonText={{
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
        }}
        eventClick={(info) => {
          setSelected({
            id: Number(info.event.id),
            title: info.event.title,
          });
        }}
      />

      {/* Modal suppression */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !deleting && setSelected(null)}
          />
          <div className="relative card p-6 w-full max-w-sm animate-fade-in">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-surface-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-base mb-1">Supprimer l&apos;événement</h3>
            <p className="text-surface-400 text-sm mb-1">
              Voulez-vous supprimer cet événement ?
            </p>
            <p className="text-brand-300 text-sm font-semibold mb-5">&ldquo;{selected.title}&rdquo;</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelected(null)}
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
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planning;
