import React from 'react'
import {NavLink} from 'react-router-dom'
import './SidebarOption.css'
import {useStateValue} from '../../contexts/StateContextProvider'

const SidebarOptions = ({active, text, Icon, onClick}) => {
    const [{user}] = useStateValue()

    const isHome = text === 'Home' 
    const isProfile = text === 'Profile'
    const isPortal = text === 'Portal'
    const redirect =  isHome ? '': (isProfile?`${text.toLowerCase()}/${user.username}`:text.toLowerCase())   

    return (
        <>
        {isPortal ? (
            <a
                href="https://akurinuyouth.com/portal"
                className='sidebarOption'
                target='_blank'
                rel='noopener noreferrer'
            >
                <Icon />
                <h2>{text}</h2>
            </a>
        ) : (
                <NavLink to={`/${redirect}`} exact={isHome} className='sidebarOption' activeClassName='sidebar__active' onClick={onClick} >
                <Icon />
                <h2>{text}</h2>
                </NavLink>
        )}
        </>
        
    )
}

export default SidebarOptions