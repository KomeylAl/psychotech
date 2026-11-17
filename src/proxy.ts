import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@/lib/auth-constants";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { detectLocaleFromAcceptLanguage, localeCookieName } from "@/lib/i18n/url";

const PUBLIC_FILE = /\.(?:ico|png|jpg|jpeg|gif|webp|avif|svg|txt|xml|json|webmanifest|css|js|map|woff2?|ttf|otf|mp4|webm)$/i;

const METADATA_PATHS = new Set([
  "/opengraph-image",
  "/twitter-image",
  "/icon",
  "/apple-icon",
  "/manifest.webmanifest",
  "/robots.txt",
  "/sitemap.xml",
]);

function applyLocale(request: NextRequest, locale: Locale) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(localeCookieName)?.value;
  if (isLocale(cookie)) return cookie;
  return detectLocaleFromAcceptLanguage(request.headers.get("accept-language"));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/uploads")) {
    return NextResponse.next();
  }

  if (pathname === "/" || pathname === "") {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(localeCookieName, url.pathname.slice(1), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  if (PUBLIC_FILE.test(pathname) || METADATA_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return applyLocale(request, "fa");
    }

    if (request.headers.has("next-action")) {
      return applyLocale(request, "fa");
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return redirectToLogin(request);
    }

    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 16) {
      return redirectToLogin(request);
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      return applyLocale(request, "fa");
    } catch {
      const response = redirectToLogin(request);
      response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });
      return response;
    }
  }

  const firstSegment = pathname.split("/")[1];
  if (isLocale(firstSegment)) {
    return applyLocale(request, firstSegment);
  }

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
