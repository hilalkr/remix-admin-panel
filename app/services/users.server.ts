// Mock user data service
import { v4 as uuid } from 'uuid';


export type Role = 'admin' | 'user' | 'editor';
export type Status = 'active' | 'inactive' | 'pending';
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  dateAdded: string;
};

// Sample users data
let users: User[] = [
  {
    id: "USR001",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
    role: "admin",
    dateAdded: "2023-05-15T10:00:00Z",
  },
  {
    id: "USR002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "active",
    role: "user",
    dateAdded: "2023-05-14T14:30:00Z",
  },
  {
    id: "USR003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    status: "inactive",
    role: "user",
    dateAdded: "2023-05-10T09:15:00Z",
  },
  {
    id: "USR004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    status: "pending",
    role: "editor",
    dateAdded: "2023-05-16T11:45:00Z",
  },
  {
    id: "USR005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    status: "active",
    role: "user",
    dateAdded: "2023-05-15T16:20:00Z",
  },
  {
    id: "USR006",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    status: "active",
    role: "user",
    dateAdded: "2023-05-14T13:10:00Z",
  },
  {
    id: "USR007",
    name: "David Miller",
    email: "david.miller@example.com",
    status: "inactive",
    role: "user",
    dateAdded: "2023-05-12T10:30:00Z",
  },
  {
    id: "USR008",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@example.com",
    status: "pending",
    role: "editor",
    dateAdded: "2023-05-16T09:00:00Z",
  },
  {
    id: "USR009",
    name: "James Anderson",
    email: "james.anderson@example.com",
    status: "active",
    role: "user",
    dateAdded: "2023-05-15T14:45:00Z",
  },
  {
    id: "USR010",
    name: "Lisa Thomas",
    email: "lisa.thomas@example.com",
    status: "active",
    role: "admin",
    dateAdded: "2023-05-14T11:25:00Z",
  },
  {
    id: "USR011",
    name: "Daniel Jackson",
    email: "daniel.jackson@example.com",
    status: "inactive",
    role: "user",
    dateAdded: "2023-05-13T15:50:00Z",
  },
  {
    id: "USR012",
    name: "Amanda White",
    email: "amanda.white@example.com",
    status: "pending",
    role: "editor",
    dateAdded: "2023-05-16T10:15:00Z",
  },
]

// Get all users
export async function getUsers(): Promise<User[]> {
  return [...users];
}

// Get a user by ID
export async function getUserById(id: string): Promise<User | null> {
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  return { ...user };
}

// Create a new user
export async function createUser(userData: Omit<User, 'id' | 'dateAdded'>): Promise<User> {
  const newUser: User = {
    id: uuid(),
    ...userData,
    dateAdded: new Date().toISOString(),
  };
  
  users.push(newUser);
  return { ...newUser };
}

// Update a user
export async function updateUser(id: string, userData: Partial<Omit<User, 'id' | 'dateAdded'>>): Promise<User | null> {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  
  users[index] = {
    ...users[index],
    ...userData,
  };
  
  return { ...users[index] };
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  const initialLength = users.length;
  users = users.filter((u) => u.id !== id);
  return users.length !== initialLength;
} 