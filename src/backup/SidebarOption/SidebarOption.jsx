import React from 'react';
import { NavLink } from 'react-router-dom';
import './SidebarOption.css';
import { useStateValue } from '../../contexts/StateContextProvider';

const SidebarOptions = ({ active, text, Icon, onClick }) => {
    const [{ user }] = useStateValue();

    const isCommunity = text === 'Community';
    const isProfile = text === 'My Posts';
    // 
    
    let redirect = '';
    if (isCommunity) {
        redirect = '';
    } else if (isProfile) {
        redirect = `/profile/${user.username}`;
    } else if (text === 'Dashboard') {
        redirect = 'https://akurinuyouth.com/portal/ayc_user/ayc_dashboard'; // Replace with actual dashboard link
    } else if (text === 'Profile') {
        redirect = 'https://akurinuyouth.com/portal/ayc_user/profile.php'; // Replace with actual resume link
    } else if (text === 'Resume') {
        redirect = 'https://akurinuyouth.com/portal/ayc_user/resume.php'; // Replace with actual resume link
    } else if (text === 'Job Listing') {
        redirect = 'https://akurinuyouth.com/portal/ayc_user/ayc_appliedjobs.php'; // Replace with actual jobs link
    } else if (text === 'Viewed Jobs') {
        redirect = 'https://akurinuyouth.com/portal/ayc_user/ayc_search_job.php'; // Replace with actual posts link
    } else {
        // For any other option, you can have a default redirect link
        redirect = 'https://akurinuyouth.com'; // Replace with default external link
    }

    return (
        <>
            {isCommunity ? (
                <NavLink
                    to={redirect}
                    exact={true}
                    className='sidebarOption'
                    activeClassName='sidebar__active'
                    onClick={onClick}
                >
                    <Icon />
                    <h2>{text}</h2>
                </NavLink>
            ) : (
                <a
                    href={redirect}
                    className='sidebarOption'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Icon />
                    <h2>{text}</h2>
                </a>
            )}
        </>
    );
};

export default SidebarOptions;
