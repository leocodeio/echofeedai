import { LandingHero } from "@/components/landing/LandingHero";
import LandingHeader from "@/components/landing/LandingHeader";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Spectral-UI" },
    { name: "description", content: "Welcome to Spectral!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LandingHeader />
      <LandingHero />
    </div>
  );
}
