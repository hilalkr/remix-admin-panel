import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { PlusCircle } from "lucide-react";

import { getCountries } from "~/services/countries.server";
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
  const countries = await getCountries();
  return json({ countries });
}

export default function CountriesList() {
  const { countries } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");

  // Function to render status badge with appropriate color
  function renderStatus(status: string) {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500">
            {t("countries.statuses.active")}
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="destructive">
            {t("countries.statuses.inactive")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            {t("countries.statuses.pending")}
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
        <h2 className="text-2xl font-bold">{t("countries.allCountries")}</h2>
        <Button asChild>
          <Link to="/dashboard/countries/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("countries.addCountry")}
          </Link>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("countries.name")}</TableHead>
              <TableHead>{t("countries.code")}</TableHead>
              <TableHead>{t("countries.capital")}</TableHead>
              <TableHead>{t("countries.region")}</TableHead>
              <TableHead>{t("countries.population")}</TableHead>
              <TableHead>{t("countries.status")}</TableHead>
              <TableHead className="text-right">
                {t("common.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((country) => (
              <TableRow key={country.id}>
                <TableCell className="font-medium">{country.name}</TableCell>
                <TableCell>{country.code}</TableCell>
                <TableCell>{country.capital}</TableCell>
                <TableCell>{country.region}</TableCell>
                <TableCell>{formatPopulation(country.population)}</TableCell>
                <TableCell>{renderStatus(country.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/countries/${country.id}/edit`}>
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
