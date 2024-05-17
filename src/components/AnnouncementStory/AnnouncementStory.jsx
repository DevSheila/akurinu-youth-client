import React, {useState, forwardRef, useEffect} from 'react'
import {Avatar} from '@material-ui/core'
import {useHistory} from 'react-router'


import Popover from '@material-ui/core/Popover'
import Modal from '../../elements/Modal/Modal'
import util from '../../helpers/timeDifference'
import {convertTimestampToLocaleString} from '../../helpers/convertTimestampToLocaleString'

import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import RepeatIcon from '@material-ui/icons/Repeat'
import PublishIcon from '@material-ui/icons/Publish'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import BarChartIcon from '@material-ui/icons/BarChart'
import CodeIcon from '@material-ui/icons/Code'
import PlaceIcon from '@material-ui/icons/Place'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import BlockIcon from '@material-ui/icons/Block'
import PostAddIcon from '@material-ui/icons/PostAdd'
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import CloseIcon from '@material-ui/icons/Close'

import db from '../../firebase'
import {useStateValue} from '../../contexts/StateContextProvider'
import {like, unlike, follow, unfollow, deletePost} from '../../server/serverActions'
import Post from '../Post/Post'
import Reply from '../Reply/Reply'

const AnnouncementStory = forwardRef(({
   altText,
   text,
   image,
   timestamp,
   senderId,
   postId,
   likes
   }, ref) => {

   const history = useHistory()
   const date = convertTimestampToLocaleString(timestamp)

   const [anchorEl, setAnchorEl] = useState(null)
   const onClickExpand= (event) => setAnchorEl(event.currentTarget)
   const handleClose = () => setAnchorEl(null)
   const open = Boolean(anchorEl)
   const id = open ? 'post-popover' : undefined
   const [isOpenModal, setIsOpenModal] = useState(false)

   
   const [{user}] = useStateValue()
   const [profile, setProfile] = useState({id:'',displayName:'',userType:'', photoURL: '', verified: false, username: '', followers:[], following:[]})
   const [ownProfile, setOwnProfile] = useState(null)
   const {displayName, username, photoURL, verified,userType} = profile

   const [comments, setComments] = useState([])

   const [isFollowing, setIsFollowing] = useState(false)


   useEffect(() => {
      db.collection('users').doc(user.id).onSnapshot(snapshot=>{
         setOwnProfile({id:user.id, ...snapshot.data()})
      })
      
      db.collection('users').doc(senderId).onSnapshot(snapshot=>{
         setProfile(snapshot.data())
      })

      db.collection('posts').doc(postId).collection('comments')
         .onSnapshot(snapshot=>{
         setComments(snapshot.docs.map(comment=>({id:comment.id, ...comment.data()})))
      })

   }, [])

   useEffect(() => {
      if(profile){
         setIsFollowing(profile.followers.includes(user.id))
      }
   }, [profile])

   const callbackForModal = () => {}
   const setIsOpenParentModal = state => setIsOpenModal(state)

   const redirectToStatus = postId => history.push(`/status/${postId}`)

   
   return (
      <>
         {/* <Modal  
            open={isOpenModal} 
            onClose={()=>setIsOpenModal(false)}
            title=""
            callback = {callbackForModal}
            Icon = {CloseIcon}
            ButtonText=''
         >
            <Reply props={{
                  altText,
                  text,
                  image,
                  timestamp,
                  senderId,
                  postId,
                  likes
               }}
               profile={profile}
               ownProfile ={ownProfile}
               setIsOpenParentModal={setIsOpenParentModal}
            />


                   

         </Modal> */}


         <div className="story" onClick={()=>redirectToStatus(postId)} ref={ref}>
                <img src={image} alt="" />
                {/* <div className="author">{displayName}</div> */}
                <span className='author '> 
                          
                          
                @{`${username} . ${timestamp && util.timeDiff(date)}`}
                    </span>
              </div>

      
      </>
   )
  }
)

export default AnnouncementStory
