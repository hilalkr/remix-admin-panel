import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { getUsers } from "~/services/users.server";
import { json } from "@remix-run/node";
import { useLoaderData, Outlet, Link } from "@remix-run/react";

export async function loader() {
  const users = await getUsers();
  return json({ users });
}

export default function UsersPage() {
  const { t } = useTranslation("common");
  const { users } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("users.title")}
        </h1>

        <Link to="/dashboard/users/new">
          <Button className="mt-4 md:mt-0" variant="default">
            <Plus className="mr-2 h-4 w-4" />
            {t("users.addUser")}
          </Button>
        </Link>
      </div>
      <Outlet context={{ users }} />
    </div>
  );
}
