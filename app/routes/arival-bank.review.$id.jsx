import { useEffect, useState } from "react";
import { refreshCache } from '~/utilities/analytics/whoami.client'
import { getUserById } from '~/models/user.server'
import { json} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
export const loader = async ({ params}) => {
    const {username, email, country: { countryName }} = await getUserById(params)
    return json({username, email, countryName })
}
const ArivalBankInitialReview = () => {
    const [user, setUser] = useState(useLoaderData())
  return (
    <div className="arival-bank-confirmation">
      {/* <div> {user?.error?.errorMessage}</div> */}
      <div className="arival-bank-confirmation-container">
      <span className="arival-bank-confirmation-header">Username:</span>
      <span className="arival-bank-confirmation-data">{user.username}</span>
      <span className="arival-bank-confirmation-header">Email:</span>
      <span className="arival-bank-confirmation-data">{user.email}</span>
      <span className="arival-bank-confirmation-header">Country:</span>
      <span className="arival-bank-confirmation-data arival-bank-country-name">{user.countryName}</span>
      </div>
      <button>Continue</button>
    </div>
  )
};

export default ArivalBankInitialReview;
