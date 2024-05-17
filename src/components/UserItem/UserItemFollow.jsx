import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import {Avatar, Button } from '@material-ui/core'
import './UserItemFollow.css'
import { useStateValue } from '../../contexts/StateContextProvider'
import {follow, unfollow} from '../../server/serverActions'

// const UserItemFollow = ({display}) => {
const UserItemFollow = ({ display, setUserAsAdmin, setUserAsRegular }) => {
    const [{user}, dispatch] = useStateValue()
    const [isFollowing, setIsFollowing] = useState(false)

    const handleSetAdmin = () => {
        setUserAsAdmin(display.id);
    };

    const handleSetRegular = () => {
        setUserAsRegular(display.id);
    };

    return (
    <>
    
        {user.userType != 'admin' && (
                <div className="userItemFollow--user__item">
                        <Link to={display ? `/profile/${display.username}` : `/notfound`}><Avatar src={display && display.photoURL}/></Link>
                        <div className="userItemFollow--user__details">
                            <h2>{display ? display.displayName: 'Empty Room'}</h2>
                            <span>{display && `@${display.username}`}</span>
                        </div>
                <Button  onClick={()=>follow(user.id, display.id)}>Follow </Button> 

                </div>        
        )}


        {user.userType === 'admin' && (

            <div className="userItemFollow--user__item">
            <Avatar src={display && display.photoURL} />

            <div className="userItemFollow--user__details">
                <h2>{display ? display.displayName : 'Empty Room'}</h2>
                <span>{display && `@${display.username}`}</span>
            </div>

            {display.userType === 'admin' ? (
                <Button onClick={handleSetRegular}>Remove Admin</Button>
            ) : (
                <Button onClick={handleSetAdmin}>Set Admin</Button>
            )}
            </div>
        )}


    </>

    )
}

export default UserItemFollow
