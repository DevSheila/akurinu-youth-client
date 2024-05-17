import React from 'react'
import './SideNavigationBar.css'
import Person from '@material-ui/icons/Person' 
import Description from '@material-ui/icons/Description' 
import Visibility from '@material-ui/icons/Visibility' 
import LibraryBooks from '@material-ui/icons/LibraryBooks' 
import ViewModule from '@material-ui/icons/ViewModule' 
import Diversity2 from '@material-ui/icons/People' 
import { useStateValue } from '../../contexts/StateContextProvider'



function SideNavigationBar() {
    const [{user}] = useStateValue()
    const {displayName} = user
  return (
    <>
    



        <div class="sidebar">
        <div class="header">
            <h1>AYC Portal</h1>
        </div>

        <div class="user-profile">
            <img src="https://www.svgrepo.com/show/382100/female-avatar-girl-face-woman-user-7.svg" alt="User Profile" />
            <h1>{displayName}</h1>
        </div>


            <a href="https://akurinuyouth.com/portal/" target="_blank"> <ViewModule/> Dashboard</a>
            <a href="https://akurinuyouth.com/portal/" target="_blank">  <Person/> Profile</a>
            <a href="https://akurinuyouth.com/portal/" target="_blank"> <LibraryBooks/> Resume</a>
            <a href="https://akurinuyouth.com/portal/" target="_blank"> <Description/> Job Listing</a>
            <a href="https://akurinuyouth.com/portal/" target="_blank"> <Visibility/> Viewed Jobs</a>
            <a href="https://akurinuyouth.com/portal/" target="_blank"><Diversity2/> Community</a>
            
        </div>

        

    </>
  )
}

export default SideNavigationBar
