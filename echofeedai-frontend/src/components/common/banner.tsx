import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { banner } from "@/components/common/utils";

export function Banner() {
  return (
    <div className="flex items-center justify-center my-4">
      <Avatar className="w-48 h-24">
        <AvatarImage src={banner} alt="@spectral" />
        <AvatarFallback>SP</AvatarFallback>
      </Avatar>
    </div>
  );
}
