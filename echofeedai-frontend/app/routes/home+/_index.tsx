import { CommonHero } from "@/components/common/CommonHero";
import { loader as HomeLoader } from "@/routes/loader+/home+/index";

export const loader = HomeLoader;
export default function HomeIndex() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <CommonHero />
    </div>
  );
}
