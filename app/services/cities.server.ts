// Mock city data service
import { v4 as uuid } from "uuid";

export type Status = "active" | "inactive" | "pending";
export type City = {
  id: string;
  name: string;
  country: string;
  population: number;
  status: Status;
  dateAdded: string;
};

// Sample cities data
let cities: City[] = [
  {
    id: "CTY001",
    name: "New York",
    country: "United States",
    population: 8804190,
    status: "active",
    dateAdded: "2023-05-15T10:00:00Z",
  },
  {
    id: "CTY002",
    name: "London",
    country: "United Kingdom",
    population: 8982000,
    status: "active",
    dateAdded: "2023-05-14T14:30:00Z",
  },
  {
    id: "CTY003",
    name: "Tokyo",
    country: "Japan",
    population: 13960000,
    status: "active",
    dateAdded: "2023-05-10T09:15:00Z",
  },
  {
    id: "CTY004",
    name: "Paris",
    country: "France",
    population: 2140526,
    status: "inactive",
    dateAdded: "2023-05-16T11:45:00Z",
  },
  {
    id: "CTY005",
    name: "Berlin",
    country: "Germany",
    population: 3669491,
    status: "active",
    dateAdded: "2023-05-15T16:20:00Z",
  },
  {
    id: "CTY006",
    name: "Sydney",
    country: "Australia",
    population: 5312163,
    status: "pending",
    dateAdded: "2023-05-14T13:10:00Z",
  },
  {
    id: "CTY007",
    name: "Istanbul",
    country: "Turkey",
    population: 15460000,
    status: "active",
    dateAdded: "2023-05-12T10:30:00Z",
  },
  {
    id: "CTY008",
    name: "Dubai",
    country: "United Arab Emirates",
    population: 3331420,
    status: "inactive",
    dateAdded: "2023-05-16T09:00:00Z",
  },
  {
    id: "CTY009",
    name: "Mumbai",
    country: "India",
    population: 20185064,
    status: "active",
    dateAdded: "2023-05-15T14:45:00Z",
  },
  {
    id: "CTY010",
    name: "São Paulo",
    country: "Brazil",
    population: 12325232,
    status: "pending",
    dateAdded: "2023-05-14T11:25:00Z",
  },
];

// Get all cities
export async function getCities(): Promise<City[]> {
  return [...cities];
}

// Get a city by ID
export async function getCityById(id: string): Promise<City | null> {
  const city = cities.find((c) => c.id === id);
  if (!city) return null;
  return { ...city };
}

// Create a new city
export async function createCity(
  cityData: Omit<City, "id" | "dateAdded">
): Promise<City> {
  const newCity: City = {
    id: uuid(),
    ...cityData,
    dateAdded: new Date().toISOString(),
  };

  cities.push(newCity);
  return { ...newCity };
}

// Update a city
export async function updateCity(
  id: string,
  cityData: Partial<Omit<City, "id" | "dateAdded">>
): Promise<City | null> {
  const index = cities.findIndex((c) => c.id === id);
  if (index === -1) return null;

  cities[index] = {
    ...cities[index],
    ...cityData,
  };

  return { ...cities[index] };
}

// Delete a city
export async function deleteCity(id: string): Promise<boolean> {
  const initialLength = cities.length;
  cities = cities.filter((c) => c.id !== id);
  return cities.length !== initialLength;
}
