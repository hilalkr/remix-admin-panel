import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { createUserSession, getUser, login } from "~/services/auth.server";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import styles from "~/styles/auth.module.scss";

type ActionData = {
  errors?: {
    email?: string;
    password?: string;
    form?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo") || "/dashboard";
  const remember = formData.get("remember");

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return json<ActionData>(
      { errors: { email: "Invalid email" } },
      { status: 400 }
    );
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return json<ActionData>(
      { errors: { password: "Password should be at least 6 characters" } },
      { status: 400 }
    );
  }

  const user = await login({ email, password });
  if (!user) {
    return json<ActionData>(
      { errors: { form: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession(
    user.id,
    typeof redirectTo === "string" ? redirectTo : "/dashboard"
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/dashboard");
  return json({});
};

export default function Login() {
  const { t } = useTranslation();
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <img 
            className={styles.authLogo} 
            src="/logo-light.png" 
            alt="Logo" 
          />
          <h2 className={styles.authTitle}>
            {t("auth.login")}
          </h2>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.formPanel}>
            <Form method="post" className={styles.formGroup}>
              <input type="hidden" name="redirectTo" value={redirectTo} />
              
              <div className={styles.formField}>
                <label htmlFor="email" className={styles.formLabel}>
                  {t("auth.email")}
                </label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={actionData?.errors?.email ? true : undefined}
                  aria-describedby="email-error"
                />
                {actionData?.errors?.email && (
                  <div className={styles.formError} id="email-error">
                    {actionData.errors.email}
                  </div>
                )}
              </div>

              <div className={styles.formField}>
                <label htmlFor="password" className={styles.formLabel}>
                  {t("auth.password")}
                </label>
                <Input 
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={actionData?.errors?.password ? true : undefined}
                  aria-describedby="password-error"
                />
                {actionData?.errors?.password && (
                  <div className={styles.formError} id="password-error">
                    {actionData.errors.password}
                  </div>
                )}
              </div>

              <div className={styles.formActions}>
                <div className={styles.formRemember}>
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
                    {t("auth.rememberMe")}
                  </label>
                </div>

                <div className={styles.formLinks}>
                  <Link to="/forgot-password" className={styles.formLink}>
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
              </div>

              {actionData?.errors?.form && (
                <div className={styles.formError}>
                  {actionData.errors.form}
                </div>
              )}

              <Button type="submit" className={styles.formSubmit}>
                {t("auth.login")}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
} 