import { Outlet } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import styles from "~/styles/dashboard.module.scss";

/**
 * The Settings layout component that wraps all settings routes.
 * This component provides the layout for displaying application settings.
 */
export default function SettingsLayout() {
  const { t } = useTranslation("common");

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>{t("settings.title")}</h1>
        <p className={styles.sectionDescription}>{t("settings.description")}</p>
      </div>

      <div className={styles.sectionContent}>
        <Outlet />
      </div>
    </div>
  );
}
