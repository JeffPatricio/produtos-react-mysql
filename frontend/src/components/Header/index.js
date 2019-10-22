import React from 'react';

const Header = ({ title }) => (
    <header>
        <img src={require('./logo.jpeg')} />
        <h1 className="font-weight-bold" >
            {title ? title : "Products"}
        </h1>
    </header>
);

export default Header;