import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";  // Only use HTTP backend on client

// Pre-define commonly used translation resources
// This helps avoid the "users.title" appearing instead of actual text
const commonTranslations = {
  en: {
    common: {
      dashboard: {
        welcome: "Welcome to Admin Panel",
        overview: "Overview",
        users: "Users",
        reports: "Reports",
        settings: "Settings",
        totalUsers: "Total Users",
        activeSessions: "Active Sessions",
        revenue: "Revenue",
        recentActivity: "Recent Activity",
        recentLogins: "Recent Logins",
        userDistribution: "User Distribution",
        monthlySessions: "Monthly Sessions",
        themeToggle: "Toggle Theme",
        languageSelector: "Language",
        loginSuccess: "Success",
        loginFailed: "Failed"
      },
      users: {
        title: "Users Management",
        addUser: "Add User",
        editUser: "Edit User",
        deleteUser: "Delete User",
        name: "Name",
        email: "Email",
        role: "Role",
        status: "Status",
        dateAdded: "Date Added",
        actions: "Actions",
        admin: "Administrator",
        user: "User",
        editor: "Editor",
        active: "Active",
        inactive: "Inactive",
        all: "All",
        confirmDelete: "Are you sure you want to delete this user?",
        userDeleted: "User deleted successfully",
        userUpdated: "User updated successfully",
        filterByRole: "Filter by Role",
        filterByStatus: "Filter by Status",
        noUsersFound: "No users found",
        noUsersMatchFilter: "No users match your filter criteria",
        pagination: {
          showing: "Showing",
          of: "of",
          entries: "entries",
          next: "Next",
          previous: "Previous"
        }
      },
      common: {
        logout: "Logout",
        light: "Light",
        dark: "Dark",
        system: "System",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        search: "Search"
      }
    }
  },
  tr: {
    common: {
      dashboard: {
        welcome: "Admin Paneline Hoş Geldiniz",
        overview: "Genel Bakış",
        users: "Kullanıcılar",
        reports: "Raporlar",
        settings: "Ayarlar",
        totalUsers: "Toplam Kullanıcı",
        activeSessions: "Aktif Oturumlar",
        revenue: "Gelir",
        recentActivity: "Son Etkinlikler",
        recentLogins: "Son Girişler",
        userDistribution: "Kullanıcı Dağılımı",
        monthlySessions: "Aylık Oturumlar",
        themeToggle: "Tema Değiştir",
        languageSelector: "Dil",
        loginSuccess: "Başarılı",
        loginFailed: "Başarısız"
      },
      users: {
        title: "Kullanıcı Yönetimi",
        addUser: "Kullanıcı Ekle",
        editUser: "Kullanıcı Düzenle",
        deleteUser: "Kullanıcı Sil",
        name: "Ad",
        email: "E-posta",
        role: "Rol",
        status: "Durum",
        dateAdded: "Eklenme Tarihi",
        actions: "İşlemler",
        admin: "Yönetici",
        user: "Kullanıcı",
        editor: "Editör",
        active: "Aktif",
        inactive: "Pasif",
        all: "Tümü",
        confirmDelete: "Bu kullanıcıyı silmek istediğinizden emin misiniz?",
        userDeleted: "Kullanıcı başarıyla silindi",
        userUpdated: "Kullanıcı başarıyla güncellendi",
        filterByRole: "Role Göre Filtrele",
        filterByStatus: "Duruma Göre Filtrele",
        noUsersFound: "Kullanıcı bulunamadı",
        noUsersMatchFilter: "Filtre kriterlerinize uygun kullanıcı bulunamadı",
        pagination: {
          showing: "Gösteriliyor",
          of: "/",
          entries: "kayıt",
          next: "Sonraki",
          previous: "Önceki"
        }
      },
      common: {
        logout: "Çıkış Yap",
        light: "Açık",
        dark: "Koyu",
        system: "Sistem",
        cancel: "İptal",
        save: "Kaydet",
        delete: "Sil",
        edit: "Düzenle",
        search: "Ara"
      }
    }
  }
};

// Not used directly in entry.client.tsx anymore, but kept for reference
// and potentially used by other components that import this file directly
const i18n = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "tr"],
    ns: ["common"],
    defaultNS: "common",
    resources: commonTranslations, // Use preloaded translations for quicker startup
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // URL path, not filesystem path
    },
    detection: {
      order: ["localStorage", "cookie", "htmlTag", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false,
    },
    load: 'languageOnly', // Simplify language codes (e.g., 'en-US' -> 'en')
    returnNull: false,    // Return empty string instead of null for missing translations
    returnEmptyString: false, // Return key instead of empty string
    saveMissing: false,   // Don't save missing translations
    debug: false
  });

export default i18next; 