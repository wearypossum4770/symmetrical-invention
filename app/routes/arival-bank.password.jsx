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
  const form = Object.fromEntries((await request.formData()).entries());
  const data =  (typeof form === 'string') ? JSON.parse(form) : form
  const {remainingData} = data
  const parsedData = (typeof remainingData === 'string') ? JSON.parse(remainingData) : remainingData
  const finalData = (typeof parsedData === 'string') ? JSON.parse(parsedData) : parsedData
  const userData = { ...form, ...finalData}
  const errors = {
    password: passwordValidator(userData),
    passwordConfirmation: passwordValidator(userData),
  };
  
  const user = await createUser({...userData, countryId: userData.country})
  console.log(user, userData)
  return advanceStepAllowed(errors)
    ? json({ errors })
    : redirect(`/arival-bank/review/${user.id}`);
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
      <textarea name="remainingData" defaultValue={JSON.stringify(remainingData.current.value)} ></textarea>
      <input ref={anonymousId} autoComplete="identifier" name="anonymousId" />
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
