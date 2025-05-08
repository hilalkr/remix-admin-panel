import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { PlusCircle } from "lucide-react";

import { getCities } from "~/services/cities.server";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

export async function loader() {
  const cities = await getCities();
  return json({ cities });
}

export default function CitiesList() {
  const { cities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");

  // Function to render status badge with appropriate color
  function renderStatus(status: string) {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500">{t("cities.statuses.active")}</Badge>
        );
      case "inactive":
        return (
          <Badge variant="destructive">{t("cities.statuses.inactive")}</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            {t("cities.statuses.pending")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  }

  // Format population with commas
  function formatPopulation(population: number) {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("cities.allCities")}</h2>
        <Button asChild>
          <Link to="/dashboard/cities/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("cities.addCity")}
          </Link>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("cities.name")}</TableHead>
              <TableHead>{t("cities.country")}</TableHead>
              <TableHead>{t("cities.population")}</TableHead>
              <TableHead>{t("cities.status")}</TableHead>
              <TableHead className="text-right">
                {t("common.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city.id}>
                <TableCell className="font-medium">{city.name}</TableCell>
                <TableCell>{city.country}</TableCell>
                <TableCell>{formatPopulation(city.population)}</TableCell>
                <TableCell>{renderStatus(city.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/cities/${city.id}/edit`}>
                      {t("common.edit")}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
