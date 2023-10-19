import { seedCountries } from "./countries";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import countries from "~/models/fixtures/countries.json";
const prisma = new PrismaClient();

const cleanupDatabase = async () => {
  console.log(`Sending old data to the 🗑️`);

  return process.env.NODE_ENV === "production"
    ? Promise.resolve(false)
    : Promise.all([prisma.country.deleteMany()]);
};

async function seed() {
  const results = Promise.all([seedCountries(countries)]);
  console.log(results);
  console.log(`Database has been seeded. 🌱`);
}

cleanupDatabase()
  .then(() => seed())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
