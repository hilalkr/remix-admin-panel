import { LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getUser, requireUserId } from "~/services/auth.server";
import DashboardLayout from "~/components/layout/dashboard-layout";

export const loader: LoaderFunction = async ({ request }) => {
  // Check if user is authenticated
  await requireUserId(request);
  const user = await getUser(request);
  
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ user });
};

export default function Dashboard() {
  const { user } = useLoaderData<{ user: { name: string; email: string; role: string } }>();
  const { i18n } = useTranslation();
  
  // Force reload translations when dashboard is loaded
  useEffect(() => {
    // Ensure translations are loaded whenever the dashboard is rendered
    const loadTranslations = async () => {
      if (i18n.isInitialized) {
        // Reload resources for the current language
        await i18n.reloadResources(i18n.language, ['common']);
      }
    };
    
    loadTranslations();
  }, [i18n]);
  
  return (
    <DashboardLayout user={user}>
      <Outlet />
    </DashboardLayout>
  );
} 