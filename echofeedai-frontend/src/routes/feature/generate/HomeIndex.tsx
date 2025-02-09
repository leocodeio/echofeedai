import { loader as homeLoader } from "@/functions/loader/home/index";
import { action as logoutAction } from "@/functions/action/auth/logout.action";
import { CommonHero } from "@/components/common/CommonHero";

export const loader = homeLoader;
export const action = logoutAction;
export default function HomeIndex() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <CommonHero />
    </div>
  );
}
