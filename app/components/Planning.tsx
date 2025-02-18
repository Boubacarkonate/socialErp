'use client';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useState } from 'react';
import { getAllPlannings } from '../actions/planning';

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const Planning = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
      const data = await getAllPlannings();
      const formattedData = data.map(planning => ({
        id: planning.id,
        title: planning.title,
        start: new Date(planning.startDate).toISOString().split('T')[0],
        end: new Date(planning.endDate).toISOString().split('T')[0],
        color: generateRandomColor(), // Attribution de couleur aléatoire ou basée sur un critère
      }));
      setEvents(formattedData);
    };

    fetchData();
  }, []);

  const handleClick = () => { 
    
  }

  return (
<div>      
  {/* <h1 className="text-2xl font-bold mb-4">Planning de l'Équipe</h1> */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventBackgroundColor='#0111'
        locale='fr'
        editable={true}
        selectable={true}
        eventClick={handleClick}  
      />
    </div>
  );
}

export default Planning;
