import { PrismaClient } from "@prisma/client";
import type { Country } from "~/models/country.server";
const prisma = new PrismaClient();

export const seedCountries = (countries: Country[]) =>
  countries.map(
    ({ id, countryName, countryCodeAlpha2, countryCodeAlpha3, countryId }) =>
      Promise.resolve(
        prisma.country.create({
          data: {
            id,
            countryName,
            countryCodeAlpha2,
            countryCodeAlpha3,
            countryId,
          },
        }),
      ),
  );
