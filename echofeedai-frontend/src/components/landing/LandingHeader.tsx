import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { NavLinks } from "@/models/navlinks";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function LandingHeader() {
  const { i18n } = useTranslation();
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 fixed top-0 left-0 right-0   ">
      <div className="ml-auto flex gap-2">
        <Select
          onValueChange={handleLanguageChange}
          defaultValue={i18n.language}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" asChild>
          <Link to="/auth/signin">Sign in</Link>
        </Button>
        <Button asChild>
          <Link to="/auth/signup">Sign Up</Link>
        </Button>
      </div>
      <ModeToggle />
    </header>
  );
}
