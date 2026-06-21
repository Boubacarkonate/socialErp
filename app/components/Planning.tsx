'use client';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useState } from 'react';
import { getAllPlannings } from '../actions/planning';

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

export const Planning = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPlannings();
      colorIndex = 0;
      const formattedData = data.map((planning) => ({
        id: planning.id,
        title: planning.title,
        start: new Date(planning.startDate).toISOString().split('T')[0],
        end: new Date(planning.endDate).toISOString().split('T')[0],
        color: getNextColor(),
      }));
      setEvents(formattedData);
    };
    fetchData();
  }, []);

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
      />
    </div>
  );
};

export default Planning;
