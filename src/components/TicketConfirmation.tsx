
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import { formatTicketNumber, getCategoryName, getStatusColor } from "@/lib/ticketService";
import { CheckCircle, Copy, Send, User, Clock } from "lucide-react";
import { toast } from "sonner";

export const TicketConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const { getTicket, messages, fetchMessages, sendMessage, loading } = useTickets();
  const [ticket, setTicket] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadTicket = async () => {
      if (id) {
        const ticketData = await getTicket(id);
        setTicket(ticketData);
        
        if (ticketData) {
          fetchMessages(ticketData.id);
        }
      }
    };
    
    loadTicket();
  }, [id, getTicket, fetchMessages]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center p-8 glass-morphism rounded-xl">
        {loading ? (
          <>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <p>Loading ticket details...</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Ticket Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The ticket you're looking for doesn't exist or may have been deleted.
            </p>
            <Link
              to="/tickets"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 smooth-transition"
            >
              View All Tickets
            </Link>
          </>
        )}
      </div>
    );
  }
  
  const formattedTicketNumber = formatTicketNumber(ticket.ticket_number);
  const ticketMessages = messages[ticket.id] || [];
  
  const copyTicketNumber = () => {
    navigator.clipboard.writeText(formattedTicketNumber);
    setCopied(true);
    toast.success("Ticket number copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    await sendMessage(ticket.id, newMessage, "user");
    setNewMessage("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-morphism rounded-xl p-6 md:p-8 animate-scale-in">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Support Ticket</h2>
              <div 
                className="flex items-center gap-1 cursor-pointer" 
                onClick={copyTicketNumber}
                title="Click to copy ticket number"
              >
                <span className="text-sm text-muted-foreground">{formattedTicketNumber}</span>
                {copied ? (
                  <CheckCircle size={14} className="text-primary" />
                ) : (
                  <Copy size={14} className="text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
          
          <div className={`inline-block px-2 py-1 text-xs rounded-full mb-4 ${getStatusColor(ticket.status)}`}>
            Status: {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link
            to="/tickets"
            className="px-3 py-1.5 bg-secondary/50 hover:bg-secondary/80 rounded-md text-sm smooth-transition"
          >
            View All Tickets
          </Link>
          <Link
            to="/ticket"
            className="px-3 py-1.5 bg-primary/80 hover:bg-primary text-white rounded-md text-sm smooth-transition"
          >
            New Ticket
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <div className="bg-secondary/30 rounded-lg p-4 border border-white/5">
            <h3 className="font-semibold mb-4">Ticket Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{ticket.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{ticket.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{getCategoryName(ticket.category as any)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-secondary/30 rounded-lg border border-white/5 flex flex-col h-[400px]">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold">Support Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {ticketMessages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No messages yet. Start the conversation by sending a message.
                  </p>
                </div>
              ) : (
                ticketMessages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "user"
                          ? "bg-primary/50 text-white"
                          : "bg-secondary/70 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {msg.sender === "admin" ? (
                          <span className="text-xs font-medium">Support Team</span>
                        ) : (
                          <span className="text-xs font-medium">You</span>
                        )}
                        <Clock size={10} className="ml-1" />
                        <span className="text-xs opacity-70">
                          {new Date(msg.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-secondary/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary smooth-transition"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || loading}
                  className="px-3 py-2 bg-primary/80 hover:bg-primary text-white rounded-md smooth-transition disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
