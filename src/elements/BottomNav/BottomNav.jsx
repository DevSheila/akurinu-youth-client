import React from 'react'
import {NavLink} from 'react-router-dom'
import {useHistory} from 'react-router'
import HomeIcon from '@material-ui/icons/Home'
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import './BottomNav.css'
import { useStateValue } from '../../contexts/StateContextProvider'

const BottomNav = () => {
  const [{user}] = useStateValue()
  const history = useHistory()

  const signout = () => {
    localStorage.clear()
    // window.location.push('/')
    history.push('/')
    window.location.reload()
}
  const text="profile";
  const profileLink = `${text.toLowerCase()}/${user.username}`;  

  return (
    <div className="bottomNav">
       <nav>
          <NavLink exact to='/' activeClassName='bottomNav__active'><HomeIcon /><h2 className="bottomNav__text">Home</h2></NavLink>
          <NavLink to={`/${profileLink}`} activeClassName='bottomNav__active'><PermIdentityIcon /><h2 className="bottomNav__text">Profile</h2></NavLink>
          <a href="https://akurinuyouth.com/portal" activeClassName='bottomNav__active' target='_blank' rel='noopener noreferrer'><PanoramaFishEyeIcon /> <h2 className="bottomNav__text">Portal</h2></a>
          {/* <div onClick={signout} activeClassName='bottomNav__active'><PowerSettingsNewIcon /></div> */}
       
       </nav>
    </div>
  )
}

export default BottomNav
