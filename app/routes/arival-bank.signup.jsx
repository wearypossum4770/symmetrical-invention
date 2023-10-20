import { useRef } from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getAllCountries } from "~/models/country.server";
import { checkUserByEmail, getUserByEmail } from "~/models/user.server";
export const loader = async () => json(await getAllCountries());
import {
  validateEmail,
  validateCountry,
  validateUsername,
  validatePhoneNumber,
  advanceStepAllowed,
} from "~/utilities/validations/arival.server";
import { useEffect, useState } from "react";
import {
  retrieveAnonymousId,
  updateSessionData,
} from "~/utilities/analytics/whoami.client.ts";

export const action = async ({ request }) => {
  const data = Object.fromEntries((await request.formData()).entries());
  const existingUser = await checkUserByEmail(data);
  if (existingUser)
    return json({
      errors: { email: "A user already exists with this email." },
    });
  const errors = {
    country: (await validateCountry(data, getAllCountries))
      ? null
      : "Please select a country from the list given",
    email: await validateEmail(data),
    username: validateUsername(data),
    phoneNumber: validatePhoneNumber(data),
  };
  return advanceStepAllowed(errors)
    ? json({ ...data, errors })
    : redirect("/arival-bank/password");
};
const ArivalBankInitialInfo = () => {
  const anonymousId = useRef(null);
  const form = useRef(null);
  useEffect(() => {
    // retrieveAnonymousId
    // 'symmetrical-invention'
    const obj = retrieveAnonymousId();
    if (obj?.anonymousId) {
      anonymousId.current.value = obj.anonymousId;
    }
  }, []);
  const [firstInteraction, setFirstInteraction] = useState(false);
  const handleFirstInteraction = () =>
    setFirstInteraction((interacted) => !interacted & false);
  const data = useActionData();
  const errors = data?.errors;
  const phoneNumber = data?.phoneNumber;
  const username = data?.username;
  const country = data?.country;
  const email = data?.email;
  const countries = useLoaderData();
  const handleClick = async () => {
    const formData = new FormData(form.current);
    console.log(formData)
    updateSessionData(Object.fromEntries(formData));
  };
  return (
    <form
      ref={form}
      onFocus={handleFirstInteraction}
      method="post"
      className="arival-bank-form"
    >
      <input ref={anonymousId} name="anonymousId" hidden aria-hidden />
      <div className="arival-bank-form-group">
        <label>Username</label>
        <input
          name="username"
          autoComplete="username"
          defaultValue={username}
        />
        <em>{errors?.username}</em>
      </div>
      <div className="arival-bank-form-group">
        <label>Email Address</label>
        <input name="email" autoComplete="email" defaultValue={email} />
        <em>{errors?.email}</em>
      </div>
      <div className="arival-bank-form-group">
        <label>Phone Number:</label>
        <input
          name="phoneNumber"
          inputMode="numeric"
          autoComplete="tel-nationalc"
          defaultValue={phoneNumber}
        />
        <em>{errors?.phoneNumber}</em>
      </div>
      <div className="arival-bank-form-group">
        <label>Country</label>
        <select autoComplete="country" defaultValue={country} name="country">
          <option value="">Please Select A Country</option>
          {countries.map(({ countryName, countryId, id }) => (
            <option key={id} value={countryId}>
              {countryName}
            </option>
          ))}
        </select>
        <em>{errors?.country}</em>
      </div>
      <button
        data-first-interaction={firstInteraction}
        onClick={handleClick}
        type="submit"
      >
        Continue
      </button>
    </form>
  );
};
export default ArivalBankInitialInfo;
