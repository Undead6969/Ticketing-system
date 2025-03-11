
import { useState, useEffect } from "react";
import { useTickets } from "@/contexts/TicketContext";
import { formatTicketNumber, getCategoryName, getStatusColor } from "@/lib/ticketService";
import { TicketCard } from "./TicketCard";
import { TicketDetails } from "./TicketDetails";
import { Search, Filter, ArrowDownUp, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { tickets, fetchTickets, setIsAdmin, loading } = useTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  
  useEffect(() => {
    fetchTickets();
  }, []);
  
  // Filter and sort tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      searchTerm === "" ||
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatTicketNumber(ticket.ticket_number).includes(searchTerm);
      
    const matchesStatus = statusFilter === null || ticket.status === statusFilter;
    
    const matchesCategory = categoryFilter === null || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });
  
  // Counts for summary cards
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === "open").length;
  const inProgressTickets = tickets.filter(t => t.status === "in-progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "resolved").length;
  
  const handleLogout = () => {
    setIsAdmin(false);
    navigate("/admin");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1.5 bg-secondary/50 hover:bg-secondary/80 rounded-md text-sm smooth-transition"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-morphism rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Tickets</p>
            <h3 className="text-2xl font-bold">{totalTickets}</h3>
          </div>
          <div className="glass-morphism rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Open</p>
            <h3 className="text-2xl font-bold">{openTickets}</h3>
          </div>
          <div className="glass-morphism rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">In Progress</p>
            <h3 className="text-2xl font-bold">{inProgressTickets}</h3>
          </div>
          <div className="glass-morphism rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Resolved</p>
            <h3 className="text-2xl font-bold">{resolvedTickets}</h3>
          </div>
        </div>
        
        {/* Tickets list */}
        <div className="glass-morphism rounded-xl p-6 lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold">Support Tickets</h2>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-9 py-2 bg-secondary/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary smooth-transition text-sm"
                />
              </div>
              
              <button
                onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
                className="p-2 bg-secondary/50 border border-white/10 rounded-md smooth-transition"
                title={`Sort by ${sortBy === "newest" ? "oldest" : "newest"}`}
              >
                <ArrowDownUp size={16} />
              </button>
              
              <div className="relative">
                <button
                  className="p-2 bg-secondary/50 border border-white/10 rounded-md smooth-transition"
                  title="Filter options"
                >
                  <Filter size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {["open", "in-progress", "resolved", "closed"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                className={`text-xs px-2 py-1 rounded-full smooth-transition ${
                  statusFilter === status
                    ? getStatusColor(status)
                    : "bg-secondary/50 hover:bg-secondary/80"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
            
            {["network", "laptop", "software"].map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(categoryFilter === category ? null : category)}
                className={`text-xs px-2 py-1 rounded-full smooth-transition ${
                  categoryFilter === category
                    ? "bg-primary/80 text-white"
                    : "bg-secondary/50 hover:bg-secondary/80"
                }`}
              >
                {getCategoryName(category as any)}
              </button>
            ))}
            
            {(statusFilter || categoryFilter) && (
              <button
                onClick={() => {
                  setStatusFilter(null);
                  setCategoryFilter(null);
                }}
                className="text-xs px-2 py-1 rounded-full bg-secondary/30 hover:bg-secondary/50 smooth-transition"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                <p>Loading tickets...</p>
              </div>
            ) : sortedTickets.length > 0 ? (
              sortedTickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => setSelectedTicket(ticket)}
                  isSelected={selectedTicket?.id === ticket.id}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tickets found</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Ticket details */}
        <div className="glass-morphism rounded-xl p-6">
          {selectedTicket ? (
            <TicketDetails 
              ticket={selectedTicket} 
              onClose={() => setSelectedTicket(null)} 
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="mb-4 opacity-60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1">No Ticket Selected</h3>
              <p className="text-muted-foreground mb-4">Select a ticket to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
