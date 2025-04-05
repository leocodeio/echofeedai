import { Outlet } from "@remix-run/react";
import { Banner } from "@/components/common/banner";

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Banner />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
