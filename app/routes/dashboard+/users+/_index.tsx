import { useOutletContext } from "@remix-run/react";
import UsersTable from "~/components/users/UsersTable";
import { User } from "~/services/users.server";

type ContextType = { users: User[] };

export default function UsersIndex() {
  const { users } = useOutletContext<ContextType>();
  return <UsersTable users={users} />;
}
