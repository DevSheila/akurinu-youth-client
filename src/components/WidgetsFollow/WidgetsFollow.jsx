import React, { useEffect, useState } from 'react';
import UserItemFollow from '../UserItem/UserItemFollow';
import './WidgetsFollow.css';

import db from '../../firebase';
import { useStateValue } from '../../contexts/StateContextProvider';

const WidgetFollow = () => {
    const [{ user }] = useStateValue();
    const [users, setUsers] = useState([]);
    const [usersNotFollowed, setUsersNotFollowed] = useState([]);

    useEffect(() => {
        let mounted = true;
        const unsubscribe = db.collection('users').limit(6).onSnapshot(snapshot => {
            if (mounted) {
                // setUsers(
                //     snapshot.docs.map(user => ({
                //         id: user.id,
                //         ...user.data(),
                //     }))
                // );

                // Assuming user.id is the ID of the current user

// Fetch all users
db.collection('users')
.get()
.then(querySnapshot => {
    const allUsers = [];
    querySnapshot.forEach(doc => {
        // Exclude the current user from the list
        if (doc.id !== user.id) {
            allUsers.push({
                id: doc.id,
                ...doc.data()
            });
        }
    });

    // Fetch users the current user is following
    db.collection('users')
        .doc(user.id)
        .get()
        .then(doc => {
            if (doc.exists) {
                const currentUserFollowing = doc.data().following || [];

                // Filter out users the current user is following
                const notFollowingUsers = allUsers.filter(user => !currentUserFollowing.includes(user.id));

                                // Shuffle the array to get random users
                                const shuffledUsers = notFollowingUsers.sort(() => 0.5 - Math.random());
                                const selectedUsers = shuffledUsers.slice(0, 8); // Limit to 10 random users
                
                                setUsersNotFollowed(selectedUsers);

                // setUsersNotFollowed(notFollowingUsers)
            } else {
                console.log('Current user document does not exist');
            }
        })
        .catch(error => {
            console.log('Error getting current user document:', error);
        });
})
.catch(error => {
    console.log('Error getting users collection:', error);
});



            }
        });

        return () => (mounted = false);
    }, []);

    const setUserAsAdmin = (userId) => {
        // Update userType in the database to 'admin'
        db.collection('users').doc(userId).update({
            userType: 'admin'
        });
    };

    const setUserAsRegular = (userId) => {
        // Update userType in the database to ''
        db.collection('users').doc(userId).update({
            userType: ''
        });
    };

    

    return (

        <div className="widgets__widgetContainer">
            <h2>Who To Follow</h2>
            <ul className='widgets__trendsContainer'>
                {usersNotFollowed && usersNotFollowed.filter(u => u.id !== user.id).map(user => {
                    return (
                        <li key={user.id}>
                            <UserItemFollow
                                display={user}
                                setUserAsAdmin={setUserAsAdmin}
                                setUserAsRegular={setUserAsRegular}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default WidgetFollow;
