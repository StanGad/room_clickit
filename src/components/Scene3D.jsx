import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Box3D = ({ 
  longueur = 10, 
  largeur = 6, 
  tableDistance = 2,
  tableLongueur = 2,
  tableLargeur = 1
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const frameIdRef = useRef();

  // Premier useEffect pour l'initialisation
  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(15, 10, 15);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(longueur/2, 0, largeur/2);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (controls) {
        controls.dispose();
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Deuxième useEffect pour la mise à jour des objets
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    
    // Clear previous objects
    while(scene.children.length > 0) {
      const obj = scene.children[0];
      scene.remove(obj);
    }

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(longueur, largeur),
      new THREE.MeshStandardMaterial({ 
        color: 0xcccccc,
        side: THREE.DoubleSide
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(longueur/2, 0, largeur/2);
    scene.add(floor);

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(longueur, 3, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    backWall.position.set(longueur/2, 1.5, 0.1);
    scene.add(backWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3, largeur),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    rightWall.position.set(0.1, 1.5, largeur/2);
    scene.add(rightWall);

    // Table
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(tableLongueur, 0.8, tableLargeur),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    table.position.set(longueur/2, 0.4, tableDistance);
    scene.add(table);

    // Re-add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Update controls target
    if (controlsRef.current) {
      controlsRef.current.target.set(longueur/2, 0, largeur/2);
      controlsRef.current.update();
    }

  }, [longueur, largeur, tableDistance, tableLongueur, tableLargeur]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    />
  );
};

export default Box3D;