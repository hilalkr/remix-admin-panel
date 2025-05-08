import { redirect } from "@remix-run/node";

export async function loader() {
  // Just redirect to the cities table view
  return redirect("/dashboard/cities/list");
}
