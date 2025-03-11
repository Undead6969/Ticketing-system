
import { Ticket } from "@/contexts/TicketContext";
import { formatTicketNumber, getCategoryIcon, getStatusColor } from "@/lib/ticketService";
import { Calendar, Laptop, Wifi, Code } from "lucide-react";

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
  isSelected: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick, isSelected }) => {
  const formattedTicketNumber = formatTicketNumber(ticket.ticket_number);
  const date = new Date(ticket.created_at).toLocaleDateString();
  
  const getIcon = () => {
    switch (ticket.category) {
      case "network":
        return <Wifi size={16} />;
      case "laptop":
        return <Laptop size={16} />;
      case "software":
        return <Code size={16} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? "border-primary/50 bg-primary/10" 
          : "border-white/5 bg-white/5 hover:bg-white/10"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium">{formattedTicketNumber}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(ticket.status)}`}>
          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
        </span>
      </div>
      
      <h3 className="font-medium text-base mb-1 truncate">{ticket.name}</h3>
      <p className="text-muted-foreground text-sm mb-2 truncate">{ticket.email}</p>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {getIcon()}
          <span>
            {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};
