import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { clubs as initialClubs, Club } from '@/data/clubsData';
import { events as initialEvents, Event } from '@/data/eventsData';

interface AppContextType {
  clubs: Club[];
  events: Event[];
  addClub: (club: Club) => void;
  updateClub: (club: Club) => void;
  deleteClub: (clubId: number) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: number) => void;
  registerForEvent: (eventId: number) => void;
  joinClub: (clubId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CLUBS_STORAGE_KEY = 'campus-connect-clubs';

const getNextId = (items: { id: number }[]) => {
  if (items.length === 0) {
    return 1;
  }
  return Math.max(...items.map(item => item.id)) + 1;
};

const getInitialClubs = (): Club[] => {
  if (typeof window === 'undefined') {
    return initialClubs;
  }

  try {
    const savedClubs = window.localStorage.getItem(CLUBS_STORAGE_KEY);
    if (!savedClubs) {
      return initialClubs;
    }

    const parsedClubs = JSON.parse(savedClubs) as Club[];
    return Array.isArray(parsedClubs) ? parsedClubs : initialClubs;
  } catch {
    return initialClubs;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>(getInitialClubs);
  const [events, setEvents] = useState<Event[]>(initialEvents);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(clubs));
    }
  }, [clubs]);

  const addClub = (club: Club) => {
    setClubs(prev => [...prev, { ...club, id: getNextId(prev) }]);
  };

  const updateClub = (updatedClub: Club) => {
    setClubs(prev => prev.map(club => 
      club.id === updatedClub.id
        ? updatedClub
        : club
    ));
  };

  const deleteClub = (clubId: number) => {
    setClubs(prev => prev.filter(club => club.id !== clubId));
  };

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, { ...event, id: getNextId(prev) }]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event =>
      event.id === updatedEvent.id
        ? updatedEvent
        : event
    ));
  };

  const deleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
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
    <AppContext.Provider value={{ clubs, events, addClub, updateClub, deleteClub, addEvent, updateEvent, deleteEvent, registerForEvent, joinClub }}>
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
