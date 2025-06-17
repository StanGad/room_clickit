import React, { useEffect } from 'react';
import * as THREE from 'three';

const Table3D = ({ scene, longueur, largeur, tableDistance, tableLongueur, tableLargeur }) => {
  useEffect(() => {
    if (!scene) return;

    const tableGroup = new THREE.Group();

    // Table
    const tableMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.5,
      metalness: 0.3
    });
    
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(tableLongueur, 0.74, tableLargeur),
      tableMaterial
    );
    table.position.y = 0.37;
    table.castShadow = true;
    table.receiveShadow = true;
    tableGroup.add(table);

    // Configuration des sièges
    const seatMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x454545,
      roughness: 0.7,
      metalness: 0.2
    });

    const seatRadius = 0.2;        // 40cm de diamètre
    const seatHeight = 0.45;       // 45cm de hauteur
    const minSpacing = 0.7;        // 70cm minimum entre sièges
    
    // Calcul du nombre optimal de sièges selon les dimensions de la table
    const longSideSeats = Math.max(2, Math.floor(tableLongueur / minSpacing));
    const shortSideSeats = Math.max(1, Math.floor(tableLargeur / minSpacing));
    
    const longSpacing = tableLongueur / (longSideSeats - 1);  // Espacement réel sur la longueur
    const shortSpacing = tableLargeur / (shortSideSeats + 1);  // Espacement réel sur la largeur

    const seatGeometry = new THREE.CylinderGeometry(seatRadius, seatRadius, seatHeight, 32);

    // Sièges sur les longueurs (avant et arrière)
    for (let i = 0; i < longSideSeats; i++) {
      const x = -tableLongueur/2 + (i * longSpacing);
      
      
      
      // Siège arrière
      const backSeat = new THREE.Mesh(seatGeometry, seatMaterial);
      backSeat.position.set(x, 0, tableLargeur/2 + seatRadius + 0.1);
      backSeat.castShadow = true;
      backSeat.receiveShadow = true;
      tableGroup.add(backSeat);
    }

    // Sièges sur les largeurs (gauche et droite)
    for (let i = 1; i <= shortSideSeats; i++) {
      const z = -tableLargeur/2 + (i * shortSpacing);
      
      // Siège gauche
      const leftSeat = new THREE.Mesh(seatGeometry, seatMaterial);
      leftSeat.position.set(-tableLongueur/2 - seatRadius - 0.1, 0, z);
      leftSeat.castShadow = true;
      leftSeat.receiveShadow = true;
      tableGroup.add(leftSeat);
      
      // Siège droit
      const rightSeat = new THREE.Mesh(seatGeometry, seatMaterial);
      rightSeat.position.set(tableLongueur/2 + seatRadius + 0.1, 0, z);
      rightSeat.castShadow = true;
      rightSeat.receiveShadow = true;
      tableGroup.add(rightSeat);
    }

    // Position finale du groupe
    tableGroup.position.set(
      tableDistance + tableLongueur/2,
      0.225,
      largeur/2
    );

    scene.add(tableGroup);

    return () => {
      tableGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      scene.remove(tableGroup);
    };
  }, [scene, longueur, largeur, tableDistance, tableLongueur, tableLargeur]);

  return null;
};

export default Table3D;