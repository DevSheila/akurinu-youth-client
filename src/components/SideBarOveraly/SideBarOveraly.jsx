import React, { useState } from 'react';
import './SideBarOveraly.css'
const SideBarOveraly = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => {
    setIsOpen(true);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div id="mySidenav_sc" className={`sidenav__overlay ${isOpen ? 'open' : ''}`}>
        <a href="#/" className="closebtn" onClick={closeNav}>&times;</a>
        <ul>
          <li><a href="#home">HOME</a></li>
          <li><a href="#about">ABOUT US</a></li>
          <li><a href="#events">EVENTS</a></li>
          <li><a href="#sch">SCHEDULE</a></li>
          <li><a href="#team">TEAM</a></li>
          <li><a href="#gallery">GALLERY</a></li>
          <li><a href="#spons">SPONSORS</a></li>
          <li><a href="#contact">CONTACT US</a></li>
        </ul>
      </div>
      <div className="row">
        <span onClick={openNav}>&#9776;</span><br /><br /><br />
      </div>
    </>
  );
};

export default SideBarOveraly;
