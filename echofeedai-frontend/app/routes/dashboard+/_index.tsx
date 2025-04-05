import { Form, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { loader as dashboardLoader } from "~/routes/loader+/dashboard+/index";
import { action as logoutAction } from "~/routes/action+/auth+/logout";

export const loader = dashboardLoader;
export const action = logoutAction;
export default function Dashboard() {
  let { t } = useTranslation();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-auto max-w-sm text-center">
        <h1>{t("greeting")}</h1>
        <Form method="post">
          <Button type="submit">Logout</Button>
        </Form>
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}
