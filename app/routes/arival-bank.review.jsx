import { useEffect, useState } from "react";

  // export const loader = async() => {}

  const ArivalBankInitialReview = () => {
    const [user, setUser] = useState({username: '', email: '', countryName: '', shouldUpdate: true})
    useEffect(() => {
      const { email: sessionEmail} = JSON.parse(sessionStorage.getItem("symmetrical-invention"))
        async function update() {
        if (!user.shouldUpdate) return null
        const { username, email, country: { countryName }}= await (await fetch(`http://localhost:3000/review/${sessionEmail}`, { mode: 'cors', })).json()
        const shouldUpdate = [countryName, username, email].every(v=>v)
          setUser(u=> ({ ...u, countryName, username, email, shouldUpdate,}))
        }
        update()
    },[])
  return (
    <div className="arival-bank-confirmation">
      <div className="arival-bank-confirmation-container">
      <span className="arival-bank-confirmation-header">Username:</span> <span className="arival-bank-confirmation-data">{user.username}</span>
      <span className="arival-bank-confirmation-header">Email:</span> <span className="arival-bank-confirmation-data">{user.email}</span>
      <span className="arival-bank-confirmation-header">Country:</span> <span className="arival-bank-confirmation-data arival-bank-country-name">{user.countryName}</span>

      </div>
      <button>Continue</button>
    </div>
  )
};

export default ArivalBankInitialReview;
