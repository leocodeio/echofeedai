import { LandingHero } from "@/components/landing/LandingHero";
import LandingHeader from "@/components/landing/LandingHeader";

export default function Landing() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LandingHeader />
      <LandingHero/>
    </div>
  );
}
