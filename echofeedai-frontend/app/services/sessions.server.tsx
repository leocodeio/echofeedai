import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";
import { User } from "@/types/user";

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production";

// ------------------------------ theme session ------------------------------
const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "spectral-theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export const themeSessionResolver =
  createThemeSessionResolver(themeSessionStorage);

// ------------------------------ i18n session ------------------------------
const i18nSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "spectral-language",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export async function getI18nSession(request: Request) {
  const session = await i18nSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return {
    getLanguage: () => session.get("language") || "en",
    setLanguage: (language: string) => session.set("language", language),
    commitI18nSession: () => i18nSessionStorage.commitSession(session),
  };
}

// ------------------------------ user session ------------------------------
const userSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "user",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    maxAge: 60 * 60 * 24 * 30, // 30 days
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export async function getUserSession(request: Request) {
  const session = await userSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return {
    getUser: () => session.get("user") || null,
    getRole: () => session.get("role") || null,
    getIsRole: (roles: string[]): boolean => {
      const userRole = session.get("role");
      if (roles.length === 0) return true;
      return roles.includes(userRole);
    },
    getIsAuthenticated: () => session.get("isAuthenticated") || false,
    setUser: (user: User) => {
      session.set("user", user);
      session.set("isAuthenticated", true);
    },
    commitUserSession: () => userSessionStorage.commitSession(session),
    destroyUserSession: () => userSessionStorage.destroySession(session),
  };
}
