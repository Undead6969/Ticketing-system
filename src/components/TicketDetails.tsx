
import { useState, useEffect, useRef } from "react";
import { useTickets, Message } from "@/contexts/TicketContext";
import { formatTicketNumber, getCategoryName } from "@/lib/ticketService";
import { X, User, Mail, Calendar, Clock, Save, Send } from "lucide-react";
import { toast } from "sonner";

interface TicketDetailsProps {
  ticket: any;
  onClose: () => void;
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({ ticket, onClose }) => {
  const { updateTicket, deleteTicket, messages, fetchMessages, sendMessage, isAdmin, currentUserEmail, setCurrentUserEmail } = useTickets();
  const [status, setStatus] = useState(ticket.status);
  const [notes, setNotes] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const ticketMessages = messages[ticket.id] || [];
  
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);

  useEffect(() => {
    const fetchMessagesWithDebounce = async () => {
      if (isFetchingMessages) return;
      
      setIsFetchingMessages(true);
      try {
        await fetchMessages(ticket.id);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsFetchingMessages(false);
      }
    };

    const timeoutId = setTimeout(fetchMessagesWithDebounce, 500);
    return () => clearTimeout(timeoutId);
  }, [ticket.id, fetchMessages, isFetchingMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticketMessages]);
  
  const formattedTicketNumber = formatTicketNumber(ticket.ticket_number);
  const createdDate = new Date(ticket.created_at).toLocaleDateString();
  const createdTime = new Date(ticket.created_at).toLocaleTimeString();
  
  const handleStatusChange = (newStatus: "open" | "in-progress" | "resolved" | "closed") => {
    setStatus(newStatus);
  };
  
  const handleSave = async () => {
    setIsUpdating(true);
    try {
      console.log("Updating ticket status to:", status);
      const updates = {
        status,
        updated_at: new Date().toISOString()
      };
      
      await updateTicket(ticket.id, updates);
      
      // Update local state to reflect changes immediately
      setStatus(updates.status);
      console.log("Ticket status updated successfully");
      toast.success("Ticket updated successfully");
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error("Only administrators can delete tickets");
      return;
    }

    if (window.confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      try {
        await deleteTicket(ticket.id);
        toast.success("Ticket deleted successfully");
        onClose();
      } catch (error) {
        console.error("Error deleting ticket:", error);
        toast.error("Failed to delete ticket");
      }
    }
  };

  // Set user email if not admin
  useEffect(() => {
    if (!isAdmin && ticket.email) {
      setCurrentUserEmail(ticket.email);
    }
  }, [ticket.email, isAdmin, setCurrentUserEmail]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;
    
    if (!isAdmin && !currentUserEmail) {
      toast.error("Cannot send message - email not found");
      return;
    }

    setIsSending(true);
    try {
      await sendMessage(ticket.id, newMessage, "admin");
      setNewMessage("");
      toast.success("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Ticket Details</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-secondary/50 smooth-transition"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="mb-4 pb-4 border-b border-white/10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">{formattedTicketNumber}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700">
            {getCategoryName(ticket.category)}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User size={16} className="text-muted-foreground" />
            <span>{ticket.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-muted-foreground" />
            <span>{ticket.email}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-sm">{createdDate}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <span className="text-sm">{createdTime}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Description</h4>
        <div className="bg-secondary/30 rounded-md p-3 mb-4">
          <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
        </div>
        
        <h4 className="text-sm font-medium mb-2">Status</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {["open", "in-progress", "resolved", "closed"].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => handleStatusChange(statusOption as any)}
              className={`text-xs px-3 py-1.5 rounded-md smooth-transition ${
                status === statusOption
                  ? "bg-primary text-white"
                  : "bg-secondary/50 hover:bg-secondary/80"
              }`}
            >
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </button>
          ))}
        </div>
        
        <h4 className="text-sm font-medium mb-2">Admin Notes</h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add private notes about this ticket..."
          className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary smooth-transition text-sm mb-2"
          rows={2}
        />
        <p className="text-xs text-muted-foreground mb-4">
          Notes are for administrative purposes only and not visible to users.
        </p>

        <h4 className="text-sm font-medium mb-2">Support Chat</h4>
        <div className="bg-secondary/30 rounded-md border border-white/10 h-[200px] flex flex-col mb-4">
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {ticketMessages.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">No messages yet</p>
            ) : (
              ticketMessages.map((msg: Message) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-2 ${
                      msg.sender === "admin"
                        ? "bg-primary/30 text-white"
                        : "bg-secondary/70"
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-medium">
                        {msg.sender === "admin" ? "You" : "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-2 border-t border-white/10">
            <div className="flex gap-1">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-2 py-1 text-sm bg-secondary/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary smooth-transition"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending || (!isAdmin && !currentUserEmail)}
                className="px-2 py-1 bg-primary/50 hover:bg-primary/80 text-white rounded-md smooth-transition disabled:opacity-50 min-w-[40px]"
              >
                {isSending ? (
                  <span className="inline-block animate-spin">⌛</span>
                ) : (
                  <Send size={14} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-auto flex justify-between">
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 text-sm bg-destructive/80 hover:bg-destructive text-white rounded-md smooth-transition"
        >
          Delete Ticket
        </button>
        
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="px-3 py-1.5 text-sm bg-primary/80 hover:bg-primary text-white rounded-md flex items-center gap-1 smooth-transition disabled:opacity-50"
        >
          <Save size={16} />
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};
