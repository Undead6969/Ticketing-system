
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6 animate-fade-in">
        {children}
      </main>
      
      <footer className="py-6 border-t border-white/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Bootminds Ticketing System
          </div>
          
          <div className="flex items-center space-x-4">
            {!isAdmin && (
              <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                Admin Portal
              </Link>
            )}
            <a href="#" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
