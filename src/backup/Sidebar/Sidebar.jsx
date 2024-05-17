import React, { useState } from 'react'
import TwitterIcon from '@material-ui/icons/Twitter'
import SidebarOption from '../SidebarOption/SidebarOption'
import SidebarAccount from '../SidebarAccount/SidebarAccount'
import HomeIcon from '@material-ui/icons/Home'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import ListAltIcon from '@material-ui/icons/ListAlt'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

import Person from '@material-ui/icons/Person' 
import Menu from '@material-ui/icons/Menu' 
import Description from '@material-ui/icons/Description' 
import Visibility from '@material-ui/icons/Visibility' 
import LibraryBooks from '@material-ui/icons/LibraryBooks' 
import ViewModule from '@material-ui/icons/ViewModule' 
import People from '@material-ui/icons/People' 

import {useRoomState} from '../../contexts/IsRoomOpenedContextProvider'
import {actionTypes} from '../../contexts/IsRoomOpenedReducers'
import './Sidebar.css'
import { Dashboard } from '@material-ui/icons'

const Sidebar = () => {
    
    const [{isRoomOpened}, dispatch] = useRoomState()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const closeAllRooms= () => {
        dispatch({
            type: actionTypes.CLOSING_ROOM,  
        })
        if(isRoomOpened){}        
    }

    return (
        <div className='sidebar'>

            {/* <div className="sidebar__header">
            <img src="/akurinuyouth-logo.jpg" className='sidebar__logo'/>
            <h2 className="sidebar__headerTitle"> AYC Portal</h2>
            </div>
            <div className="sidebar__hamburger" onClick={toggleSidebar}>
                <Menu/>
            </div> */}
           <SidebarOption text='Dashboard' Icon={Dashboard} />
           <SidebarOption text='Profile' Icon={Person} />
           <SidebarOption text='Resume' Icon={LibraryBooks} />
           <SidebarOption text='Job Listing' Icon={Description} />
           <SidebarOption text='Viewed Jobs' Icon={Visibility} />

           <SidebarOption text='Community' Icon={People} />
           <SidebarOption text='My Posts' Icon={ListAltIcon} />



           {/* <button variant='outlined' className='sidebar__tweet'>
              <div dir="auto" 
              className="css-901oao r-1awozwy r-jwli3a r-6koalj r-18u37iz r-16y2uox r-1qd0xha r-a023e6 r-vw2c0b r-1777fci r-eljoum r-dnmrzs r-bcqeeo r-q4m81j r-qvutc0">
                <svg viewBox="0 0 24 24" fill='#ffffff' className="r-jwli3a r-4qtqp9 r-yyyyoo r-1q142lx r-50lct3 r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1srniue"><g><path d="M8.8 7.2H5.6V3.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v3.3H.8c-.4 0-.8.3-.8.8s.3.8.8.8h3.3v3.3c0 .4.3.8.8.8s.8-.3.8-.8V8.7H9c.4 0 .8-.3.8-.8s-.5-.7-1-.7zm15-4.9v-.1h-.1c-.1 0-9.2 1.2-14.4 11.7-3.8 7.6-3.6 9.9-3.3 9.9.3.1 3.4-6.5 6.7-9.2 5.2-1.1 6.6-3.6 6.6-3.6s-1.5.2-2.1.2c-.8 0-1.4-.2-1.7-.3 1.3-1.2 2.4-1.5 3.5-1.7.9-.2 1.8-.4 3-1.2 2.2-1.6 1.9-5.5 1.8-5.7z"></path></g></svg>
              <span className="css-901oao css-16my406 css-bfa6kz r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0"></span>
              
              </div>
              <span>Post</span>
           </button> */}

           <SidebarAccount />
           
        </div>
    )
}

export default Sidebar
