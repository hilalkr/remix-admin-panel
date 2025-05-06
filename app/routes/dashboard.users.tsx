import { useTranslation } from "react-i18next";
import { Plus, } from "lucide-react";

import { Button } from "~/components/ui/button";


import styles from "~/styles/users.module.scss";
import { getUsers, User} from "~/services/users.server";
import { DataTable } from "~/components/data-table/data-table";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { type ColumnDef } from "@tanstack/react-table";
import { columns } from "~/components/data-table/columns";





  

export async function loader({ request }: LoaderFunctionArgs) {
  const users = await getUsers();
  return json({ users });
}



export default function UsersPage() {
  const { t, i18n } = useTranslation('common');
  const { users } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("users.title")}</h1>
        
        <Button className="mt-4 md:mt-0" variant="default">
          <Plus className="mr-2 h-4 w-4" />
          {t("users.addUser")}
        </Button>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  );
} 