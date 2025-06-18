import React from 'react';

const TableControls = ({ 
  tableDistance, 
  setTableDistance, 
  tableLongueur, 
  setTableLongueur, 
  tableLargeur, 
  setTableLargeur,
  maxDistance
}) => {
  return (
    <div className="control-group">
      <label className="control-label">
        Distance table :
        <input
          className="control-input"
          type="number"
          value={tableDistance}
          onChange={e => setTableDistance(Number(e.target.value))}
          min={0}
          max={maxDistance}
          step={0.1}
        />
      </label>
      <label className="control-label">
        Longueur table :
        <input
          className="control-input"
          type="number"
          value={tableLongueur}
          onChange={e => setTableLongueur(Number(e.target.value))}
          min={0.5}
          max={12}
          step={0.1}
        />
      </label>
      <label className="control-label">
        Largeur table :
        <input
          className="control-input"
          type="number"
          value={tableLargeur}
          onChange={e => setTableLargeur(Number(e.target.value))}
          min={0.5}
          max={10}
          step={0.1}
        />
      </label>
    </div>
  );
};

export default TableControls;