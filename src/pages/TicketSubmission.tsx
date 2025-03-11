
import { Layout } from "@/components/Layout";
import { TicketForm } from "@/components/TicketForm";

const TicketSubmission = () => {
  return (
    <Layout>
      <div className="py-12">
        <TicketForm />
      </div>
    </Layout>
  );
};

export default TicketSubmission;
