import { ActionFunction } from "@remix-run/node";
import { logout } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export default function Logout() {
  return <div>Logging out...</div>;
} 