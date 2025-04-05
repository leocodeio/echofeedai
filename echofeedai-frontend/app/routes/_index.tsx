import type { MetaFunction } from "@remix-run/node";
import LandingHeader from "~/components/landing/LandingHeader";
import { useTranslation } from "react-i18next";

export const meta: MetaFunction = () => {
  return [
    { title: "Spectral-UI" },
    { name: "description", content: "Welcome to Spectral!" },
  ];
};

export default function Index() {
  const { t } = useTranslation();

  return (
    <div className="flex h-screen items-center justify-center">
      <LandingHeader />
      <h1 className="text-4xl font-bold">{t("welcome")}</h1>
    </div>
  );
}
