import React, { useState, useEffect } from 'react';
import TweetBox from '../TweetBox/TweetBox';
import Posts from '../Posts/Posts';
import db from '../../firebase';
import { Avatar } from '@material-ui/core';
import Loader from '../../elements/Loader/Loader';
import './Feed.css';
import Search from '../../elements/Search/Search';
import { useStateValue } from '../../contexts/StateContextProvider';
import Announcements from '../Announcements/Announcements';
import AFBStory from '../AnnouncementStories/AnnouncementStories';
import {useHistory, useParams} from 'react-router'
import { actionTypes } from '../../contexts/StateReducers';
import axios from 'axios';
import firebase from 'firebase'

const Feed = () => {
  const [{user}, dispatch] = useStateValue()
  if(!user){
    window.location.href = 'https://akurinuyouth.com/portal/';

  }

    const {displayName} = user
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

        if(!user){
            window.location.href = 'https://akurinuyouth.com/portal/';

        }

    }, []);


    useEffect(() => {
        let mounted = true;
        const unsubscribe = db.collection('users').doc(user.id).onSnapshot(snapshot => {
            if (mounted) {
                setProfile(snapshot.data());
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [user.id]);
    


 
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

                        
    
                    } else {
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

        function getPosts(){
            db.collection('posts')
            .orderBy('timestamp', 'desc')
            .onSnapshot(
                snapshot => {
                    if (mounted) {
                        if (snapshot.empty) {
                            setLoading(false);
                            return;
                        }
                        const postsData = snapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(post => post.postType === "post"); 

                        setPosts(postsData)
                        setFilteredPosts(postsData)

                        const announcementsData = snapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(post => post.postType === "announcement"); //announcement

                        setAnnouncements(announcementsData)
                        setFilteredAnnouncements(announcementsData)

                        // setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                        // setFilteredPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                        setLoading(false);
                    }
                },
                error => {
                    console.log(error);
                }
            );

        }
        
        const authsLocalStorage = (user) => {
            try {

                if(!user.id){
                    user.id=docId;
                }
                user.password = undefined
                localStorage.setItem('twittie_user', JSON.stringify(user))
                localStorage.setItem('userEmail', JSON.stringify(userEmail))

                
                getPosts()
    
                dispatch({
                    type: actionTypes.SET_USER,
                    user : JSON.parse(localStorage.getItem('twittie_user'))
                })
                
                setLoading(false) 
                
                //redirect ?
                // history.push(`/`)
                
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

    // Filter posts based on search query
    useEffect(()=>{
      const filterPostResult = searchQuery
      ? posts.filter(post =>
        post.text && post.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : posts;
      setFilteredPosts(filterPostResult)


      const filterAnnouncementResult = searchQuery
      ? announcements.filter(announcement =>
        announcement.text && announcement.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : announcements;
      setFilteredAnnouncements(filterAnnouncementResult)

      console.log("Filtered Posts:", filteredPosts);
      console.log("Filtered Posts:", filteredAnnouncements);

    },[searchQuery])

    // Handler for search input change
    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    // Handler for clearing search query
    const clearSearchQuery = () => {
        setSearchQuery('');
    };

    
    return (
        <div className="feed">

            <div className="feed__header">
                {/* <div className="feed__header-ava">
                    <Avatar src={profile && profile.photoURL} />
                </div> */}
                <h2 
                 style={{ margin: '1rem'}}>Community</h2>
            </div>


            <Search
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={clearSearchQuery}
            />
            <TweetBox />

            {loading && <div className="feed__loader"><Loader /></div>}

            <div className='feed__annonementsSection'>
            {announcements != null? <h1 style={{margin: '2rem'}}> Announcements </h1>: null }

              {/* <Announcements posts={filteredAnnouncements} /> */}
             <AFBStory posts={filteredAnnouncements} />
            </div>

            {filteredPosts !=null && ( 
                <div className='feed__postsSection'>

                    {posts !=null ? <h1 style={{margin: '2rem'}}>Posts</h1>: null }


                <Posts posts={filteredPosts} />
                </div>
                )}

        </div>
    );
};

export default Feed;
