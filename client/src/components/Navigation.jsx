import { useState, useEffect, useRef } from 'react';
import '../App.css';
import '../css/Navigation.css';

const fmtUSD = (v) => {
  if (typeof v === 'number') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
  if (v == null) return '';
  const digits = String(v).replace(/[^\d.-]/g, '');
  return digits && digits !== String(v)
    ? String(v)
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(digits || 0));
};

const Navigation = () => {
  const [wheels, setWheels] = useState([]);
  const [exterior, setExterior] = useState([]);
  const [interior, setInterior] = useState([]);
  const [roof, setRoof] = useState([]);
  const [loading, setLoading] = useState(true);

  const formRef = useRef(null);
  const detailsRef = useRef(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getSpecs = async () => {
      try {
        const wheelRes = await fetch(`http://localhost:3001/items?category=Wheels`);
        const wheelData = await wheelRes.json();
        setWheels(Array.isArray(wheelData) ? wheelData : []);

        const exteriorRes = await fetch(`http://localhost:3001/items?category=Exterior`);
        const exteriorData = await exteriorRes.json();
        setExterior(Array.isArray(exteriorData) ? exteriorData : []);

        const interiorRes = await fetch(`http://localhost:3001/items?category=Interior`);
        const interiorData = await interiorRes.json();
        setInterior(Array.isArray(interiorData) ? interiorData : []);

        const roofRes = await fetch(`http://localhost:3001/items?category=Roof`);
        const roofData = await roofRes.json();
        setRoof(Array.isArray(roofData) ? roofData : []);
      } catch (err) {
        console.error('Failed to load specs:', err);
      } finally {
        setLoading(false);
      }
    };
    getSpecs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    const form = formRef.current;
    if (!form) return;

    const wheelOption = form.wheels.options[form.wheels.selectedIndex];
    const exteriorOption = form.exterior.options[form.exterior.selectedIndex];
    const interiorOption = form.interior.options[form.interior.selectedIndex];
    const roofOption = form.roof.options[form.roof.selectedIndex];

    const totalcost =
    Number(wheelOption.dataset.pricepoint || 0) +
    Number(exteriorOption.dataset.pricepoint || 0) +
    Number(interiorOption.dataset.pricepoint || 0) +
    Number(roofOption.dataset.pricepoint || 0);


    const payload = {
      name: form.name.value.trim(),
      wheels: form.wheels.value,
      exterior: form.exterior.value,
      interior: form.interior.value,
      roof: form.roof.value,
      totalcost: totalcost
    };

    if (!payload.name || !payload.wheels || !payload.exterior || !payload.interior || !payload.roof) {
      return setError('Please complete all fields.');
    }

    try {
      setPosting(true);
      const res = await fetch('http://localhost:3001/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }

      form.reset();
      if (detailsRef.current) detailsRef.current.open = false;
      window.location = '/customcars';
    } catch (err) {
      console.error('Create failed:', err);
      setError('Failed to create car.');
    } finally {
      setPosting(false);
    }
  };

  

  return (
    <nav className="nav">
      <ul className="nav-left">
        <li><h1>Bolt Bucket 🏎️</h1></li>
      </ul>

      <ul className="nav-right">
        <li className="popdown">
          <details ref={detailsRef}>
            <summary className="btn">Customize</summary>
            <div className="popdown-panel">
              <form className="spec-form" ref={formRef} onSubmit={handleCreate}>
                <div className="row">
                  <label>
                    Car name
                    <input name="name" type="text" placeholder="e.g., Midnight Runner" required />
                  </label>
                </div>

                <div className="spec-grid">
                  <label>
                    Wheels
                    <select name="wheels" defaultValue="" disabled={loading}>
                      <option value="" disabled>{loading ? 'Loading…' : 'Select wheels'}</option>
                      {wheels.map((opt) => (
                        <option key={opt.id ?? opt.name} value={opt.name} data-pricepoint={opt.pricepoint}>
                          {opt.name} {opt.pricepoint ? `(+${fmtUSD(opt.pricepoint)})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Exterior
                    <select name="exterior" defaultValue="" disabled={loading}>
                      <option value="" disabled>{loading ? 'Loading…' : 'Select exterior'}</option>
                      {exterior.map((opt) => (
                        <option key={opt.id ?? opt.name} value={opt.name} data-pricepoint={opt.pricepoint}>
                          {opt.name} {opt.pricepoint ? `(+${fmtUSD(opt.pricepoint)})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Interior
                    <select name="interior" defaultValue="" disabled={loading}>
                      <option value="" disabled>{loading ? 'Loading…' : 'Select interior'}</option>
                      {interior.map((opt) => (
                        <option key={opt.id ?? opt.name} value={opt.name} data-pricepoint={opt.pricepoint}>
                          {opt.name} {opt.pricepoint ? `(+${fmtUSD(opt.pricepoint)})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Roof
                    <select name="roof" defaultValue="" disabled={loading}>
                      <option value="" disabled>{loading ? 'Loading…' : 'Select roof'}</option>
                      {roof.map((opt) => (
                        <option key={opt.id ?? opt.name} value={opt.name} data-pricepoint={opt.pricepoint}>
                          {opt.name} {opt.pricepoint ? `(+${fmtUSD(opt.pricepoint)})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {error && <p style={{ color: 'tomato', marginTop: '0.5rem' }}>{error}</p>}

                <div className="actions">
                  <button type="submit" className="btn primary" disabled={posting || loading}>
                    {posting ? 'Creating…' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </details>
        </li>

        <li>
          <a href="/customcars" role="button" className="btn linkish">View Cars</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
