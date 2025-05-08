import { useTranslation } from "react-i18next";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getUser } from "~/services/auth.server";
import { BarChart, LineChart, PieChart } from "~/components/ui/charts";
import { format } from "date-fns";
import {
  Activity,
  BarChart3,
  Users,
  CreditCard,
  CircleUser,
} from "lucide-react";
import { useState, useEffect } from "react";

// Mock data for recent logins
const recentLoginsMock = [
  {
    id: "1",
    user: "Admin User",
    email: "admin@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: "success",
  },
  {
    id: "2",
    user: "John Doe",
    email: "john@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "success",
  },
  {
    id: "3",
    user: "Emily Davis",
    email: "emily@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    status: "failed",
  },
  {
    id: "4",
    user: "Jane Smith",
    email: "jane@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: "success",
  },
  {
    id: "5",
    user: "Robert Johnson",
    email: "robert@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    status: "success",
  },
];

// Define the activity data type
type ActivityDataType = Array<{
  date: string;
  users: number;
  sessions: number;
}>;

// Mock data for activity chart
const activityData: ActivityDataType = [
  { date: "Jan", users: 30, sessions: 40 },
  { date: "Feb", users: 45, sessions: 60 },
  { date: "Mar", users: 55, sessions: 70 },
  { date: "Apr", users: 40, sessions: 50 },
  { date: "May", users: 65, sessions: 80 },
  { date: "Jun", users: 75, sessions: 95 },
  { date: "Jul", users: 85, sessions: 105 },
];

// Define the user distribution data type
type UserDistributionType = Array<{
  name: string;
  value: number;
}>;

// Mock data for user distribution pie chart
const userDistributionData: UserDistributionType = [
  { name: "Admin", value: 5 },
  { name: "Editor", value: 12 },
  { name: "User", value: 25 },
];

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return json({
    user,
    recentLogins: recentLoginsMock,
    activityData,
    userDistributionData,
  });
};

export default function DashboardIndex() {
  const { t, i18n } = useTranslation();
  const { user, recentLogins, activityData, userDistributionData } =
    useLoaderData<{
      user: { name: string; email: string; role: string };
      recentLogins: typeof recentLoginsMock;
      activityData: ActivityDataType;
      userDistributionData: UserDistributionType;
    }>();

  // Force component to re-render when language changes
  const [, forceUpdate] = useState({});

  // Listen for language changes and trigger re-render
  useEffect(() => {
    const handleLanguageChanged = () => {
      // Force component to re-render when language changes
      forceUpdate({});
    };

    // Add language change listener
    i18n.on("languageChanged", handleLanguageChanged);

    // Clean up
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  // Stats would be fetched from a real API in a production app
  const stats = [
    {
      name: t("dashboard.totalUsers"),
      value: 42,
      icon: Users,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      name: t("dashboard.activeSessions"),
      value: 8,
      icon: Activity,
      color:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    {
      name: t("dashboard.reports"),
      value: 16,
      icon: BarChart3,
      color:
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    },
    {
      name: t("dashboard.revenue"),
      value: "$3,246",
      icon: CreditCard,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("dashboard.welcome")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t("dashboard.overview")} {user.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <div className={`rounded-md p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart
                data={activityData}
                index="date"
                categories={["users", "sessions"]}
                colors={["#3b82f6", "#4f46e5"]}
                valueFormatter={(value) => `${value}`}
                yAxisWidth={40}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("dashboard.recentLogins")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogins.map((login) => (
                <div
                  key={login.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                      <CircleUser className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{login.user}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {login.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {format(new Date(login.timestamp), "MMM d, h:mm a")}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                        login.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {login.status === "success"
                        ? t("dashboard.loginSuccess")
                        : t("dashboard.loginFailed")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.userDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChart
                data={userDistributionData}
                valueFormatter={(value) => `${value} users`}
                colors={["#3b82f6", "#4f46e5", "#8b5cf6"]}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.userActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart
                data={activityData}
                index="date"
                categories={["users"]}
                colors={["#3b82f6"]}
                valueFormatter={(value) => `${value} users`}
                yAxisWidth={40}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
