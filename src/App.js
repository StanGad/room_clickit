import React, { useState } from 'react';
import Box3D from './components/Box3D';

function App() {
  const [longueur, setLongueur] = useState(10);
  const [largeur, setLargeur] = useState(6);

  return (
    <div>
      <div style={{ position: 'absolute', zIndex: 1, padding: 10 }}>
        <label>
          Longueur :
          <input
            type="number"
            value={longueur}
            onChange={e => setLongueur(Number(e.target.value))}
            min={1}
            max={50}
          />
        </label>
        <label style={{ marginLeft: 10 }}>
          Largeur :
          <input
            type="number"
            value={largeur}
            onChange={e => setLargeur(Number(e.target.value))}
            min={1}
            max={50}
          />
        </label>
      </div>
      <Box3D longueur={longueur} largeur={largeur} />
    </div>
  );
}

export default App;