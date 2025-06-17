import React, { useState } from 'react';
import Scene3D from './components/Scene3D';
import './App.css';

function App() {
  const [longueur, setLongueur] = useState(10);
  const [largeur, setLargeur] = useState(6);
  const [tableDistance, setTableDistance] = useState(2);
  const [tableLongueur, setTableLongueur] = useState(2);  // Ajouté
  const [tableLargeur, setTableLargeur] = useState(1);    // Ajouté

  return (
    <>
      <div className="controls">
        <div>
          <label>
            Longueur salle (m):
            <input
              type="number"
              value={longueur}
              onChange={e => setLongueur(Number(e.target.value))}
              min={2}
              max={15}
              step={0.1}
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Largeur salle (m):
            <input
              type="number"
              value={largeur}
              onChange={e => setLargeur(Number(e.target.value))}
              min={2}
              max={15}
              step={0.1}
            />
          </label>
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>
            Distance table (m):
            <input
              type="number"
              value={tableDistance}
              onChange={e => setTableDistance(Number(e.target.value))}
              min={0.5}
              max={largeur - 1}
              step={0.1}
            />
          </label>
          {/* Ajout des contrôles de dimensions de la table */}
          <label style={{ marginLeft: '10px' }}>
            Longueur table (m):
            <input
              type="number"
              value={tableLongueur}
              onChange={e => setTableLongueur(Number(e.target.value))}
              min={0.6}  // Minimum raisonnable pour une table
              max={3}    // Maximum raisonnable
              step={0.1}
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Largeur table (m):
            <input
              type="number"
              value={tableLargeur}
              onChange={e => setTableLargeur(Number(e.target.value))}
              min={0.4}  // Minimum raisonnable
              max={1.5}  // Maximum raisonnable
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
    </>
  );
}

export default App;