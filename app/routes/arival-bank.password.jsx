import {
  useActionData,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState, useRef, useEffect } from "react";
import {
  advanceStepAllowed,
  passwordValidator,
} from "~/utilities/validations/arival.server";
import { retrieveAnonymousId } from "~/utilities/analytics/whoami.client.ts";
import { createUser } from "~/models/user.server";


export const loader = async () => json(null);
export const action = async ({ request }) => {
  const data = Object.fromEntries((await request.formData()).entries());
  const  { current: { value }}= JSON.parse(data.remainingData)
  const previous = JSON.parse(value)
  const errors = {
    password: passwordValidator(data),
    passwordConfirmation: passwordValidator(data),
  };
  const user = await createUser({...data, ...previous, countryId: previous.country})
  return advanceStepAllowed(errors)
    ? json({ errors })
    : redirect("/arival-bank/review");
};

const RegisterPassword = () => {
  const [anonymousId, remainingData, data] = [useRef(null), useRef({}), useActionData()];
  useEffect(() => {
    remainingData.current.value = sessionStorage.getItem('symmetrical-invention')
    anonymousId.current.value = retrieveAnonymousId().anonymousId;
  }, []);
  const [firstInteraction, setFirstInteraction] = useState(false);
  const handleFirstInteraction = () =>
    setFirstInteraction((interacted) => !interacted & false);
  const errors = data?.errors;
  return (
    <form
      onFocus={handleFirstInteraction}
      method="post"
      className="arival-bank-form"
    >
      <textarea name="remainingData" value={JSON.stringify(remainingData)}></textarea>
      <input ref={anonymousId} name="anonymousId" hidden aria-hidden />
      <div className="arival-bank-form-group">
        <label>Password</label>
        <input type="password" name="password" autoComplete="new-password" />
        <em>{errors?.password}</em>
      </div>
      <div className="arival-bank-form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          name="passwordConfirmation"
          autoComplete="new-password"
        />
        <em>{errors?.passwordConfirmation}</em>
      </div>
      <button data-first-interaction={firstInteraction} type="submit">
        Continue
      </button>
    </form>
  );
};

export default RegisterPassword;
