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

import { getUserById, updateUser, User } from "~/services/users.server";
import styles from "./UserEdit.module.css";
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
const userSchema = zfd.formData({
  name: zfd.text(),
  email: zfd.text(z.string().email()),
  role: zfd.text(z.enum(["admin", "user", "editor"])),
  status: zfd.text(z.enum(["active", "inactive", "pending"])),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.userId;
  if (!userId) {
    return redirect("/dashboard/users");
  }

  const user = await getUserById(userId);
  if (!user) {
    return redirect("/dashboard/users");
  }

  return json({ user });
}

// Add this type to handle both error formats
type ActionData =
  | { error: string; errors?: never }
  | { errors: Record<string, { _errors: string[] }>; error?: never };

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = params.userId;
  if (!userId) {
    return json({ error: "User ID is required" }, { status: 400 });
  }

  const formData = await request.formData();
  const result = userSchema.safeParse(formData);

  if (!result.success) {
    return json({ errors: result.error.format() }, { status: 400 });
  }

  const user = await updateUser(userId, result.data);
  if (!user) {
    return json({ error: "User not found" }, { status: 404 });
  }

  return redirect("/dashboard/users");
}

export default function UserEdit() {
  const { t } = useTranslation("common");
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 className={styles.title}>{t("users.editUser")}</h2>

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
            onValueChange={(value) => handleChange("role", value)}
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
            onValueChange={(value) => handleChange("status", value)}
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
          <Button type="submit">{t("common.save")}</Button>
        </div>
      </Form>
    </div>
  );
}
