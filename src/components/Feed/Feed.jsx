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
import Menu from '@material-ui/icons/Menu'


const Feed = () => {
    const [{user}] = useStateValue()
    const {displayName} = user
    const [posts, setPosts] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [following, setFollowing] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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
              <Menu/>
              </div> */}
            <img src="/akurinuyouth-logo.jpg" className='top__logo'/>

              <h2>AYC Community</h2>          
           </div>

            <div className="content">
            <Search
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={clearSearchQuery}
            />
            <TweetBox />

            {loading && <div className="feed__loader"><Loader /></div>}

            {announcements != null? <h1 style={{margin: '2rem'}}> Announcements </h1>: null }

              {/* <Announcements posts={filteredAnnouncements} /> */}
             <AFBStory posts={filteredAnnouncements} />
             
            {filteredPosts !=null && ( 
                <div className='feed__postsSection'>
                    {posts !=null ? <h1 style={{margin: '2rem'}}>Posts</h1>: null }
                    <Posts posts={filteredPosts} />
                </div>
            )}

            </div>
        </div>
    );
};

export default Feed;
