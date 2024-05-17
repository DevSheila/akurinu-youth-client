import React, { useEffect, useState } from 'react';
import db, { auth, provider } from '../../firebase';
import { actionTypes } from '../../contexts/StateReducers';
import { useStateValue } from '../../contexts/StateContextProvider';
import firebase from 'firebase'
import './GoogleAuth.css';
import Loader from '../../elements/Loader/Loader';


const GoogleAuth = () => {

  const [{ user }, dispatch] = useStateValue();

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    const signInWithGoogle = async () => {
        try {
            setLoading(true)
          const result = await auth.signInWithPopup(provider);
          const user = result.user;
          console.log("user",user);
          
          // Check if user with that email already exists
           await userExists(user);
          // User exists? Set user state and sign in user
          // User does not exist? Create user, Set user state and sign in user
        } catch (error) {
          setLoading(false)

          console.log("error", error);
        }
        
      };
      

  const userExists = async (user) => {
    setLoading(true);
    try {
        const snapshot = await db.collection('users').where('email', '==', user.email).limit(1).get();
        // User does not exist? Create user, Set user state and sign in user
        if (!snapshot.docs.length) {
          setError('User does not exist in firebase database');
          createUser(user);
        }else{
          // User exists? Set user state and sign in user
            const userData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
            auths(userData)
        }


    } catch (error) {
      console.error('Firebase error:', error);
      setError('An error occurred, please try again');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (user) => {
    try {

      if (user) {
        const docRef = await db.collection('users').add({
            bio:'',
            userType:'',
            displayName: user.displayName,
            email:user.email,
            followers: [],
            following: [],
            joined: firebase.firestore.FieldValue.serverTimestamp(),
            password:'',
            photoURL: user.photoURL,
            rooms: [],
            username:user.displayName,
            verified: true,
            wallpaper: ''
        });
        const docSnapshot = await docRef.get();
        if (docSnapshot.exists) {
          const createdUser = { id: docRef.id, ...docSnapshot.data() };
          auths(createdUser);
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.error("Error creating user from google auth", error);
      setError("An error occurred, please try again");
    }
  };


  const auths = (user) => {
    try {
        user.password = undefined
        localStorage.setItem('twittie_user', JSON.stringify(user))
        
        dispatch({
            type: actionTypes.SET_USER,
            user : JSON.parse(localStorage.getItem('twittie_user'))
        })
        // Redirect user to feed
        // history.push(`/`);
        
        setLoading(false)          
    } catch (error) {
        console.log(error)
        setLoading(false)
        return
    }
}

  return (

    <>
    {loading && <div className="loader"><Loader /></div>}

    <div className="modal-content-container">
      <div className="modalContent" id="modalPopup">
        <button className="close">✖</button>


          <div className="image-section">
            <img src="/akurinuyouth-logo.jpg" alt="modal-img" />
          </div>
          
          
          <div className="text-section">
            <p>Kindly confirm account to proceed.</p>
            <button className="accept" onClick={signInWithGoogle}>

              Proceed
              </button>
          </div>


      </div>
    </div>
        
    </>
  );
};

export default GoogleAuth;
