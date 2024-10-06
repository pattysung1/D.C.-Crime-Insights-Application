import React from 'react';
import '../styles/CardComponent.css';

const CardComponent = ({ title, value }) => {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
};

export default CardComponent;
