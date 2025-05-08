import { redirect } from "@remix-run/node";

export async function loader() {
  // Just redirect to the countries table view
  return redirect("/dashboard/countries/list");
}
