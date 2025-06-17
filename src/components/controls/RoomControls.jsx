import React from 'react';

const RoomControls = ({ longueur, setLongueur, largeur, setLargeur }) => {
  return (
    <div className="control-group">
      <label className="control-label">
        Longueur salle :
        <input
          className="control-input"
          type="number"
          value={longueur}
          onChange={e => setLongueur(Number(e.target.value))}
          min={1}
          max={50}
        />
      </label>
      <label className="control-label">
        Largeur salle :
        <input
          className="control-input"
          type="number"
          value={largeur}
          onChange={e => setLargeur(Number(e.target.value))}
          min={1}
          max={50}
        />
      </label>
    </div>
  );
};

export default RoomControls;