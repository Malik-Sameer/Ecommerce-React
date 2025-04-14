import React, { useState } from 'react';
import './HamburgerMenu.css'; // Import CSS for styling
import { Link } from 'react-router-dom';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
     const [menu, setMenu] = useState("shop")

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`hamburger-menu ${isOpen ? 'again-check' : ''}`}>
            <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <nav className={`menu ${isOpen ? 'check' : ''}`}>
                <p>SHOPPER</p>
                <ul>
                    <li onClick={()=>{setMenu("shop");setIsOpen(!isOpen)}}><Link to='/'>Shop</Link>{menu==="shop"?<hr />:<></>} </li>
                    <li onClick={()=>{setMenu("men");setIsOpen(!isOpen)}}><Link to='/mens'>Men</Link> {menu==="men"?<hr />:<></>} </li>
                    <li onClick={()=>{setMenu("women");setIsOpen(!isOpen)}}> <Link to='/womens'>Women</Link> {menu==="women"?<hr />:<></>} </li>
                    <li onClick={()=>{setMenu("kids");setIsOpen(!isOpen)}}> <Link to='/kids'>Kids</Link> {menu==="kids"?<hr />:<></>} </li>
                </ul><div className="hamburgur-login" >
                    <Link to='/login' onClick={()=>{setIsOpen(!isOpen)}}><button>Login</button></Link> 
                </div>
                </nav>
                
        </div>
    );
};

export default HamburgerMenu;