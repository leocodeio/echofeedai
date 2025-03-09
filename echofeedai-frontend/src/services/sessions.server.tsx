import { Cookies } from "react-cookie";
import { User } from "@/types/user";
import { jwtDecode } from "jwt-decode";

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
    setTheme: (theme: string) =>
      cookies.set("spectral-theme", theme, cookieOptions),
    removeTheme: () => cookies.remove("spectral-theme", cookieOptions),
  };
}

// ------------------------------ i18n session ------------------------------
export function getI18nSession() {
  const cookies = new Cookies();
  return {
    getLanguage: () => cookies.get("spectral-language") || "en",
    setLanguage: (language: string) =>
      cookies.set("spectral-language", language, cookieOptions),
    removeLanguage: () => cookies.remove("spectral-language", cookieOptions),
  };
}

// ------------------------------ user session ------------------------------
export function getUserSession() {
  const cookies = new Cookies();
  return {
    getUser: () => cookies.get("user") || null,
    getRole: () => {
      const accessToken = cookies.get("access-token");
      const { role } = jwtDecode(accessToken) as { role: string; any: any };
      return role;
    },
    getIsRole: (roles: string[]): boolean => {
      const session = getUserSession();
      const userRole = session.getRole();
      if (roles.length === 0) {
        return true;
      }
      if (roles.includes(userRole)) {
        return true;
      }
      return false;
    },
    getIsAuthenticated: () => {
      const session = getUserSession();
      const user = session.getUser();
      const accessToken = cookies.get("access-token");
      const refreshToken = cookies.get("refresh-token");
      // not only check existance but also validate token
      // make a call to validate the token to backend
      // if access token is valid, return true
      // if access token is invalid, check if refresh token is valid
      // if refresh token is valid, make a call to refresh the token
      // if refresh token is invalid, return false
      // if  returned false logout, destroy the token
      return (
        user !== null && accessToken !== undefined && refreshToken !== undefined
      );
    },
    setUser: (user: User) =>
      cookies.set("user", user, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      }),
    removeUser: () => cookies.remove("user", cookieOptions),
  };
}
