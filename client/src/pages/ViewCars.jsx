import React, { useState, useEffect } from 'react';
import '../App.css';
import Car from '../components/Car.jsx';

const ViewCars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const getAllCars = async () => {
      try {
        const res = await fetch('http://localhost:3001/cars');
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error('Error fetching cars:', err);
      }
    };

    getAllCars();
  }, []);

  return (
    <div className="car-list">
      {cars.length > 0 ? (
        cars.map((car) => (
          <Car
            key={car.id}
            id={car.id}
            name={car.name}
            wheels={car.wheels}
            exterior={car.exterior}
            interior={car.interior}
            roof={car.roof}
            totalcost={car.totalcost}
          />
        ))
      ) : (
        <p>No cars available.</p>
      )}
    </div>
  );
};

export default ViewCars;
