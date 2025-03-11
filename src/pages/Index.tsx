
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Ticket, MessageSquare, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block p-3 rounded-full bg-primary/20 mb-6 animate-fade-in">
            <Ticket className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Welcome to Bootminds 
            <span className="animated-gradient-text"> Ticketing System</span>
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto animate-slide-up">
            Submit support tickets for hardware, software, or network issues and track your request status with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-slide-up">
            <Link
              to="/ticket"
              className="px-5 py-3 bg-primary/80 hover:bg-primary text-white rounded-md font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Submit a Ticket
            </Link>
            
            <a
              href="#how-it-works"
              className="px-5 py-3 bg-secondary/50 hover:bg-secondary/80 text-white rounded-md font-medium transition-all duration-200"
            >
              How It Works
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto animate-fade-in">
          <div className="glass-morphism rounded-xl p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Ticket className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Submit a Ticket</h3>
            <p className="text-muted-foreground">
              Fill out a simple form with your contact details and issue description.
            </p>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Get Support</h3>
            <p className="text-muted-foreground">
              Our support team will review your ticket and reach out to assist you.
            </p>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Resolution</h3>
            <p className="text-muted-foreground">
              Track your ticket status and receive updates until your issue is resolved.
            </p>
          </div>
        </div>
        
        <div id="how-it-works" className="w-full max-w-5xl mx-auto mt-20 pt-10 animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="p-1 bg-primary/5 rounded-lg">
                  <div className="glass-morphism rounded-lg p-6 h-full">
                    <h3 className="text-xl font-semibold mb-4">1. Submit Your Issue</h3>
                    <p className="text-muted-foreground mb-4">
                      Click on "Submit a Ticket" and fill out the form with your contact information and a description of the issue you're experiencing.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-primary mt-0.5" />
                        <span>Provide your name and email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-primary mt-0.5" />
                        <span>Select the category that best matches your issue</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-primary mt-0.5" />
                        <span>Describe your problem in detail</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">1</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center md:order-1">
                <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">2</span>
                </div>
              </div>
              <div className="md:order-2">
                <div className="p-1 bg-primary/5 rounded-lg">
                  <div className="glass-morphism rounded-lg p-6 h-full">
                    <h3 className="text-xl font-semibold mb-4">2. Receive Confirmation</h3>
                    <p className="text-muted-foreground mb-4">
                      After submission, you'll receive a unique ticket number. Keep this number for reference when following up on your issue.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-primary mt-0.5" />
                        <span>Get a unique ticket ID for tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-primary mt-0.5" />
                        <span>Receive a confirmation email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-primary mt-0.5" />
                        <span>Your ticket enters our support queue</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="p-1 bg-primary/5 rounded-lg">
                  <div className="glass-morphism rounded-lg p-6 h-full">
                    <h3 className="text-xl font-semibold mb-4">3. Issue Resolution</h3>
                    <p className="text-muted-foreground mb-4">
                      Our support team will work on your issue and keep you updated on progress until it's resolved.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-primary mt-0.5" />
                        <span>Support team reviews your ticket</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-primary mt-0.5" />
                        <span>Receive progress updates via email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-primary mt-0.5" />
                        <span>Get confirmation when your issue is resolved</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-3xl mx-auto mt-20 glass-morphism rounded-xl p-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Help?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is ready to assist you with any technical issues.
          </p>
          <Link
            to="/ticket"
            className="px-5 py-3 bg-primary/80 hover:bg-primary text-white rounded-md font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Submit a Ticket Now
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
