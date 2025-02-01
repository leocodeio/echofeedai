import { createCookieSessionStorage } from "react-router-dom";
import { User } from "@/types/user";

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production";

// ------------------------------ theme session storage ------------------------------
const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export async function getThemeSession(request: Request) {
  const session = await themeSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return {
    getTheme: () => session.get("theme") || "light",
    setTheme: (theme: string) => session.set("theme", theme),
    commitThemeSession: () => themeSessionStorage.commitSession(session),
  };
}


// ------------------------------ i18n session storage ------------------------------
const i18nSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "i18n",
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
    getLocale: () => session.get("locale") || "en",
    setLocale: (locale: string) => session.set("locale", locale),
    commitI18nSession: () => i18nSessionStorage.commitSession(session),
  };
}

// ------------------------------ auth session storage ------------------------------

const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
  },
});

export async function getAuthSession(request: Request) {
  const session = await authSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return {
    getIsAuthenticated: () => session.get("isAuthenticated") || false,
    setIsAuthenticated: (isAuthenticated: boolean) =>
      session.set("isAuthenticated", isAuthenticated),
    commitAuthSession: () => authSessionStorage.commitSession(session),
  };
}

// ------------------------------ user session storage ------------------------------

const userSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "user",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export async function userSession(request: Request) {
  const session = await userSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return {
    getUserSession: () => session.get("user") || null,
    setUserSession: (user: User) => session.set("user", user),
    clearUserSession: () => userSessionStorage.destroySession(session),
    commitUserSession: () => userSessionStorage.commitSession(session),
  };
}
