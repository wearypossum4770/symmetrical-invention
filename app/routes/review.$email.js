import { json } from "@remix-run/node";
import { getUserReviewInformationByEmail } from "~/models/user.server";

export const loader = async ({params}) => json(await getUserReviewInformationByEmail(params))

export const action = async () => json({message: "This API endpoint only accepts the'GET' method."})