import { LandingHero } from "@/components/landing/LandingHero";
import LandingHeader from "@/components/landing/LandingHeader";
import { loader as LandingLoader } from "./loader+/landing.loader";

export const loader = LandingLoader;
export default function Landing() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LandingHeader />
      <LandingHero />
    </div>
  );
}
