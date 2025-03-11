
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import { Shield, EyeOff, Eye } from "lucide-react";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, loading } = useTickets();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username) {
      setError("Please enter your username");
      return;
    }
    
    if (!password) {
      setError("Please enter your password");
      return;
    }
    
    const success = await adminLogin(username, password);
    
    if (success) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-morphism rounded-xl p-8 animate-scale-in">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Shield size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
        <p className="text-muted-foreground text-center">
          Enter your credentials to access the admin dashboard
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary smooth-transition"
            placeholder="Enter admin username"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary smooth-transition pr-10"
              placeholder="Enter admin password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={18} className="text-muted-foreground" />
              ) : (
                <Eye size={18} className="text-muted-foreground" />
              )}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary/80 hover:bg-primary text-white rounded-md font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <div className="mt-6 flex justify-center">
        <a
          href="/"
          className="px-4 py-2 text-sm text-muted-foreground hover:text-white smooth-transition"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};
