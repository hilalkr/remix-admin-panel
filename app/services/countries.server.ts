// Mock country data service
import { v4 as uuid } from "uuid";

export type Status = "active" | "inactive" | "pending";
export type Country = {
  id: string;
  name: string;
  code: string;
  capital: string;
  region: string;
  population: number;
  status: Status;
  dateAdded: string;
};

// Sample countries data
let countries: Country[] = [
  {
    id: "CNT001",
    name: "United States",
    code: "US",
    capital: "Washington D.C.",
    region: "North America",
    population: 331002651,
    status: "active",
    dateAdded: "2023-05-15T10:00:00Z",
  },
  {
    id: "CNT002",
    name: "United Kingdom",
    code: "GB",
    capital: "London",
    region: "Europe",
    population: 67886011,
    status: "active",
    dateAdded: "2023-05-14T14:30:00Z",
  },
  {
    id: "CNT003",
    name: "Japan",
    code: "JP",
    capital: "Tokyo",
    region: "Asia",
    population: 126476461,
    status: "active",
    dateAdded: "2023-05-10T09:15:00Z",
  },
  {
    id: "CNT004",
    name: "France",
    code: "FR",
    capital: "Paris",
    region: "Europe",
    population: 65273511,
    status: "inactive",
    dateAdded: "2023-05-16T11:45:00Z",
  },
  {
    id: "CNT005",
    name: "Germany",
    code: "DE",
    capital: "Berlin",
    region: "Europe",
    population: 83783942,
    status: "active",
    dateAdded: "2023-05-15T16:20:00Z",
  },
  {
    id: "CNT006",
    name: "Australia",
    code: "AU",
    capital: "Canberra",
    region: "Oceania",
    population: 25499884,
    status: "pending",
    dateAdded: "2023-05-14T13:10:00Z",
  },
  {
    id: "CNT007",
    name: "Turkey",
    code: "TR",
    capital: "Ankara",
    region: "Asia/Europe",
    population: 84339067,
    status: "active",
    dateAdded: "2023-05-12T10:30:00Z",
  },
  {
    id: "CNT008",
    name: "Brazil",
    code: "BR",
    capital: "Brasília",
    region: "South America",
    population: 212559417,
    status: "inactive",
    dateAdded: "2023-05-16T09:00:00Z",
  },
  {
    id: "CNT009",
    name: "India",
    code: "IN",
    capital: "New Delhi",
    region: "Asia",
    population: 1380004385,
    status: "active",
    dateAdded: "2023-05-15T14:45:00Z",
  },
  {
    id: "CNT010",
    name: "South Africa",
    code: "ZA",
    capital: "Pretoria",
    region: "Africa",
    population: 59308690,
    status: "pending",
    dateAdded: "2023-05-14T11:25:00Z",
  },
];

// Get all countries
export async function getCountries(): Promise<Country[]> {
  return [...countries];
}

// Get a country by ID
export async function getCountryById(id: string): Promise<Country | null> {
  const country = countries.find((c) => c.id === id);
  if (!country) return null;
  return { ...country };
}

// Create a new country
export async function createCountry(
  countryData: Omit<Country, "id" | "dateAdded">
): Promise<Country> {
  const newCountry: Country = {
    id: uuid(),
    ...countryData,
    dateAdded: new Date().toISOString(),
  };

  countries.push(newCountry);
  return { ...newCountry };
}

// Update a country
export async function updateCountry(
  id: string,
  countryData: Partial<Omit<Country, "id" | "dateAdded">>
): Promise<Country | null> {
  const index = countries.findIndex((c) => c.id === id);
  if (index === -1) return null;

  countries[index] = {
    ...countries[index],
    ...countryData,
  };

  return { ...countries[index] };
}

// Delete a country
export async function deleteCountry(id: string): Promise<boolean> {
  const initialLength = countries.length;
  countries = countries.filter((c) => c.id !== id);
  return countries.length !== initialLength;
}
