import { Outlet, useMatches } from "@remix-run/react";
import { useEffect, useState } from "react";
import { colorSwitcher, iterateBreadcrumbs, } from '~/utilities/core/index.ts'
import breadcrumb from '~/assets/data/breadcrumbs.json'
const ArrivalBankLayout = () => {
  const matches = useMatches();
  const [breadcrumbs, setBreadcrumbs] = useState(breadcrumb);
  useEffect(()=> {
    setBreadcrumbs((crumb) => iterateBreadcrumbs(crumb, matches));
  },[])
  return (
    <main>
      <aside className="navigation-link-breadcrumb">
        <ul>
          {breadcrumbs.map((route) => (
            <li key={route.id}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  width="16"
                  height="16"
                  rx="2"
                  fill={colorSwitcher(route)}
                />
              </svg>
              <span>{route.label}</span>
            </li>
          ))}
        </ul>
      </aside>
      <Outlet />
    </main>
  );
};

export default ArrivalBankLayout;
