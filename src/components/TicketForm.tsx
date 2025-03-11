
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets, TicketCategory } from "@/contexts/TicketContext";
import { validateEmail, validateName, validateDescription } from "@/lib/ticketService";
import { Laptop, Wifi, Code } from "lucide-react";
import { toast } from "sonner";

export const TicketForm = () => {
  const navigate = useNavigate();
  const { addTicket, loading } = useTickets();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<TicketCategory | "">("");
  const [description, setDescription] = useState("");
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    category: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      name: !validateName(name) ? "Please enter a valid name (min 2 characters)" : "",
      email: !validateEmail(email) ? "Please enter a valid email address" : "",
      category: !category ? "Please select an issue category" : "",
      description: !validateDescription(description) ? "Description must be at least 10 characters" : ""
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    // Add ticket
    const newTicket = await addTicket({
      name,
      email,
      category: category as TicketCategory,
      description
    });
    
    if (newTicket) {
      // Navigate to success page with the new ticket
      navigate(`/success/${newTicket.id}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-morphism rounded-xl p-6 animate-scale-in">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit Support Ticket</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary smooth-transition"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary smooth-transition"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2">
            Issue Category
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setCategory("network")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                category === "network" 
                  ? "border-primary bg-primary/20" 
                  : "border-white/10 bg-secondary/50 hover:bg-secondary"
              } smooth-transition`}
            >
              <Wifi size={24} className={category === "network" ? "text-primary" : "text-white"} />
              <span className="mt-2 text-sm font-medium">Network Issue</span>
            </button>
            
            <button
              type="button"
              onClick={() => setCategory("laptop")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                category === "laptop" 
                  ? "border-primary bg-primary/20" 
                  : "border-white/10 bg-secondary/50 hover:bg-secondary"
              } smooth-transition`}
            >
              <Laptop size={24} className={category === "laptop" ? "text-primary" : "text-white"} />
              <span className="mt-2 text-sm font-medium">Hardware Issue</span>
            </button>
            
            <button
              type="button"
              onClick={() => setCategory("software")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                category === "software" 
                  ? "border-primary bg-primary/20" 
                  : "border-white/10 bg-secondary/50 hover:bg-secondary"
              } smooth-transition`}
            >
              <Code size={24} className={category === "software" ? "text-primary" : "text-white"} />
              <span className="mt-2 text-sm font-medium">Software Issue</span>
            </button>
          </div>
          {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Describe Your Issue
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary smooth-transition"
            placeholder="Please describe your issue in detail..."
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary/80 hover:bg-primary text-white rounded-md font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
};
