import React, { useState } from 'react'
import   './AnnouncementStories.css'
import { Announcement } from '@material-ui/icons';
import AnnouncementStory from '../AnnouncementStory/AnnouncementStory';


const AFBStory = ({posts}) => {
  const [currentActive, setCurrentActive] = useState(0);

  const allStories = [
    {
      id: 0,
      author: "Luna Belle",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 1,
      author: "Willow Grace",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 2,
      author: "Emma Smith",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 3,
      author: "Ruby Skye",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 4,
      author: "Live Blogger",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 5,
      author: "Hazel Jade",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 6,
      author: "Eden Faith",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 7,
      author: "Flora Maeve",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 8,
      author: "Nathaniel Hayes",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 9,
      author: "Everett Lee",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 9,
      author: "Owen",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 9,
      author: "Caleb Knox",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    },
    {
      id: 9,
      author: "Felix",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    }
  ];

  const showFullView = (index) => {
    setCurrentActive(index);
  };

  const updateFullView = () => {
    // Update full view logic here
  };

  const nextBtnFullClick = () => {
    if (currentActive >= posts.length - 1) {
      return;
    }
    setCurrentActive(currentActive + 1);
    updateFullView();
  };

  const previousBtnFullClick = () => {
    if (currentActive <= 0) {
      return;
    }
    setCurrentActive(currentActive - 1);
    updateFullView();
  };

  return (
    <>
      <div className="stories-container">
        <div className="content">
          <div className="previous-btn">
            {/* Previous button SVG */}
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          </div>
          <div className="stories">
       

            {posts.map(post => (
                <AnnouncementStory key={post.id}
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
            ))}


          </div>

          <div className="next-btn active" onClick={nextBtnFullClick}>
            {/* Next button SVG */}
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          </div>
        </div>
      </div>

      {/* <div className="stories-full-view">
        <div className="close-btn">

          <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>

        </div>
        <div className="content">
          <div className="previous-btn" onClick={previousBtnFullClick}>

            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>

          </div>
          <div className="story">
            <img src={allStories[currentActive].imageUrl} alt="" />
            <div className="author">{allStories[currentActive].author}</div>
          </div>
          <div className="next-btn" onClick={nextBtnFullClick}>
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>

          </div>
        </div>
      </div> */}

    </>
  );
};

export default AFBStory;
