import { Construction } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <Construction className="h-16 w-16 text-muted-foreground mx-auto animate-float" />
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">This arena is under construction. Coming soon!</p>
        <Link to="/">
          <Button variant="outline" className="mt-2">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
