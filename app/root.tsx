import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18next from "./i18n.server";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  // Get locale from server
  let locale = "en";
  try {
    locale = await i18next.getLocale(request);
  } catch (error) {
    console.error("Error getting locale in root loader:", error);
  }
  return json({ locale });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { locale } = useLoaderData<{locale: string}>();
  const { i18n } = useTranslation();
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  // Initialize i18n on client side
  useEffect(() => {
    const initializeI18n = async () => {
      try {
        // Check for stored language preference
        const storedLanguage = localStorage.getItem('language');
        const languageToUse = storedLanguage || locale;
        
        // Change language if it's not already the current language
        if (i18n.language !== languageToUse) {
          await i18n.changeLanguage(languageToUse);
        }
        
        // Save language preference
        localStorage.setItem('language', i18n.language);
        
        // Mark as initialized
        setIsI18nInitialized(true);
      } catch (error) {
        console.error("Error initializing i18n:", error);
        setIsI18nInitialized(true); // Continue anyway
      }
    };
    
    initializeI18n();
  }, [locale, i18n]);

  return <Outlet />;
}
