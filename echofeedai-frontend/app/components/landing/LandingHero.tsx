import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { Link } from "@remix-run/react";

export const LandingHero = () => {
  const { t } = useTranslation("common");
  return (
    <section className="container grid  place-items-center py-20 md:py-32 gap-10 w-screen">
      <div className="text-center space-y-6 flex flex-col items-center justify-center w-full">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Catalyst
            </span>{" "}
            + EchoFeedAI
            <br></br>
          </h1>{" "}
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          {t("hero.description")}
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          {/* <Button className="w-full md:w-1/3 mr-4">Get Started</Button> */}
          <Button className="w-full md:w-1/3 mr-4 py-5 px-8 text-center text-black dark:text-white bg-white hover:bg-gray-200 dark:bg-transparent dark:border-gray-700 hover:dark:bg-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg">
            <Link to="/auth/signin">Get Started</Link>
          </Button>

          <a
            rel="noreferrer noopener"
            href="https://github.com/leocodeio/echofeedai"
            target="_blank"
            className={`w-full md:w-1/3 py-5 px-4 text-center  dark:border-gray-700  hover:dark:bg-gray-700 border border border-gray-300 ${buttonVariants(
              {
                variant: "outline",
              }
            )}`}
          >
            Repo
            <GitHubLogoIcon className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      {/* <div className="z-10">
        <HeroCards />
      </div> */}

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
