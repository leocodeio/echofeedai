import { Cookies } from "react-cookie";
import { User } from "@/types/user";

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  path: "/",
  secure: isProduction,
  sameSite: "lax" as const,
  domain: isProduction ? "your-production-domain.com" : undefined,
};

// ------------------------------ theme session ------------------------------
export function getThemeSession() {
  const cookies = new Cookies();
  return {
    getTheme: () => cookies.get("spectral-theme") || "light",
    setTheme: (theme: string) => cookies.set("spectral-theme", theme, cookieOptions),
    removeTheme: () => cookies.remove("spectral-theme", cookieOptions),
  };
}

// ------------------------------ i18n session ------------------------------
export function getI18nSession() {
  const cookies = new Cookies();
  return {
    getLanguage: () => cookies.get("spectral-language") || "en",
    setLanguage: (language: string) => cookies.set("spectral-language", language, cookieOptions),
    removeLanguage: () => cookies.remove("spectral-language", cookieOptions),
  };
}

// ------------------------------ auth session ------------------------------
export function getAuthSession() {
  const cookies = new Cookies();
  return {
    getIsAuthenticated: () => cookies.get("auth") || false,
    setIsAuthenticated: (isAuthenticated: boolean) =>
      cookies.set("auth", isAuthenticated, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    removeAuth: () => cookies.remove("auth", cookieOptions),
  };
}

// ------------------------------ user session ------------------------------
export function getUserSession() {
  const cookies = new Cookies();
  return {
    getUser: () => cookies.get("user") || null,
    setUser: (user: User) =>
      cookies.set("user", user, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      }),
    removeUser: () => cookies.remove("user", cookieOptions),
  };
}
