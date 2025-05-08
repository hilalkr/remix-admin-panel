import { useTranslation } from "react-i18next";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";

import {
  getCountryById,
  updateCountry,
  Country,
} from "~/services/countries.server";
import styles from "./CountryEdit.module.css";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Define form schema with Zod
const countrySchema = zfd.formData({
  name: zfd.text(z.string().min(1, "Name is required")),
  code: zfd.text(
    z
      .string()
      .min(2, "Country code is required")
      .max(2, "Country code must be 2 characters")
  ),
  capital: zfd.text(z.string().min(1, "Capital is required")),
  region: zfd.text(z.string().min(1, "Region is required")),
  population: zfd.numeric(z.number().min(1, "Population must be at least 1")),
  status: zfd.text(z.enum(["active", "inactive", "pending"])),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const countryId = params.countryId;
  if (!countryId) {
    return redirect("/dashboard/countries/list");
  }

  const country = await getCountryById(countryId);
  if (!country) {
    return redirect("/dashboard/countries/list");
  }

  return json({ country });
}

// Add this type to handle both error formats
type ActionData =
  | { error: string; errors?: never }
  | { errors: Record<string, { _errors: string[] }>; error?: never };

export async function action({ request, params }: ActionFunctionArgs) {
  const countryId = params.countryId;
  if (!countryId) {
    return json({ error: "Country ID is required" }, { status: 400 });
  }

  const formData = await request.formData();
  const result = countrySchema.safeParse(formData);

  if (!result.success) {
    return json({ errors: result.error.format() }, { status: 400 });
  }

  const country = await updateCountry(countryId, result.data);
  if (!country) {
    return json({ error: "Country not found" }, { status: 404 });
  }

  return redirect("/dashboard/countries/list");
}

export default function CountryEdit() {
  const { t } = useTranslation("common");
  const { country } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Country>>({
    name: country.name,
    code: country.code,
    capital: country.capital,
    region: country.region,
    population: country.population,
    status: country.status,
  });

  const handleChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 className={styles.title}>{t("countries.editCountry")}</h2>

      <Form method="post" className={styles.form}>
        <div className={styles.formGroup}>
          <Label htmlFor="name">{t("countries.name")}</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {actionData?.errors && actionData.errors.name && (
            <p className={styles.error}>{actionData.errors.name._errors[0]}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="code">{t("countries.code")}</Label>
          <Input
            id="code"
            name="code"
            value={formData.code}
            maxLength={2}
            onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
          />
          {actionData?.errors && actionData.errors.code && (
            <p className={styles.error}>{actionData.errors.code._errors[0]}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="capital">{t("countries.capital")}</Label>
          <Input
            id="capital"
            name="capital"
            value={formData.capital}
            onChange={(e) => handleChange("capital", e.target.value)}
          />
          {actionData?.errors && actionData.errors.capital && (
            <p className={styles.error}>
              {actionData.errors.capital._errors[0]}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="region">{t("countries.region")}</Label>
          <Input
            id="region"
            name="region"
            value={formData.region}
            onChange={(e) => handleChange("region", e.target.value)}
          />
          {actionData?.errors && actionData.errors.region && (
            <p className={styles.error}>
              {actionData.errors.region._errors[0]}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="population">{t("countries.population")}</Label>
          <Input
            id="population"
            name="population"
            type="number"
            min="1"
            value={formData.population}
            onChange={(e) =>
              handleChange("population", parseInt(e.target.value, 10) || 0)
            }
          />
          {actionData?.errors && actionData.errors.population && (
            <p className={styles.error}>
              {actionData.errors.population._errors[0]}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="status">{t("countries.status")}</Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("countries.selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                {t("countries.statuses.active")}
              </SelectItem>
              <SelectItem value="inactive">
                {t("countries.statuses.inactive")}
              </SelectItem>
              <SelectItem value="pending">
                {t("countries.statuses.pending")}
              </SelectItem>
            </SelectContent>
          </Select>
          {actionData?.errors && actionData.errors.status && (
            <p className={styles.error}>
              {actionData.errors.status._errors[0]}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/countries/list")}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit">{t("common.save")}</Button>
        </div>
      </Form>
    </div>
  );
}
