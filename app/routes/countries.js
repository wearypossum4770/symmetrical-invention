import { json } from "@remix-run/node";
import { getAllCountries } from "~/models/country.server";

export const loader = async () => json(await getAllCountries());
