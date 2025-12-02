import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen  from-background to-secondary/30 flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-5xl font-bold mb-4 from-primary to-accent bg-clip-text ">
          5Point Credit
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          Create and manage customer records with ease
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/create-customer">
            <Button 
              size="lg"
              className="h-12 px-8 text-base font-semibold  hover:opacity-90 transition-all shadow-md hover:shadow-lg"
            >
              Create New Customer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/upload-pdf">
            <Button 
              size="lg" 
              variant="secondary"
              className="h-12 px-8 text-base font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Upload Documents
              <Upload className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
