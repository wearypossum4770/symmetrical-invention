import { Country } from "prisma/models";
import { string, object } from "yup";

type User = {
  email: string;
  username: string;
  phoneNumber: string;
  country: string;
  usernameAsEmail: string;
};
type PhoneNumberParts = {
  areaCode?: string;
  officeCode?: string;
  subscriber?: string;
};
const isAnyTrue = (arr: Array<string>) => arr.some(v=>v)
const infalliblePhone = ({ groups }: PhoneNumberParts | any) => {
  const { areaCode = "", officeCode = "", subscriber = "" } = groups;
  return { subscriber, areaCode, officeCode };
};

export const advanceStepAllowed = (errors: Record<string, string>) => isAnyTrue(Object.values(errors))

const phoneRegex: RegExp =
  /^\s*[-.\\/]?\(?\s*(?<areaCode>\d{3})\s*\)?\s*[-.\\/]?(?<officeCode>\d{3})\s*[-.\\/]?(?<subscriber>\d{4})\s*[-.]?/;
const emailSchema = object({ email: string().email() });

export const validateEmail = async ({ email }: Pick<User, "email">) => {
  if (!email) return "Email address is required.";
  try {
    emailSchema.validate({ email });
  } catch (error) {
    return "Please enter a valid email address";
  }
};
export const validateCountry = async (
  { country }: Pick<User, "country">,
  getAllCountries: Function,
) => {
  const countries = await getAllCountries();
  return countries.some(
    ({ countryId }: Pick<Country, "countryId">) => countryId === country,
  );
};
export const validatePhoneNumber = ({
  phoneNumber,
}: Pick<User, "phoneNumber">): boolean | string => {
  if (!phoneNumber) return "Please enter a valid phone number";
  return phoneNumbeValid({ phoneNumber }) ? "" : 'please enter a valid phone number';
};
export const validateUsername = ({ username }: Pick<User, "username">) => {
  if (!username) return "You must enter a username.";
  if (username.length < 4)
    return "Username must be at least 4 characters in length.";
  if (username.length > 12)
    return "Username cannot be more than 12 characters. Please shorten and resubmit.";
};

const parsePhoneNumber = ({ phoneNumber }: Pick<User, "phoneNumber">) =>
  infalliblePhone(phoneNumber.match(phoneRegex)?? {groups: ''});
export const phoneNumbeValid = ({ phoneNumber }: Pick<User, "phoneNumber">) => {
  const isValid = false;

  if (phoneNumber.constructor.name !== "String") return isValid;
  if (!phoneNumber.length) return isValid;

  const { areaCode, officeCode, subscriber } = parsePhoneNumber({
    phoneNumber,
  });
  const lineNumber = `${officeCode}${subscriber}`;
  if (/[^01]11/.test(areaCode)) return isValid;
  if (/[^01]9[0-9]/.test(areaCode)) return isValid;
  if (!/[^01][^9][0-9]/.test(areaCode)) return isValid;
  if (/[^01]11/.test(officeCode)) return isValid;
  if (!/[^01][0-9]{2}/.test(officeCode)) return isValid;
  if (/555(?=1212|01\d{2}|4334)/.test(lineNumber)) return isValid;
  return true;
};
