import React, { createContext, useContext, useState, ReactNode } from 'react';
import { clubs as initialClubs, Club } from '@/data/clubsData';
import { events as initialEvents, Event } from '@/data/eventsData';

interface AppContextType {
  clubs: Club[];
  events: Event[];
  addClub: (club: Club) => void;
  addEvent: (event: Event) => void;
  registerForEvent: (eventId: number) => void;
  joinClub: (clubId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addClub = (club: Club) => {
    setClubs(prev => [...prev, { ...club, id: prev.length + 1 }]);
  };

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, { ...event, id: prev.length + 1 }]);
  };

  const registerForEvent = (eventId: number) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId && event.currentParticipants < event.maxParticipants
        ? { ...event, currentParticipants: event.currentParticipants + 1 }
        : event
    ));
  };

  const joinClub = (clubId: number) => {
    setClubs(prev => prev.map(club => 
      club.id === clubId
        ? { ...club, members: club.members + 1 }
        : club
    ));
  };

  return (
    <AppContext.Provider value={{ clubs, events, addClub, addEvent, registerForEvent, joinClub }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
