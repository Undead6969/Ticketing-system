
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useTickets } from "@/contexts/TicketContext";
import { formatTicketNumber, getStatusColor, getCategoryName } from "@/lib/ticketService";
import { Clock, Search, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const TicketList = () => {
  const { tickets, fetchTickets, loading } = useTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        await fetchTickets();
        setFetchError(false);
      } catch (error) {
        console.error("Error in component when fetching tickets:", error);
        setFetchError(true);
        toast.error("Failed to load tickets. Please try again later.");
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    // Only load tickets on initial mount
    if (isInitialLoad) {
      loadTickets();
    }
    
    // Set up interval to retry on failure, but only if there's an error
    let interval: number | undefined;
    if (fetchError) {
      interval = window.setInterval(() => {
        console.log("Retrying ticket fetch...");
        loadTickets();
      }, 5000); // Retry every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchTickets, fetchError, isInitialLoad]);

  const filteredTickets = tickets.filter(ticket => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      ticket.name.toLowerCase().includes(term) ||
      ticket.email.toLowerCase().includes(term) ||
      ticket.description.toLowerCase().includes(term) ||
      ticket.category.toLowerCase().includes(term) ||
      formatTicketNumber(ticket.ticket_number).includes(term)
    );
  });

  return (
    <Layout>
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">All Support Tickets</h1>
              <Link 
                to="/ticket" 
                className="px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded-md smooth-transition"
              >
                Submit New Ticket
              </Link>
            </div>

            <div className="glass-morphism rounded-xl p-6 animate-fade-in">
              {loading && isInitialLoad ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                  <p>Loading tickets...</p>
                </div>
              ) : fetchError ? (
                <div className="text-center py-8 text-red-400">
                  <AlertTriangle className="mx-auto mb-4" size={32} />
                  <p className="mb-4">Unable to load tickets. There may be an issue with the connection.</p>
                  <button 
                    onClick={() => {
                      setIsInitialLoad(true);
                    }}
                    className="px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded-md smooth-transition"
                  >
                    Retry
                  </button>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No tickets have been submitted yet.</p>
                  <Link 
                    to="/ticket" 
                    className="px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded-md smooth-transition"
                  >
                    Submit Your First Ticket
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="search"
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 py-2 bg-secondary/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary smooth-transition"
                    />
                  </div>
                  
                  <div className="divide-y divide-white/10">
                    {filteredTickets.map((ticket) => (
                      <Link
                        key={ticket.id}
                        to={`/success/${ticket.id}`}
                        className="block p-4 hover:bg-white/5 rounded-md smooth-transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{formatTicketNumber(ticket.ticket_number)}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(ticket.status)}`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                            </div>
                            <h3 className="text-lg font-medium mb-1">{ticket.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{getCategoryName(ticket.category as any)}</p>
                            <p className="text-sm line-clamp-2">{ticket.description}</p>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock size={14} className="mr-1" />
                            <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TicketList;
