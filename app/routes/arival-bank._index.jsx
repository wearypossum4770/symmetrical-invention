import { Outlet } from "@remix-run/react";
import { useEffect } from "react";
import { createAnonymousUser } from "~/utilities/analytics/whoami.client.ts";
const ArrivalBankIndex = () => {
  useEffect(() => createAnonymousUser(), []);
  return <Outlet />;
};
export default ArrivalBankIndex;
