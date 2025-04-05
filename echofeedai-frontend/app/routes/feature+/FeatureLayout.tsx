import CommonHeader from "@/components/common/CommonHeader";
import { Outlet } from "@remix-run/react";

export default function FeatureLayout() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <CommonHeader />
      <Outlet />
    </div>
  );
}
