import { createCookie, createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";
import { jwtDecode } from "jwt-decode";

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

export const themeSessionResolver =
  createThemeSessionResolver(themeSessionStorage);

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

// ------------------------------ user session storage ------------------------------

const userSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "user",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    secure: isProduction,
    isSigned: true,
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export async function userSession(request: Request) {
  const session = await userSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return {
    getUser: () => {
      const user = session.get("user");
      console.log("debug log 1 - userSession.ts", user);
      if (user) {
        const accessToken = user.accessToken;
        console.log("debug log 2 - userSession.ts", accessToken);
        const refreshToken = user.refreshToken;
        console.log("debug log 3 - userSession.ts", refreshToken);
        const { role } = jwtDecode(accessToken) as any;
        console.log("debug log 4 - userSession.ts", role);
        return { accessToken, refreshToken, role };
      }
      return null;
    },
    getRole: () => {
      const user = session.get("user");
      if (user) {
        const { role } = jwtDecode(user.accessToken) as {
          role: string;
          any: any;
        };
        console.log("debug log 4 - userSession.ts", role);
        return role;
      }
      return null;
    },

    getIsRole: (roles: string[]): boolean => {
      const user = session.get("user");
      if (user) {
        const { role } = jwtDecode(user.accessToken) as {
          role: string;
          any: any;
        };
        console.log("debug log 4 - userSession.ts", role);
        if (roles.length === 0) {
          return true;
        }
        if (roles.includes(role)) {
          return true;
        }
        return false;
      }
      return false;
    },
    isAuthenticated: () => (session.get("user") ? true : false),
    getUserSession: () => session.get("user") || null,
    setUser: (accessToken: string, refreshToken: string) => {
      session.set("user", { accessToken, refreshToken });
      session.set("accessToken", accessToken);
      session.set("refreshToken", refreshToken);
    },
    getAcessAndRefreshToken: () => {
      return {
        accessToken: session.get("accessToken")?.split("=")[1],
        refreshToken: session.get("refreshToken")?.split("=")[1],
      };
    },
    removeUser: () => userSessionStorage.destroySession(session),
    commitSession: () => userSessionStorage.commitSession(session),
  };
}
