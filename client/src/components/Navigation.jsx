import { useState, useEffect } from 'react';
import '../App.css';
import '../css/Navigation.css';

const fmtUSD = (v) => {
  if (typeof v === 'number') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
  if (v == null) return '';
  // if it's a string like "$1,200", just return as-is; if it's "1200", pretty-print it
  const digits = String(v).replace(/[^\d.-]/g, '');
  return digits && digits !== String(v)
    ? String(v) // already has symbols/commas
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(digits || 0));
};

const Navigation = () => {
  const [wheels, setWheels] = useState([]);
  const [exterior, setExterior] = useState([]);
  const [interior, setInterior] = useState([]);
  const [roof, setRoof] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <nav className="nav">
      <ul className="nav-left">
        <li><h1>Bolt Bucket 🏎️</h1></li>
      </ul>

      <ul className="nav-right">
        <li className="popdown">
          <details>
            <summary className="btn">Customize</summary>
            <div className="popdown-panel">
              <form className="spec-form">
                <div className="row">
                  <label>
                    Car name
                    <input name="name" type="text" placeholder="e.g., Midnight Runner" required />
                  </label>
                </div>

                <div className="spec-grid">
                  {/* Wheels */}
                  <label>
                    Wheels
                    <select name="wheels" defaultValue="" disabled={loading}>
                      <option value="" disabled>{loading ? 'Loading…' : 'Select wheels'}</option>
                      {wheels.map((opt) => (
                        <option
                          key={opt.id ?? opt.name}
                          value={opt.id ?? opt.name}
                          data-pricepoint={opt.pricepoint}
                        >
                          {opt.name} {opt.pricepoint ? `(+${fmtUSD(opt.pricepoint)})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Exterior */}
                  <label>
                    Exterior
                    <select name="exterior" defaultValue="" disabled={loading}>
                      <option value="" disabled>{loading ? 'Loading…' : 'Select exterior'}</option>
                      {exterior.map((opt) => (
                        <option
                          key={opt.id ?? opt.name}
                          value={opt.id ?? opt.name}
                          data-pricepoint={opt.pricepoint}
                        >
                          {opt.name} {opt.pricepoint ? `(+${fmtUSD(opt.pricepoint)})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Interior */}
                  <label>
                    Interior
                    <select name="interior" defaultValue="" disabled={loading}>
                      <option value="" disabled>{loading ? 'Loading…' : 'Select interior'}</option>
                      {interior.map((opt) => (
                        <option
                          key={opt.id ?? opt.name}
                          value={opt.id ?? opt.name}
                          data-pricepoint={opt.pricepoint}
                        >
                          {opt.name} {opt.pricepoint ? `(+${fmtUSD(opt.pricepoint)})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Roof */}
                  <label>
                    Roof
                    <select name="roof" defaultValue="" disabled={loading}>
                      <option value="" disabled>{loading ? 'Loading…' : 'Select roof'}</option>
                      {roof.map((opt) => (
                        <option
                          key={opt.id ?? opt.name}
                          value={opt.id ?? opt.name}
                          data-pricepoint={opt.pricepoint}
                        >
                          {opt.name} {opt.pricepoint ? `(+${fmtUSD(opt.pricepoint)})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="actions">
                  <button type="button" className="btn primary">Create</button>
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
