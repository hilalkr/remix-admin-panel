import { useTranslation } from "react-i18next";
import { useLayoutEffect } from "react";

/**
 * A hook that loads translations for the specified namespaces
 * using useLayoutEffect to avoid flicker
 */
export function useTranslationLoader(namespaces: string[] = ["common"]) {
  const { i18n } = useTranslation();

  useLayoutEffect(() => {
    const loadTranslations = async () => {
      if (i18n.isInitialized) {
        // Reload resources for the current language
        await i18n.reloadResources(i18n.language, namespaces);
      }
    };

    loadTranslations();
  }, [i18n, namespaces]);

  return { i18n };
}
