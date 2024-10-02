import React from 'react';
import '../styles/CardComponent.css'; // 確保引入樣式

const CardComponent = ({ title, value }) => {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
};

export default CardComponent;
