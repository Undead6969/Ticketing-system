
import { Layout } from "@/components/Layout";
import { TicketConfirmation } from "@/components/TicketConfirmation";

const TicketSuccess = () => {
  return (
    <Layout>
      <div className="py-12">
        <TicketConfirmation />
      </div>
    </Layout>
  );
};

export default TicketSuccess;
