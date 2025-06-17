import React, { useEffect } from 'react';
import * as THREE from 'three';

const Table3D = ({ scene, longueur, tableDistance, tableLongueur, tableLargeur }) => {
  useEffect(() => {
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(tableLongueur, 0.8, tableLargeur),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    table.position.set(longueur/2, 0.4, tableDistance);
    scene.add(table);

    return () => {
      scene.remove(table);
    };
  }, [scene, longueur, tableDistance, tableLongueur, tableLargeur]);

  return null;
};

export default Table3D;