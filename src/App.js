import React, { useState } from 'react';
import Scene3D from './components/Scene3D.jsx';
import RoomControls from './components/controls/RoomControls';
import TableControls from './components/controls/TableControls';
import './App.css';

function App() {
  const [longueur, setLongueur] = useState(10);
  const [largeur, setLargeur] = useState(6);
  const [tableDistance, setTableDistance] = useState(2);
  const [tableLongueur, setTableLongueur] = useState(2);
  const [tableLargeur, setTableLargeur] = useState(1);

  return (
    <div>
      <div className="controls">
        <RoomControls 
          longueur={longueur} 
          setLongueur={setLongueur}
          largeur={largeur}
          setLargeur={setLargeur}
        />
        <TableControls 
          tableDistance={tableDistance}
          setTableDistance={setTableDistance}
          tableLongueur={tableLongueur}
          setTableLongueur={setTableLongueur}
          tableLargeur={tableLargeur}
          setTableLargeur={setTableLargeur}
          maxDistance={largeur}
        />
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