import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
import '../css/EditCar.css';

const EditCar = () => {
  const [car, setCar] = useState({
    id: 0,
    name: '',
    wheels: '',
    exterior: '',
    interior: '',
    roof: '',
    totalcost: '',
  });

  const [wheelsOptions, setWheelsOptions] = useState([]);
  const [exteriorOptions, setExteriorOptions] = useState([]);
  const [interiorOptions, setInteriorOptions] = useState([]);
  const [roofOptions, setRoofOptions] = useState([]);



  const { id } = useParams();

  // Fetch the current car info
  useEffect(() => {
    const getCurrentCar = async () => {
      const res = await fetch(`http://localhost:3001/cars/${id}`);
      const data = await res.json();
      setCar(Array.isArray(data) ? data[0] : data);
    };
    getCurrentCar();
  }, [id]);

  // Fetch dropdown options
  useEffect(() => {
    const getSpecs = async () => {
      try {
        const wRes = await fetch(`http://localhost:3001/items?category=Wheels`);
        const wData = await wRes.json();
        setWheelsOptions(Array.isArray(wData) ? wData : []);

        const eRes = await fetch(`http://localhost:3001/items?category=Exterior`);
        const eData = await eRes.json();
        setExteriorOptions(Array.isArray(eData) ? eData : []);

        const iRes = await fetch(`http://localhost:3001/items?category=Interior`);
        const iData = await iRes.json();
        setInteriorOptions(Array.isArray(iData) ? iData : []);

        const rRes = await fetch(`http://localhost:3001/items?category=Roof`);
        const rData = await rRes.json();
        setRoofOptions(Array.isArray(rData) ? rData : []);
      } catch (err) {
        console.error('Failed to load specs:', err);
      }
    };
    getSpecs();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateCar = async (event) => {
    event.preventDefault();
  
    const form = event.currentTarget;
  
    const wheelOption = form.wheels.options[form.wheels.selectedIndex];
    const exteriorOption = form.exterior.options[form.exterior.selectedIndex];
    const interiorOption = form.interior.options[form.interior.selectedIndex];
    const roofOption = form.roof.options[form.roof.selectedIndex];
  
    const totalcost =
      Number(wheelOption.dataset.pricepoint || 0) +
      Number(exteriorOption.dataset.pricepoint || 0) +
      Number(interiorOption.dataset.pricepoint || 0) +
      Number(roofOption.dataset.pricepoint || 0);
  
    const updatedCar = {
      ...car,
      totalcost: totalcost,
    };
  
    try {
      await fetch(`http://localhost:3001/cars/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCar),
      });
  
      window.location = '/customcars';
    } catch (err) {
      console.error('Error updating car:', err);
    }
  };
  

  const deleteCar = async (event) => {
    event.preventDefault();
    await fetch(`http://localhost:3001/cars/${id}`, {
      method: 'DELETE',
    });
    window.location = '/customcars';
  };

  return (
    <div className='EditCar'>
      <form onSubmit={updateCar}>
        <label>Name</label><br />
        <input
          type='text'
          id='name'
          name='name'
          value={car.name || ''}
          onChange={handleChange}
        /><br /><br />

        {/* Wheels Dropdown */}
        <label>Wheels</label><br />
        <select id='wheels' name='wheels' value={car.wheels || ''} onChange={handleChange}>
        <option value=''>Select wheels</option>
        {wheelsOptions.map((opt) => (
            <option key={opt.id} value={opt.name} data-pricepoint={opt.pricepoint}>
            {opt.name} {opt.pricepoint ? `(+${opt.pricepoint})` : ''}
            </option>
        ))}
        </select><br /><br />

        {/* Exterior Dropdown */}
        <label>Exterior</label><br />
        <select id='exterior' name='exterior' value={car.exterior || ''} onChange={handleChange}>
        <option value=''>Select exterior</option>
        {exteriorOptions.map((opt) => (
            <option key={opt.id} value={opt.name} data-pricepoint={opt.pricepoint}>
            {opt.name} {opt.pricepoint ? `(+${opt.pricepoint})` : ''}
            </option>
        ))}
        </select><br /><br />

        {/* Interior Dropdown */}
        <label>Interior</label><br />
        <select id='interior' name='interior' value={car.interior || ''} onChange={handleChange}>
        <option value=''>Select interior</option>
        {interiorOptions.map((opt) => (
            <option key={opt.id} value={opt.name} data-pricepoint={opt.pricepoint}>
            {opt.name} {opt.pricepoint ? `(+${opt.pricepoint})` : ''}
            </option>
        ))}
        </select><br /><br />

        {/* Roof Dropdown */}
        <label>Roof</label><br />
        <select id='roof' name='roof' value={car.roof || ''} onChange={handleChange}>
        <option value=''>Select roof</option>
        {roofOptions.map((opt) => (
            <option key={opt.id} value={opt.name} data-pricepoint={opt.pricepoint}>
            {opt.name} {opt.pricepoint ? `(+${opt.pricepoint})` : ''}
            </option>
        ))}
        </select><br /><br />

        {/* Total Cost (read-only) */}
        <label>Total Cost</label><br />
        <input
          type='text'
          id='totalcost'
          name='totalcost'
          value={car.totalcost || ''}
          readOnly
        /><br /><br />

        <input
        className='submitButton'
        type='submit'
        value='Submit'
        />
        <button className='deleteButton' onClick={deleteCar}>Delete</button>
      </form>
    </div>
  );
};

export default EditCar;
