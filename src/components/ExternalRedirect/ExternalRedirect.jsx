import React, { useEffect, useState } from 'react';
import './ExternalRedirect.css'
import Loader from '../../elements/Loader/Loader';
import { useStateValue } from '../../contexts/StateContextProvider';


const ExternalRedirect = () => {
    const [loading, setLoading] = useState(false);

  useEffect(() => {


    // Redirect to the portal when the component is loaded
    window.location.href = 'https://akurinuyouth.com/portal/';
   

  }, []);

  return (
    <>
        
        <div className="feed">
        {/* // Change to portal link*/}

        <h1> Redirecting to <a href="https://akurinuyouth.com/portal/"> Portal for Login</a>...</h1>

        {loading && <div className="feed__loader"><Loader /></div>}

        </div>
    </>
  );
};

export default ExternalRedirect;
