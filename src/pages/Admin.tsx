
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AdminLogin } from "@/components/AdminLogin";
import { useTickets } from "@/contexts/TicketContext";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin } = useTickets();
  
  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, navigate]);

  return (
    <Layout>
      <div className="py-12">
        <AdminLogin />
      </div>
    </Layout>
  );
};

export default Admin;
