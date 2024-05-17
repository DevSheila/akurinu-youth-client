import React  from 'react'
import FlipMove from 'react-flip-move'
// import Post from '../Post/Post'
// import PostCard from '../PostCard/PostCard'
import './Announcements.css'
import Announcement from '../Announcement/Announcement'


const Announcements = ({posts}) => {


    return (
        <>

            <div className="announcement-card-section">
                {
                    posts.map(post => (
                        <Announcement key={post.id}
                                postId = {post.id}
                                altText = {post.altText}
                                senderId = {post.senderId}
                                username = {post.username}
                                text = {post.text}
                                avatar = {post.avatar}
                                image = {post.image}
                                timestamp = {post.timestamp}
                                likes = {post.likes}
                    />
                    ))
                }           
            </div>
        {/* </div> */}
        </>

    )
}


export default Announcements
