import React, { useEffect } from 'react';
import * as THREE from 'three';

const Room3D = ({ scene, longueur, largeur }) => {
  useEffect(() => {
    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(longueur, largeur),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(longueur/2, 0, largeur/2);
    scene.add(floor);

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(longueur, 3, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    backWall.position.set(longueur/2, 1.5, 0);
    scene.add(backWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3, largeur),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    rightWall.position.set(longueur, 1.5, largeur/2);
    scene.add(rightWall);

    return () => {
      scene.remove(floor);
      scene.remove(backWall);
      scene.remove(rightWall);
    };
  }, [scene, longueur, largeur]);

  return null;
};

export default Room3D;