import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="text-center space-y-4">
        <Music className="h-10 w-10 mx-auto text-primary" />
        <h1 className="font-display text-6xl font-bold">404</h1>
        <p className="text-lg text-muted-foreground">
          This keerthana doesn't exist in the collection.
        </p>
        <Button asChild className="mt-2">
          <Link to="/">Return to Collection</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
