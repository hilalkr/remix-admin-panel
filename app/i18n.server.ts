import { resolve } from "node:path";
import Backend from "i18next-fs-backend";
import { RemixI18Next } from "remix-i18next/server";

// Define common server-side i18n configuration
let i18next = new RemixI18Next({
  detection: {
    supportedLanguages: ["en", "tr"],
    fallbackLanguage: "en",
  },
  i18next: {
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
  },
  backend: Backend,
});

export default i18next; 