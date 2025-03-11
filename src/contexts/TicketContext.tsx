import { useThrottle } from '@/hooks/useThrottle';
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, adminSupabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type TicketCategory = "network" | "laptop" | "software" | string;

export interface Ticket {
  id: string;
  ticket_number: number;
  name: string;
  email: string;
  category: TicketCategory;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed" | string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  ticket_id: string;
  sender: "user" | "admin";
  content: string;
  created_at: string;
}

interface TicketContextType {
  tickets: Ticket[];
  fetchTickets: () => Promise<void>;
  addTicket: (ticket: Omit<Ticket, "id" | "ticket_number" | "created_at" | "updated_at" | "status">) => Promise<Ticket | null>;
  getTicket: (id: string) => Promise<Ticket | null>;
  getTicketByNumber: (ticketNumber: number) => Promise<Ticket | null>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<Ticket>;
  deleteTicket: (id: string) => Promise<void>;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  messages: Record<string, Message[]>;
  fetchMessages: (ticketId: string) => Promise<void>;
  sendMessage: (ticketId: string, content: string, sender: "user" | "admin") => Promise<void>;
  loading: boolean;
  currentUserEmail: string | null;
  setCurrentUserEmail: (email: string | null) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("isAdmin") === "true";
  });
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const fetchTickets = async () => {
    console.log("fetchTickets called from:", new Error().stack);
    if (isFetching) return;
    
    isFetching = true;
    setLoading(true);
    try {
      console.log("Fetching tickets from Supabase");
      console.log("Supabase client:", supabase);
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!data) {
        console.error("No data received from Supabase");
        return;
      }

      console.log("Tickets fetched:", data);
      setTickets(data as Ticket[]);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
      isFetching = false;
    }
  };

  let isFetching = false;

  // Fetch initial tickets
  useEffect(() => {
    console.log("Initial ticket fetch");
    fetchTickets();
  }, []);

  // Save admin status to localStorage
  useEffect(() => {
    localStorage.setItem("isAdmin", isAdmin.toString());
  }, [isAdmin]);

  const addTicket = async (ticketData: Omit<Ticket, "id" | "ticket_number" | "created_at" | "updated_at" | "status">) => {
    setLoading(true);
    // Save user's email for future reference
    setCurrentUserEmail(ticketData.email);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          name: ticketData.name,
          email: ticketData.email,
          category: ticketData.category,
          description: ticketData.description,
          status: 'open'
        }])
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newTicket = data[0] as Ticket;
        setTickets(prev => [newTicket, ...prev]);
        toast.success("Ticket created successfully!");
        return newTicket;
      }
      return null;
    } catch (error) {
      console.error("Error adding ticket:", error);
      toast.error("Failed to create ticket");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTicket = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as Ticket;
    } catch (error) {
      console.error("Error fetching ticket:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTicketByNumber = async (ticketNumber: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('ticket_number', ticketNumber)
        .single();

      if (error) {
        throw error;
      }

      return data as Ticket;
    } catch (error) {
      console.error("Error fetching ticket by number:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    setLoading(true);
    try {
      // Optimize by only updating changed fields
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("No data returned from Supabase update");
      }
      
      // Optimize state update by only updating the changed ticket
      setTickets(prev => prev.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ));
      
      toast.success("Ticket updated successfully!");
      return data;
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (id: string) => {
    setLoading(true);
    try {
      console.log("Starting deletion process for ticket:", id);

      // Check if admin
      if (!isAdmin) {
        throw new Error("Only administrators can delete tickets");
      }

      console.log("Starting delete operation for ticket:", id);

      // Delete messages first using admin client
      const { error: messagesError } = await adminSupabase
        .from('messages')
        .delete()
        .eq('ticket_id', id);

      if (messagesError) {
        console.error("Messages deletion error:", messagesError);
        throw new Error(`Failed to delete messages: ${messagesError.message}`);
      }

      console.log("Messages deleted successfully");

      // Delete ticket using admin client
      console.log("Deleting ticket:", id);
      const { error: ticketError } = await adminSupabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (ticketError) {
        console.error("Ticket deletion error:", ticketError);
        throw new Error(`Failed to delete ticket: ${ticketError.message}`);
      }

      console.log("Ticket deleted successfully");

      // Update local state only after successful deletion
      setTickets(prev => prev.filter(t => t.id !== id));
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[id];
        return newMessages;
      });

      // Update local state
      setTickets(prev => prev.filter(t => t.id !== id));
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[id];
        return newMessages;
      });

      await fetchTickets(); // Refresh tickets to ensure sync
      toast.success("Ticket and messages deleted successfully!");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Failed to delete ticket");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    if (!ticketId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      // Only update if we have new messages
      setMessages(prevMessages => {
        const currentMessages = prevMessages[ticketId] || [];
        if (JSON.stringify(currentMessages) !== JSON.stringify(data)) {
          return {
            ...prevMessages,
            [ticketId]: data as Message[]
          };
        }
        return prevMessages;
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (ticketId: string, content: string, sender: "user" | "admin") => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      // Verify ticket exists and user has access
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();
        
      if (ticketError) {
        throw new Error('Ticket not found');
      }

      // For users, verify they are the ticket owner
      if (sender === 'user') {
        if (!currentUserEmail) {
          throw new Error('Please enter your email before sending a message');
        }
        if (ticket.email !== currentUserEmail) {
          throw new Error('You can only reply to your own tickets');
        }
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          ticket_id: ticketId,
          content,
          sender
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Optimistically update messages
      setMessages(prevMessages => {
        const currentMessages = prevMessages[ticketId] || [];
        return {
          ...prevMessages,
          [ticketId]: [...currentMessages, data as Message]
        };
      });

      // Update ticket's updated_at timestamp
      await supabase
        .from('tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticketId);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      console.log(`Attempting login with username: ${username}`);
      
      if (username === 'admin' && password === 'bootminds2024') {
        setIsAdmin(true);
        toast.success("Welcome, Admin!");
        return true;
      } else {
        toast.error("Invalid credentials");
        return false;
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      toast.error("Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TicketContext.Provider 
      value={{ 
        tickets, 
        fetchTickets,
        addTicket, 
        getTicket,
        getTicketByNumber,
        updateTicket, 
        deleteTicket,
        isAdmin,
        setIsAdmin,
        adminLogin,
        messages,
        fetchMessages,
        sendMessage,
        loading,
        currentUserEmail,
        setCurrentUserEmail
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
