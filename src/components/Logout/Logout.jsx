import React, { useState } from 'react';
import {useHistory} from 'react-router'
import { useStateValue } from '../../contexts/StateContextProvider';

import "./Logout.css";
import logout from '../../assets/logout.png'

export default function Cookies() {
	const [{user}] = useStateValue()
	const history = useHistory()
	const [loading, setLoading] = useState(false);

	const signout = () => {
        setLoading(true)
        localStorage.clear()
        history.push('/')
        setLoading(false)
        window.location.reload()
    }
    const backToProfile = () => {
      setLoading(true)
      history.push(`/profile/${user.username}`)
      setLoading(false)
  }


  return (
    <div className="cookies-content-container">
      <div className="cookiesContent" id="cookiesPopup">
        <button className="close" onClick={backToProfile}>✖</button>
        {/* <img src="https://static.vecteezy.com/system/resources/previews/022/719/495/original/cute-robot-chatbot-ai-bot-character-design-illustration-ai-technology-and-cyber-character-futuristic-technology-service-and-communication-artificial-intelligence-concept-png.png" alt="cookies-img" /> */}
        <img src={logout}  alt="cookies-img" />
        <p>Want to proceed log out ?</p>
        <button className="accept" onClick={signout} >Log Out </button>
      </div>
    </div>
  )
}

 