import React, { useEffect } from 'react'
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

    useEffect(() => {
        if(display){
           setIsFollowing(display.followers.includes(user.id))
        }
     }, [display])
  
    return (
    <>
        {user.userType != 'admin' && (
            <div>
            <Link to={display ? `/profile/${display.username}` : `/notfound`}>
                <div className="userItemFollow--user__item">
                    <Avatar src={display && display.photoURL}/>
                    <div className="userItemFollow--user__details">
                        <h2>{display ? display.displayName: 'Empty Room'}</h2>
                        <span>{display && `@${display.username}`}</span>
                    </div>
                   
                </div>        
            </Link>
                    {/* <Button  onClick={()=>follow(user.id, display.id)}>Follow </Button>  */}
                    {/* {
                    isFollowing?
                        <li onClick={()=>unfollow(user.id, senderId)}>
                            <div><PersonAddDisabledIcon /></div><h3>Unfollow {`@${username}`}</h3>
                        </li>
                    :  <li onClick={()=>follow(user.id, senderId)}>
                            <div><PersonAddIcon /></div><h3>Follow {`@${username}`}</h3>
                        </li>
                    } */}


                    {
                    isFollowing?
                    <Button  onClick={()=>follow(user.id, display.id)}>Follow </Button> 
                    :  
                    <Button  onClick={()=>unfollow(user.id, display.id)}>Unfollow </Button> 
                    }


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
