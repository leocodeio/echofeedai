import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const CommonHero = () => {
  const { t } = useTranslation("common");
  return (
    <section className="container grid  place-items-center py-20 md:py-32 gap-10 w-screen">
      <div className="text-center space-y-6 flex flex-col items-center justify-center w-full">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            EchoFeedAI 
            <br></br>
          </h1>{" "}
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
        {t("hero.description")}
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <a
            rel="noreferrer noopener"
            href="https://github.com/leocodeio/echofeedai"
            target="_blank"
            className={`w-full md:w-1/3 py-5 px-4 text-center  dark:border-gray-700  hover:dark:bg-gray-700 border border border-gray-300 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Repo
            <GitHubLogoIcon className="ml-2 w-5 h-5" />
          </a>
          <Button variant="default" className = "w-full md:w-1/3 mr-4 py-5 px-8 text-center">
          <Link to="/feature/generate">Generate</Link>
          </Button>
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
