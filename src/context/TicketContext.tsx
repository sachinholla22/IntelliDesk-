import React, { createContext, useContext, useState } from 'react';
import { Ticket, Priority, Status } from '../types';

interface TicketFilters {
  priority?: Priority;
  status?: Status;
  search?: string;
}

interface TicketContextType {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  filters: TicketFilters;
  setFilters: (filters: TicketFilters) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  refreshTickets: () => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filters, setFilters] = useState<TicketFilters>({});
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshTickets = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        setTickets,
        filters,
        setFilters,
        loading,
        setLoading,
        refreshTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};