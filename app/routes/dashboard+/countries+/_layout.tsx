import { Outlet } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import styles from "~/styles/dashboard.module.scss";

/**
 * The Countries layout component that wraps all countries routes.
 * This component provides the layout for displaying countries management pages.
 */
export default function CountriesLayout() {
  const { t } = useTranslation("common");

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>{t("countries.title")}</h1>
        <p className={styles.sectionDescription}>
          {t("countries.description")}
        </p>
      </div>

      <div className={styles.sectionContent}>
        <Outlet />
      </div>
    </div>
  );
}
