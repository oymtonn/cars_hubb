import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Car.css';

const Car = ({ id, name, wheels, exterior, interior, roof, totalcost }) => {
  return (
    <div className="car-card">
      <h2 className="car-name">{name}</h2>
      <ul className="car-specs">
        <li><strong>Wheels:</strong> {wheels}</li>
        <li><strong>Exterior:</strong> {exterior}</li>
        <li><strong>Interior:</strong> {interior}</li>
        <li><strong>Roof:</strong> {roof}</li>
        <li><strong>Total Cost:</strong> ${totalcost}</li>
      </ul>

      <div className="actions" style={{ marginTop: '0.75rem' }}>
      <Link to={`/edit/${id}`} className="btn primary">Edit</Link>
      </div>

    </div>

    
  );
};

export default Car;
