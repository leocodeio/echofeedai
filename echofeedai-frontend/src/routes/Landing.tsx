import { Hero } from "@/components/common/Hero";
import LandingHeader from "@/components/landing/LandingHeader";

export default function Landing() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LandingHeader />
      <Hero/>
    </div>
  );
}
