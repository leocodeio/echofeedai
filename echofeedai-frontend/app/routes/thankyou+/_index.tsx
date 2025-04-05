import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";
import CommonHeader from "@/components/common/CommonHeader";

export default function Thankyou() {
  return (
    <div className="relative flex flex-col w-full h-screen bg-background text-foreground overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundSize: "50px 50px",
          backgroundImage: `
            linear-gradient(to right, rgba(100, 100, 100, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 100, 100, 0.3) 1px, transparent 1px)
          `,
        }}
      ></div>

      <div className="absolute top-0 left-0 right-0 z-20">
        <CommonHeader />
      </div>

      <div className="flex flex-col items-center justify-center flex-grow text-center z-10 pt-16">
        <h1 className="text-6xl font-bold mb-8 max-w-4xl mx-auto">Thank You</h1>
        <h2 className="text-xl mb-10 text-muted-foreground">
          We have received your feedback and will use it to improve our service.
        </h2>
        <Button size="lg" asChild>
          <Link to="/feature/generate">Generate Again</Link>
        </Button>
      </div>
    </div>
  );
}
