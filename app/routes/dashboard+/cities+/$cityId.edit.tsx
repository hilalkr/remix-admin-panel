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

import { getCityById, updateCity, City } from "~/services/cities.server";
import styles from "./CityEdit.module.css";
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
const citySchema = zfd.formData({
  name: zfd.text(z.string().min(1, "Name is required")),
  country: zfd.text(z.string().min(1, "Country is required")),
  population: zfd.numeric(z.number().min(1, "Population must be at least 1")),
  status: zfd.text(z.enum(["active", "inactive", "pending"])),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const cityId = params.cityId;
  if (!cityId) {
    return redirect("/dashboard/cities/list");
  }

  const city = await getCityById(cityId);
  if (!city) {
    return redirect("/dashboard/cities/list");
  }

  return json({ city });
}

// Add this type to handle both error formats
type ActionData =
  | { error: string; errors?: never }
  | { errors: Record<string, { _errors: string[] }>; error?: never };

export async function action({ request, params }: ActionFunctionArgs) {
  const cityId = params.cityId;
  if (!cityId) {
    return json({ error: "City ID is required" }, { status: 400 });
  }

  const formData = await request.formData();
  const result = citySchema.safeParse(formData);

  if (!result.success) {
    return json({ errors: result.error.format() }, { status: 400 });
  }

  const city = await updateCity(cityId, result.data);
  if (!city) {
    return json({ error: "City not found" }, { status: 404 });
  }

  return redirect("/dashboard/cities/list");
}

export default function CityEdit() {
  const { t } = useTranslation("common");
  const { city } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<City>>({
    name: city.name,
    country: city.country,
    population: city.population,
    status: city.status,
  });

  const handleChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 className={styles.title}>{t("cities.editCity")}</h2>

      <Form method="post" className={styles.form}>
        <div className={styles.formGroup}>
          <Label htmlFor="name">{t("cities.name")}</Label>
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
          <Label htmlFor="country">{t("cities.country")}</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={(e) => handleChange("country", e.target.value)}
          />
          {actionData?.errors && actionData.errors.country && (
            <p className={styles.error}>
              {actionData.errors.country._errors[0]}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="population">{t("cities.population")}</Label>
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
          <Label htmlFor="status">{t("cities.status")}</Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("cities.selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                {t("cities.statuses.active")}
              </SelectItem>
              <SelectItem value="inactive">
                {t("cities.statuses.inactive")}
              </SelectItem>
              <SelectItem value="pending">
                {t("cities.statuses.pending")}
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
            onClick={() => navigate("/dashboard/cities/list")}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit">{t("common.save")}</Button>
        </div>
      </Form>
    </div>
  );
}
