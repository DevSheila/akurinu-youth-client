import React, { useState, useEffect } from 'react';
import TweetBox from '../TweetBox/TweetBox';
import Posts from '../Posts/Posts';
import db from '../../firebase';
import { Avatar } from '@material-ui/core';
import Loader from '../../elements/Loader/Loader';
import './SignIn.css';
import Search from '../../elements/Search/Search';
import { useStateValue } from '../../contexts/StateContextProvider';
import Announcements from '../Announcements/Announcements';
import AFBStory from '../AnnouncementStories/AnnouncementStories';
import {useHistory, useParams} from 'react-router'
import { actionTypes } from '../../contexts/StateReducers';
import axios from 'axios';
import firebase from 'firebase'

const SignIn = () => {
  const [{user}, dispatch] = useStateValue()

    // const {displayName} = user
    const [posts, setPosts] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [following, setFollowing] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [docId, setDocId] = useState('')

    
    const history = useHistory()
    const {userEmail} = useParams()

    const [error, setError] = useState('')
    

    useEffect(() => {
        let mounted = true;
        if (user && user.id) { //  conditional check
            const unsubscribe = db.collection('users').doc(user.id).onSnapshot(snapshot => {
                if (mounted) {
                    setProfile(snapshot.data());
                }
            });
    
            return () => {
                mounted = false;
                unsubscribe();
            };
        }
    }, [user]);
    
    

 
    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getUsers()



        function getUsers(){


            if(userEmail){
    
                //check if user email exists in database
                db.collection('users')
                .where('email', '==', userEmail)
                .limit(1)
                .get()
                .then(snapshot=>{
                    if(!snapshot.docs.length){
                        setError('User does not exist in firebase database')
                        createUserByEmail(userEmail);
                        console.error('User does not exist in firebase database')
                return
                    } else {
                        console.log('success 1')
    
                        return {id: snapshot.docs[0].id, ...snapshot.docs[0].data()}
                    }
                })
                .then(res=>{
                    if(res){
                        authsLocalStorage(res)

                        console.log('success 2',res)
                    }else {
                        console.log('An error occured, please try again',res)
    
                        setError('An error occured, please try again')
                        setLoading(false)
                    }
                })
                .catch(error=>{
                        console.error('firebase error',error)
    
                    setLoading(false)
                    setError('An error occured, please try again')
                    return
                }
            )
            }else{
                console.log('userEmail','no user email')
    
            }
        }

        
        const authsLocalStorage = (user) => {
            try {

                if(!user.id){
                    user.id=docId;
                }
                user.password = undefined
                localStorage.setItem('twittie_user', JSON.stringify(user))
                localStorage.setItem('userEmail', JSON.stringify(userEmail))

                
    
                dispatch({
                    type: actionTypes.SET_USER,
                    user : JSON.parse(localStorage.getItem('twittie_user'))
                })
                
                setLoading(false) 
                
                //redirect ?
                history.push(`/`)

                
                
            } catch (error) {
                console.log(error)
                setLoading(false)
                return
            }
        }

        const createUserByEmail = async (userEmail) => {

            try{

                //get user from MYSQL Database
                // const response = await axios.get(`https://api.akurinuyouth.com/api/users/${userEmail} `,
                const response = await axios.get(` http://127.0.0.1:8000/api/users/${userEmail} `,
                {
                        headers: {
                          "Content-Type": "application/json",
                        },
                });
    
                const data = response.data;
                console.log("response",data)
                if(data){
                     

                
                    const docRef = await db.collection('users').add({
                        bio: '',
                        userType: '',
                        displayName: data.username,
                        email: data.email,
                        followers: [],
                        following: [],
                        joined: firebase.firestore.FieldValue.serverTimestamp(),
                        password: '',
                        photoURL: '',
                        rooms: [],
                        username: data.username,
                        verified: true,
                        wallpaper: ''
                    });
                
                    console.log("Document written with ID: ", docRef.id);
                    setDocId(docRef.id);
                
                    const docSnapshot = await docRef.get();
                    console.log("Document : ", docSnapshot);
                
                    if (docSnapshot.exists) {
                        let createdUser = docSnapshot.data()
                        createdUser.id =docRef.id
                        console.log("User data:", createdUser);

                        authsLocalStorage(createdUser);

                    } else {
                        // Document doesn't exist
                        console.log("No such document!");
                    }
                
                    
                }
                
    
            }catch(error){
                console.log("error creating user by email ",error);
            }
    
        }
        
        return () => {
            mounted = false;
        };
    }, []);


    return (
        <div className="feed">

            <h1>Loading ...</h1>
            {loading && <div className="feed__loader"><Loader /></div>}

        </div>

        
    );
};

export default SignIn;
