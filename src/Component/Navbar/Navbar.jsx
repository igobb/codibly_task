import React from 'react';
import './Navbar.scss'

import { images } from '../../Constans/index'

function Navbar() {
    return (
        <div className="app__navbar">
            <div className="app__navbar-logo">
                <img src={images.logo} alt="logo"/>
            </div>
            <nav className="app__navbar-items">
                <ul>
                    {['Home', 'About', 'Contact'].map((item) => (
                        <li key={item} className="app__navbar_item">
                            <a href={`#${item}`}>{item}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;