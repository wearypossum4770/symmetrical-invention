import { createId } from "@paralleldrive/cuid2";

import type { User } from "@prisma/client";
const SESSION_STORAGE_KEY = "symmetrical-invention";

export const setSessionData = async (key: string, data: any): Promise<void> => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error while setting data to sessionStorage:", error);
  }
};

export const getSessionData = <T>(key: string): T | null => {
  try {
    const storedData = sessionStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData) as T;
    }
    return null;
  } catch (error) {
    console.error("Error while getting data from sessionStorage:", error);
    return null;
  }
};

export const retrieveSessionData = () => getSessionData(SESSION_STORAGE_KEY)

export const updateSessionData = async (data: any): Promise<void> => {
  const previous = await getSessionData(SESSION_STORAGE_KEY)
  if (previous) {
    setSessionData(SESSION_STORAGE_KEY, {...previous, ...data });
  }
};
export const createAnonymousUser = () => {
  const anonymousId = createId();
  setSessionData(SESSION_STORAGE_KEY, { anonymousId });
  return { anonymousId };
};

export const retrieveAnonymousId = () =>
    (typeof document !== "undefined" &&  getSessionData("symmetrical-invention")) ?? (()=> {anonymousId: ''})


export const refreshCache = async ({ email }: Pick<User, "email">) => {
  try {
    const resp = await fetch(`http://${window.location.host}:3000/review/${email}`, { mode: 'cors', })
    return (!resp.ok) ? {} : await resp.json()
  } catch (error) {
    return {error:{ flashMessage: "Something went terribly wrong:", error}}
  }
}