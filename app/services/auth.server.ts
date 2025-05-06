import { createCookieSessionStorage, redirect } from '@remix-run/node';

// Mock user data
const users = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    password: "admin123",
    role: "admin"
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    password: "user123",
    role: "user"
  }
];

// Session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3t"], // Would use env variable in production
    secure: process.env.NODE_ENV === "production",
  },
});

// Get session from request
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// Create user session
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// Get logged-in user from session
export async function getUserId(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

// Get user details
export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === null) return null;
  
  const user = users.find(user => user.id === userId);
  if (!user) return null;
  
  // Don't expose sensitive data
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Check if user is logged in
export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

// Login function
export async function login({ email, password }: { email: string; password: string }) {
  const user = users.find(user => user.email === email && user.password === password);
  if (!user) return null;
  return { id: user.id };
}

// Logout function
export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
} 