import React, { useEffect } from 'react';
import * as THREE from 'three';

const Table3D = ({ scene, longueur, largeur, tableDistance, tableLongueur, tableLargeur }) => {
  useEffect(() => {
    if (!scene) return;

    // Nettoyage
    let tableGroup = scene.getObjectByName('tableGroup');
    if (tableGroup) {
      scene.remove(tableGroup);
      tableGroup.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }

    tableGroup = new THREE.Group();
    tableGroup.name = 'tableGroup';

    // Table
    const tableMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.5,
      metalness: 0.3
    });
    // Place la table pour que son bord avant soit à x=0 dans le groupe
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(tableLongueur, 0.74, tableLargeur),
      tableMaterial
    );
    table.position.set(tableLongueur/2, 0.37, 0); // Bord avant à x=0 dans le groupe
    table.castShadow = true;
    table.receiveShadow = true;
    tableGroup.add(table);

    // Sièges
    const seatMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x454545,
      roughness: 0.7,
      metalness: 0.2
    });
    const seatRadius = 0.2;
    const seatHeight = 0.45;
    const minSpacing = 0.7;
    const seatGeometry = new THREE.CylinderGeometry(seatRadius, seatRadius, seatHeight, 32);

    // Sièges devant et derrière (répartis de 0 à tableLongueur)
    const nbLongSeats = Math.max(1, Math.floor(tableLongueur / minSpacing));
    let longSeatXs = [];
    if (nbLongSeats === 1) {
      longSeatXs = [tableLongueur/2];
    } else {
      const spacing = (tableLongueur - minSpacing) / (nbLongSeats - 1);
      for (let i = 0; i < nbLongSeats; i++) {
        longSeatXs.push(minSpacing/2 + i * spacing);
      }
    }
    longSeatXs.forEach(x => {
      // Devant
      const frontSeat = new THREE.Mesh(seatGeometry, seatMaterial);
      frontSeat.position.set(x, 0, -tableLargeur/2 - seatRadius - 0.1);
      frontSeat.castShadow = true;
      frontSeat.receiveShadow = true;
      tableGroup.add(frontSeat);
      // Derrière
      const backSeat = new THREE.Mesh(seatGeometry, seatMaterial);
      backSeat.position.set(x, 0, tableLargeur/2 + seatRadius + 0.1);
      backSeat.castShadow = true;
      backSeat.receiveShadow = true;
      tableGroup.add(backSeat);
    });

    // Sièges côté droit (répartis de -tableLargeur/2 à +tableLargeur/2)
    const nbShortSeats = Math.max(1, Math.floor(tableLargeur / minSpacing));
    let shortSeatZs = [];
    if (nbShortSeats === 1) {
      shortSeatZs = [0];
    } else {
      const spacing = (tableLargeur - minSpacing) / (nbShortSeats - 1);
      for (let i = 0; i < nbShortSeats; i++) {
        shortSeatZs.push(-tableLargeur/2 + minSpacing/2 + i * spacing);
      }
    }
    shortSeatZs.forEach(z => {
      const seat = new THREE.Mesh(seatGeometry, seatMaterial);
      seat.position.set(tableLongueur + seatRadius + 0.1, 0, z);
      seat.castShadow = true;
      seat.receiveShadow = true;
      tableGroup.add(seat);
    });

    // --- POSITIONNEMENT FINAL ---
    // Le groupe est placé à la distance voulue du mur (bord avant de la table)
    tableGroup.position.set(tableDistance + tableLongueur/2, 0.225, largeur/2);

    scene.add(tableGroup);

    // Nettoyage au démontage
    return () => {
      scene.remove(tableGroup);
      tableGroup.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    };
  }, [scene, longueur, largeur, tableDistance, tableLongueur, tableLargeur]);

  return null;
};

export default Table3D;