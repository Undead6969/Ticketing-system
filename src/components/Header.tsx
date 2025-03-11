
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import { LogOut, Ticket } from "lucide-react";

export const Header = () => {
  const location = useLocation();
  const { isAdmin, setIsAdmin } = useTickets();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <header 
      className={`sticky top-0 z-30 w-full ${
        scrolled ? 'glass-morphism' : 'bg-transparent'
      } transition-all duration-300 ease-in-out`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold text-white">
              Bootminds
              <span className="animated-gradient-text"> Ticketing</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {isAdmin ? (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={`text-sm font-medium ${
                    location.pathname.includes('/admin/dashboard') 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-white'
                  } smooth-transition`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-white smooth-transition"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className={`text-sm font-medium ${
                    location.pathname === '/' 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-white'
                  } smooth-transition`}
                >
                  Home
                </Link>
                <Link 
                  to="/ticket" 
                  className={`text-sm font-medium ${
                    location.pathname.includes('/ticket') 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-white'
                  } smooth-transition`}
                >
                  Submit Ticket
                </Link>
                <Link 
                  to="/tickets" 
                  className={`text-sm font-medium ${
                    location.pathname.includes('/tickets') 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-white'
                  } smooth-transition flex items-center gap-1`}
                >
                  <Ticket size={16} />
                  <span>View Tickets</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
