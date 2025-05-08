import { LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser, requireUserId } from "~/services/auth.server";
import DashboardLayout from "~/components/layout/dashboard-layout";
import { useTranslationLoader } from "~/hooks/useTranslationLoader";

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
  const { user } = useLoaderData<{
    user: { name: string; email: string; role: string };
  }>();

  // Use the custom hook to load translations
  useTranslationLoader(["common"]);

  return (
    <DashboardLayout user={user}>
      <Outlet />
    </DashboardLayout>
  );
}
