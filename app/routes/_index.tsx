import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { createAnonymousUser } from "~/utilities/analytics/whoami.client";
import { useEffect } from "react";

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const navigate = useNavigate()
  const user = useOptionalUser();
  useEffect(() => {
    createAnonymousUser()
  }, []);
  const handleNavigation = () => navigate("/arival-bank/signup")
  return (
    <main>
      <button onClick={handleNavigation}>click here</button>
    </main>
  );
}
