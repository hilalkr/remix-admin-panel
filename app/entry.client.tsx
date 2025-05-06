/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Initialize i18n with all namespaces before React hydration
i18next
  .use(initReactI18next) // React için i18next kullanımı
  .use(LanguageDetector) // Tarayıcı dil tespiti
  .use(Backend) // HTTP backend (dosya sistemine değil HTTP isteklerine dayanır)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "tr"],
    ns: ["common"],
    defaultNS: "common",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json" // Dikkat: sunucu yolu değil URL yolu
    },
    detection: {
      order: ["localStorage", "cookie", "htmlTag", "navigator"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    }
  });

// Apply theme from localStorage on client side
function applyThemeFromStorage() {
  const storedTheme = localStorage.getItem('theme');
  
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Apply theme and hydrate app
startTransition(() => {
  // Apply theme before hydration
  applyThemeFromStorage();
  
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
