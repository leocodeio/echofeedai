import CommonHeader from "@/components/common/CommonHeader";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <CommonHeader />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
