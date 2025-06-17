// src/components/Box3D.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const hauteurMur = 3;
const epaisseurMur = 0.2;

const Box3D = ({ longueur = 10, largeur = 6 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const solRef = useRef();
  const murRef = useRef();
  const murDroitRef = useRef();

  // Initialisation une seule fois
  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(longueur * 0.8, hauteurMur * 1.2, largeur * 1.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Sol
    const solGeometry = new THREE.PlaneGeometry(longueur, largeur);
    const solMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    const sol = new THREE.Mesh(solGeometry, solMaterial);
    sol.rotation.x = -Math.PI / 2;
    sol.position.set(longueur / 2, 0, largeur / 2);
    scene.add(sol);
    solRef.current = sol;

    // Mur arrière
    const murGeometry = new THREE.BoxGeometry(longueur, hauteurMur, epaisseurMur);
    const murMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const mur = new THREE.Mesh(murGeometry, murMaterial);
    mur.position.set(longueur / 2, hauteurMur / 2, epaisseurMur / 2);
    scene.add(mur);
    murRef.current = mur;

    // Mur droit
    const murDroitGeometry = new THREE.BoxGeometry(epaisseurMur, hauteurMur, largeur);
    const murDroitMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const murDroit = new THREE.Mesh(murDroitGeometry, murDroitMaterial);
    murDroit.position.set(epaisseurMur / 2, hauteurMur / 2, largeur / 2);
    scene.add(murDroit);
    murDroitRef.current = murDroit;

    // Axes helper
    scene.add(new THREE.AxesHelper(2));

    // Lumières
    scene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(10, 10, 10));
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    // Animation
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Nettoyage
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (
        mountRef.current &&
        renderer.domElement &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line
  }, []);

  // Mise à jour dynamique des géométries quand props changent
  useEffect(() => {
    // Sol
    if (solRef.current) {
      solRef.current.geometry.dispose();
      solRef.current.geometry = new THREE.PlaneGeometry(longueur, largeur);
      solRef.current.position.set(longueur / 2, 0, largeur / 2);
    }
    // Mur arrière
    if (murRef.current) {
      murRef.current.geometry.dispose();
      murRef.current.geometry = new THREE.BoxGeometry(longueur, hauteurMur, epaisseurMur);
      murRef.current.position.set(longueur / 2, hauteurMur / 2, epaisseurMur / 2);
    }
    // Mur droit
    if (murDroitRef.current) {
      murDroitRef.current.geometry.dispose();
      murDroitRef.current.geometry = new THREE.BoxGeometry(epaisseurMur, hauteurMur, largeur);
      murDroitRef.current.position.set(epaisseurMur / 2, hauteurMur / 2, largeur / 2);
    }
    // Camera
    if (cameraRef.current) {
      cameraRef.current.position.set(longueur * 0.8, hauteurMur * 1.2, largeur * 1.2);
      cameraRef.current.lookAt(0, 0, 0);
    }
    // Controls
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [longueur, largeur]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    />
  );
};

export default Box3D;
