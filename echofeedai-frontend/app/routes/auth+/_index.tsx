import { Link } from "@remix-run/react";
import { Button } from "@/components/ui/button";

export default function AuthIndex() {
  return (
    <div className="flex flex-col space-y-4">
      <Button className="w-full">
        <Link to="/auth/signin">Signin</Link>
      </Button>
      <Button className="w-full">
        <Link to="/auth/signup">Signup</Link>
      </Button>
      <Button variant="outline" className="w-full">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
}
