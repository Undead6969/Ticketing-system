
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AdminDashboard } from "@/components/AdminDashboard";
import { useTickets } from "@/contexts/TicketContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useTickets();
  
  useEffect(() => {
    // If not logged in, redirect to admin login
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="py-6">
        <AdminDashboard />
      </div>
    </Layout>
  );
};

export default Dashboard;
