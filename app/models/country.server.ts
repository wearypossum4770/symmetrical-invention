import { PrismaClient } from "@prisma/client";

export type Country = {
  id: number;
  countryName: string;
  countryCodeAlpha2: string;
  countryCodeAlpha3: string;
  countryId: string;
};
const prisma = new PrismaClient();

export const getAllCountries = async () => prisma.country.findMany();
