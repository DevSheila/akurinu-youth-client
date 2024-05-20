import React from 'react'
import {Link} from 'react-router-dom'
import {Avatar, Button } from '@material-ui/core'
import './UserItemFollow.css'
import { useStateValue } from '../../contexts/StateContextProvider'

// const UserItemFollow = ({display}) => {
const UserItemFollow = ({ display, setUserAsAdmin, setUserAsRegular }) => {
    const [{user}, dispatch] = useStateValue()

    const handleSetAdmin = () => {
        setUserAsAdmin(display.id);
    };

    const handleSetRegular = () => {
        setUserAsRegular(display.id);
    };
    return (
    <>
        {user.userType != 'super' && (
            <Link to={display ? `/profile/${display.username}` : `/notfound`}>
                <div className="userItemFollow--user__item">
                    <Avatar src={display && display.photoURL}/>
                    <div className="userItemFollow--user__details">
                        <h2>{display ? display.displayName: 'Empty Room'}</h2>
                        <span>{display && `@${display.username}`}</span>
                    </div>
                    <Button>Follow</Button>
                </div>        
            </Link>
        )}


        {user.userType === 'super' && (

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