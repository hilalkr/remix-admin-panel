import { useTranslation } from "react-i18next";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { z } from "zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { useState } from "react";

import { createUser, Role, Status } from "~/services/users.server";
import styles from "./NewUser.module.css";
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
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "user", "editor"] as const),
  status: z.enum(["active", "inactive", "pending"] as const),
});

// Add this type to handle both error formats
type ActionData =
  | { error: string; errors?: never }
  | { errors: Record<string, { _errors: string[] }>; error?: never };

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const result = userSchema.safeParse(formValues);
  if (!result.success) {
    return json({ errors: result.error.format() }, { status: 400 });
  }

  await createUser(result.data);
  return redirect("/dashboard/users");
}

export default function NewUser() {
  const { t } = useTranslation("common");
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as Role,
    status: "active" as Status,
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 className={styles.title}>{t("users.newUser")}</h2>

      <Form method="post" className={styles.form}>
        <div className={styles.formGroup}>
          <Label htmlFor="name">{t("users.name")}</Label>
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
          <Label htmlFor="email">{t("users.email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {actionData?.errors && actionData.errors.email && (
            <p className={styles.error}>{actionData.errors.email._errors[0]}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="role">{t("users.role")}</Label>
          <Select
            name="role"
            value={formData.role}
            onValueChange={(value) => handleChange("role", value as Role)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("users.selectRole")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">{t("users.roles.admin")}</SelectItem>
              <SelectItem value="user">{t("users.roles.user")}</SelectItem>
              <SelectItem value="editor">{t("users.roles.editor")}</SelectItem>
            </SelectContent>
          </Select>
          {actionData?.errors && actionData.errors.role && (
            <p className={styles.error}>{actionData.errors.role._errors[0]}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="status">{t("users.status")}</Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => handleChange("status", value as Status)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("users.selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                {t("users.statuses.active")}
              </SelectItem>
              <SelectItem value="inactive">
                {t("users.statuses.inactive")}
              </SelectItem>
              <SelectItem value="pending">
                {t("users.statuses.pending")}
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
            onClick={() => navigate("/dashboard/users")}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit">{t("common.create")}</Button>
        </div>
      </Form>
    </div>
  );
}
