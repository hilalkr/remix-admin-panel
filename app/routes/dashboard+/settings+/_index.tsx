import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useState, useEffect } from "react";
import {
  Palette,
  Globe,
  User,
  Bell,
  Shield,
  Sun,
  Moon,
  Computer,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/components/ui/use-toast";

import styles from "~/styles/settings.module.scss";

// Define schema for profile form
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
});

// Define schema for password form
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

// Need to refine the password schema with a custom validator
const refinedPasswordSchema = passwordSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

type FormState = {
  formType: "profile" | "password" | "theme" | "notifications" | "language";
  success?: boolean;
  error?: string;
  fieldErrors?: {
    [key: string]: {
      _errors: string[];
    };
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formType = formData.get("formType") as string;

  // Handle profile update
  if (formType === "profile") {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const result = profileSchema.safeParse({ name, email });

    if (!result.success) {
      return json({
        formType,
        success: false,
        fieldErrors: result.error.format(),
      });
    }

    // In a real app, save profile info to the database
    // For now, we'll just simulate a successful update
    return json({
      formType,
      success: true,
    });
  }

  // Handle password update
  if (formType === "password") {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const result = refinedPasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      return json({
        formType,
        success: false,
        fieldErrors: result.error.format(),
      });
    }

    // In a real app, update password in database
    // For now, we'll just simulate a successful update
    return json({
      formType,
      success: true,
    });
  }

  // Handle theme, notifications, or language updates
  return json({
    formType,
    success: true,
  });
};

export default function SettingsPage() {
  const { t, i18n } = useTranslation("common");
  const actionData = useActionData<FormState>();
  const submit = useSubmit();
  const { toast } = useToast();

  // Local state for form values
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [language, setLanguage] = useState(i18n.language);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // On mount, get theme setting from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    setTheme(savedTheme || "system");

    // Simulate fetching user profile from API
    setProfile({
      name: "John Doe",
      email: "john.doe@example.com",
    });
  }, []);

  // Show toast when action succeeds
  useEffect(() => {
    if (actionData?.success) {
      toast({
        title: t("common.success"),
        description: t("settings.settingsSaved"),
      });
    }
  }, [actionData, t, toast]);

  // Handle theme change
  const handleThemeChange = (value: "light" | "dark" | "system") => {
    setTheme(value);

    // Apply theme immediately
    if (value === "system") {
      // Check system preference
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", systemPrefersDark);
      localStorage.removeItem("theme");
    } else {
      document.documentElement.classList.toggle("dark", value === "dark");
      localStorage.setItem("theme", value);
    }

    // Submit form to persist settings
    const formData = new FormData();
    formData.append("formType", "theme");
    formData.append("theme", value);
    submit(formData, { method: "post" });
  };

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    document.cookie = `i18next=${value}; path=/`;
    localStorage.setItem("language", value);

    // Submit form to persist settings
    const formData = new FormData();
    formData.append("formType", "language");
    formData.append("language", value);
    submit(formData, { method: "post" });
  };

  // Handle notification change
  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications((prev) => {
      const newState = { ...prev, [type]: !prev[type] };

      // Submit form to persist settings
      const formData = new FormData();
      formData.append("formType", "notifications");
      Object.entries(newState).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      submit(formData, { method: "post" });

      return newState;
    });
  };

  // Handle profile form changes
  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Handle password form changes
  const handlePasswordChange = (
    field: keyof typeof passwordForm,
    value: string
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Tabs defaultValue="appearance" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="appearance">
          <Palette className="mr-2 h-4 w-4" />
          {t("settings.appearance.title")}
        </TabsTrigger>
        <TabsTrigger value="language">
          <Globe className="mr-2 h-4 w-4" />
          {t("settings.language.title")}
        </TabsTrigger>
        <TabsTrigger value="account">
          <User className="mr-2 h-4 w-4" />
          {t("settings.account.title")}
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="mr-2 h-4 w-4" />
          {t("settings.notifications.title")}
        </TabsTrigger>
        <TabsTrigger value="security">
          <Shield className="mr-2 h-4 w-4" />
          {t("settings.security.title")}
        </TabsTrigger>
      </TabsList>

      {/* Appearance Settings */}
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.appearance.title")}</CardTitle>
            <CardDescription>
              {t("settings.appearance.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className={styles.settingsForm}>
              <input type="hidden" name="formType" value="theme" />
              <div className={styles.formGroup}>
                <Label htmlFor="theme">{t("settings.appearance.theme")}</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {t("settings.appearance.themeDescription")}
                </p>
                <RadioGroup
                  value={theme}
                  onValueChange={(value: string) =>
                    handleThemeChange(value as "light" | "dark" | "system")
                  }
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center">
                      <Sun className="mr-2 h-4 w-4" />
                      {t("settings.appearance.light")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center">
                      <Moon className="mr-2 h-4 w-4" />
                      {t("settings.appearance.dark")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center">
                      <Computer className="mr-2 h-4 w-4" />
                      {t("settings.appearance.system")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Language Settings */}
      <TabsContent value="language">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.language.title")}</CardTitle>
            <CardDescription>
              {t("settings.language.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className={styles.settingsForm}>
              <input type="hidden" name="formType" value="language" />
              <div className={styles.formGroup}>
                <Label htmlFor="language">
                  {t("settings.language.selectLanguage")}
                </Label>
                <Select
                  value={language}
                  onValueChange={handleLanguageChange}
                  name="language"
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("settings.language.selectLanguage")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">
                      {t("settings.language.english")}
                    </SelectItem>
                    <SelectItem value="tr">
                      {t("settings.language.turkish")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.account.title")}</CardTitle>
            <CardDescription>
              {t("settings.account.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className={styles.settingsForm}>
              <input type="hidden" name="formType" value="profile" />
              <div className={styles.formGroup}>
                <Label htmlFor="name">{t("settings.account.name")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                />
                {actionData?.formType === "profile" &&
                  actionData?.fieldErrors?.name && (
                    <p className={styles.error}>
                      {actionData.fieldErrors.name._errors[0]}
                    </p>
                  )}
              </div>
              <div className={styles.formGroup}>
                <Label htmlFor="email">{t("settings.account.email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                />
                {actionData?.formType === "profile" &&
                  actionData?.fieldErrors?.email && (
                    <p className={styles.error}>
                      {actionData.fieldErrors.email._errors[0]}
                    </p>
                  )}
              </div>
              <div className={styles.formActions}>
                <Button type="submit">
                  {t("settings.account.updateProfile")}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications Settings */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.notifications.title")}</CardTitle>
            <CardDescription>
              {t("settings.notifications.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className={styles.settingsForm}>
              <input type="hidden" name="formType" value="notifications" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>
                      {t("settings.notifications.emailNotifications")}
                    </Label>
                  </div>
                  <Switch
                    name="email"
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationChange("email")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>
                      {t("settings.notifications.pushNotifications")}
                    </Label>
                  </div>
                  <Switch
                    name="push"
                    checked={notifications.push}
                    onCheckedChange={() => handleNotificationChange("push")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>
                      {t("settings.notifications.smsNotifications")}
                    </Label>
                  </div>
                  <Switch
                    name="sms"
                    checked={notifications.sms}
                    onCheckedChange={() => handleNotificationChange("sms")}
                  />
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.security.title")}</CardTitle>
            <CardDescription>
              {t("settings.security.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Change Password Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {t("settings.security.changePassword")}
                </h3>
                <Form method="post" className={styles.settingsForm}>
                  <input type="hidden" name="formType" value="password" />
                  <div className={styles.formGroup}>
                    <Label htmlFor="currentPassword">
                      {t("settings.security.currentPassword")}
                    </Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                    />
                    {actionData?.formType === "password" &&
                      actionData?.fieldErrors?.currentPassword && (
                        <p className={styles.error}>
                          {actionData.fieldErrors.currentPassword._errors[0]}
                        </p>
                      )}
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="newPassword">
                      {t("settings.security.newPassword")}
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                    />
                    {actionData?.formType === "password" &&
                      actionData?.fieldErrors?.newPassword && (
                        <p className={styles.error}>
                          {actionData.fieldErrors.newPassword._errors[0]}
                        </p>
                      )}
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="confirmPassword">
                      {t("settings.security.confirmPassword")}
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                    />
                    {actionData?.formType === "password" &&
                      actionData?.fieldErrors?.confirmPassword && (
                        <p className={styles.error}>
                          {actionData.fieldErrors.confirmPassword._errors[0]}
                        </p>
                      )}
                  </div>
                  <div className={styles.formActions}>
                    <Button type="submit">
                      {t("settings.security.updatePassword")}
                    </Button>
                  </div>
                </Form>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      {t("settings.security.twoFactorAuth")}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {t("settings.security.enableTwoFactor")}
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
