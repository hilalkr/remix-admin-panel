import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Form } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
  Sun,
  Moon,
  Globe
} from "lucide-react";
import styles from "~/styles/layout.module.scss";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

interface DashboardLayoutProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  children: React.ReactNode;
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Get current theme and sidebar state from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedSidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
    
    setTheme(savedTheme);
    setSidebarCollapsed(savedSidebarState);
    
    // Apply theme on initial load
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  // Function to expand sidebar when logo is clicked
  const expandSidebar = () => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
      localStorage.setItem('sidebarCollapsed', 'false');
    }
  };

  // Function to change language
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.cookie = `i18next=${lang}; path=/`;
    localStorage.setItem('language', lang);
    window.location.reload(); // Zorunlu çünkü Remix loader yeniden çalışmalı
  };
  

  const navigation = [
    {
      name: t("dashboard.overview"),
      href: "/dashboard",
      icon: BarChart3,
      current: location.pathname === "/dashboard",
    },
    {
      name: t("dashboard.users"),
      href: "/dashboard/users",
      icon: Users,
      current: location.pathname.startsWith("/dashboard/users"),
    },
    {
      name: t("dashboard.settings"),
      href: "/dashboard/settings",
      icon: Settings,
      current: location.pathname.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar for desktop */}
      <div
        className={cn(
          styles.sidebar,
          sidebarCollapsed && styles.sidebarCollapsed
        )}
      >
        <div className={styles.sidebarHeader}>
          {/* Logo part - clicking expands the sidebar */}
          <div 
            className={styles.sidebarLogo} 
            onClick={expandSidebar}
            style={{ cursor: 'pointer' }}
          >
            <img
              className={styles.logoImage}
              src="/logo-light.png"
              alt="Logo"
            />
            {!sidebarCollapsed && (
              <span className={styles.logoText}>Admin Panel</span>
            )}
          </div>
          
          {/* Sidebar collapse/expand toggle */}
          <button
            type="button"
            className={styles.sidebarToggle}
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                styles.sidebarLink,
                item.current && styles.sidebarLinkActive
              )}
            >
              <item.icon className={styles.sidebarLinkIcon} />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>          
          {/* Logout button */}
          <Form action="/logout" method="post">
            <button
              type="submit"
              className={cn(styles.sidebarLink, "w-full justify-center")}
            >
              <LogOut className={styles.sidebarLinkIcon} />
              {!sidebarCollapsed && <span>{t("common.logout")}</span>}
            </button>
          </Form>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          styles.mobileSidebar,
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <img
              className={styles.logoImage}
              src="/logo-light.png"
              alt="Logo"
            />
            <span className={styles.logoText}>Admin Panel</span>
          </div>
          <button
            type="button"
            className={styles.sidebarToggle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                styles.sidebarLink,
                item.current && styles.sidebarLinkActive
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className={styles.sidebarLinkIcon} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          {/* Theme toggle in mobile */}
          <button 
            className={cn(styles.sidebarLink, "w-full mb-2")}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className={styles.sidebarLinkIcon} />
            ) : (
              <Moon className={styles.sidebarLinkIcon} />
            )}
            <span>{t("dashboard.themeToggle")}</span>
          </button>
          
          {/* Language toggle in mobile */}
          <div className={cn(styles.sidebarLink, "w-full mb-2")}>
            <Globe className={styles.sidebarLinkIcon} />
            <span>{t("dashboard.languageSelector")}</span>
            
            <div className="ml-auto flex space-x-2">
              <button
                className={cn(
                  "px-2 py-0.5 text-xs rounded",
                  i18n.language === 'en' ? "bg-slate-700" : "hover:bg-slate-600"
                )}
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
              <button
                className={cn(
                  "px-2 py-0.5 text-xs rounded",
                  i18n.language === 'tr' ? "bg-slate-700" : "hover:bg-slate-600"
                )}
                onClick={() => changeLanguage('tr')}
              >
                TR
              </button>
            </div>
          </div>
          
          <Form action="/logout" method="post">
            <button
              type="submit"
              className={cn(styles.sidebarLink, "w-full")}
            >
              <LogOut className={styles.sidebarLinkIcon} />
              <span>{t("common.logout")}</span>
            </button>
          </Form>
        </div>
      </div>

      {/* Main content area */}
      <div className={styles.main}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.mobileMenu}
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className={styles.siteTitle}>
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>

          <div className={styles.headerActions}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={styles.headerAction}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={t(theme === 'light' ? 'common.dark' : 'common.light')}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            
            {/* Language Switcher */}
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className={styles.headerAction}
                  title={t("dashboard.languageSelector")}
                >
                  <Globe className="h-5 w-5" />
                  <span className="ml-1 font-medium text-sm hidden sm:inline-block">
                    {i18n.language === 'en' ? 'EN' : 'TR'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-1">
                <div className="py-1">
                  <button
                    className={cn(
                      "flex w-full items-center px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md",
                      i18n.language === 'en' ? "bg-slate-100 dark:bg-slate-800 font-medium" : ""
                    )}
                    onClick={() => changeLanguage('en')}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    className={cn(
                      "flex w-full items-center px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md",
                      i18n.language === 'tr' ? "bg-slate-100 dark:bg-slate-800 font-medium" : ""
                    )}
                    onClick={() => changeLanguage('tr')}
                  >
                    🇹🇷 Türkçe
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* User profile/account menu */}
            <div className={styles.userMenu}>
              <div className={styles.userButton}>
                <div className={styles.userImage} />
                <span className={styles.userName}>{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
} 