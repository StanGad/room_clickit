import React, { useState } from 'react';
import Scene3D from './components/Scene3D';
import './App.css';

function App() {
  const [longueur, setLongueur] = useState(10);
  const [largeur, setLargeur] = useState(6);
  const [tableDistance, setTableDistance] = useState(2);
  const [tableLongueur, setTableLongueur] = useState(2);
  const [tableLargeur, setTableLargeur] = useState(1);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div className="controls" style={{ position: 'absolute', zIndex: 2 }}>
        <div>
          <label htmlFor="longueur">
            Longueur salle:
            <input
              id="longueur"
              name="longueur"
              type="number"
              value={longueur}
              onChange={e => setLongueur(Number(e.target.value))}
              min={1}
              max={50}
            />
          </label>
          <label htmlFor="largeur" style={{ marginLeft: '10px' }}>
            Largeur salle:
            <input
              id="largeur"
              name="largeur"
              type="number"
              value={largeur}
              onChange={e => setLargeur(Number(e.target.value))}
              min={1}
              max={50}
            />
          </label>
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="tableDistance">
            Distance table:
            <input
              id="tableDistance"
              name="tableDistance"
              type="number"
              value={tableDistance}
              onChange={e => setTableDistance(Number(e.target.value))}
              min={0}
              max={largeur}
              step={0.1}
            />
          </label>
          <label htmlFor="tableLongueur" style={{ marginLeft: '10px' }}>
            Longueur table:
            <input
              id="tableLongueur"
              name="tableLongueur"
              type="number"
              value={tableLongueur}
              onChange={e => setTableLongueur(Number(e.target.value))}
              min={0.5}
              max={5}
              step={0.1}
            />
          </label>
          <label htmlFor="tableLargeur" style={{ marginLeft: '10px' }}>
            Largeur table:
            <input
              id="tableLargeur"
              name="tableLargeur"
              type="number"
              value={tableLargeur}
              onChange={e => setTableLargeur(Number(e.target.value))}
              min={0.5}
              max={5}
              step={0.1}
            />
          </label>
        </div>
      </div>
      <Scene3D 
        longueur={longueur}
        largeur={largeur}
        tableDistance={tableDistance}
        tableLongueur={tableLongueur}
        tableLargeur={tableLargeur}
      />
    </div>
  );
}

export default App;