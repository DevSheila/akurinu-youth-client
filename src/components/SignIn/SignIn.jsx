import React, { useState, useEffect } from 'react';
import db from '../../firebase';
import { useHistory, useParams } from 'react-router';
import { actionTypes } from '../../contexts/StateReducers';
import axios from 'axios';
import firebase from 'firebase';
import { useStateValue } from '../../contexts/StateContextProvider';

const SignIn = () => {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const { userEmail } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Effect to load user profile if user is available
    let mounted = true;
    if (user && user.id) {
      const unsubscribe = db.collection('users').doc(user.id).onSnapshot(snapshot => {
        if (mounted) {
          dispatch({
            type: actionTypes.SET_USER_PROFILE,
            profile: snapshot.data()
          });
        }
      });
      return () => {
        mounted = false;
        unsubscribe();
      };
    }
  }, [user, dispatch]);

  useEffect(() => {
    // Effect to create user or fetch user data
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userEmail) {
          const snapshot = await db.collection('users').where('email', '==', userEmail).limit(1).get();
          if (!snapshot.docs.length) {
            setError('User does not exist in firebase database');
            createUserByEmail(userEmail);
            return;
          }
          const userData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
          authAndRedirect(userData);
        } else {
          setError('No user email provided');
        }
      } catch (error) {
        console.error('Firebase error:', error);
        setError('An error occurred, please try again');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup function
    };
  }, [userEmail]);

  const createUserByEmail = async userEmail => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/users/${userEmail}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      const userData = response.data;
      if (userData) {
        const docRef = await db.collection('users').add({
          // Populate user data
        });
        const docSnapshot = await docRef.get();
        if (docSnapshot.exists) {
          const createdUser = { id: docRef.id, ...docSnapshot.data() };
          authAndRedirect(createdUser);
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.error("Error creating user by email", error);
      setError("An error occurred, please try again");
    }
  };

  const authAndRedirect = user => {
    try {
      // Store user data in local storage
      localStorage.setItem('twittie_user', JSON.stringify(user));
      localStorage.setItem('userEmail', JSON.stringify(userEmail));

      // Dispatch action to update user state
      dispatch({
        type: actionTypes.SET_USER,
        user: user
      });

      // Redirect user
      history.push(`/`);
    } catch (error) {
      console.error(error);
      setError('An error occurred, please try again');
    }
  };

  return (
    <div className="feed">
      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}
    </div>
  );
};

export default SignIn;
