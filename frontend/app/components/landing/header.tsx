import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "~/components/ui/navigation-menu";
import { ModeToggle } from "../mode-toggle";
import { NavLinks } from "~/models/navlinks";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";

export default function Header() {
  const { i18n } = useTranslation();
  const fetcher = useFetcher();

  const handleLanguageChange = (value: string) => {
    fetcher.submit(
      { locale: value },
      { method: "POST", action: "/action/set-language" }
    );
    i18n.changeLanguage(value);
  };

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 fixed top-0 left-0 right-0   ">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div id="navigation-sheet-description" className="sr-only">
            Navigation menu for mobile devices
          </div>
          <Button variant="link" asChild>
            <Link to="/">
              <ShirtIcon className="h-6 w-6" />
              <span className="sr-only">ShadCN</span>
            </Link>
          </Button>
          <div className="grid gap-2 py-6">
            {NavLinks.map((link, key) => (
              <Button variant="link" asChild key={key}>
                <Link to={link.to}>{link.name}</Link>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Button variant="link" asChild>
        <Link to="/" className="mr-6 hidden lg:flex">
          <ShirtIcon className="h-6 w-6" />
          <span className="sr-only">ShadCN</span>
        </Link>
      </Button>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {NavLinks.map((link, key) => (
            <NavigationMenuLink asChild key={key}>
              <Link
                to={link.to}
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              >
                {link.name}
              </Link>
            </NavigationMenuLink>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
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

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="htto://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function ShirtIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="htto://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  );
}
