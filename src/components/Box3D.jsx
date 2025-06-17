import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Box3D = ({ longueur = 10, largeur = 6 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const frameIdRef = useRef();

  useEffect(() => {
    // Setup initial scene
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(15, 10, 15);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    sceneRef.current.add(directionalLight);

    // Helper
    const axesHelper = new THREE.AxesHelper(5);
    sceneRef.current.add(axesHelper);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(sceneRef.current, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
      controls.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update room dimensions
  useEffect(() => {
    // Clear old objects
    while(sceneRef.current.children.length > 0) {
      const object = sceneRef.current.children[0];
      if (object.geometry) object.geometry.dispose();
      if (object.material) object.material.dispose();
      sceneRef.current.remove(object);
    }

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(longueur, largeur),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(longueur / 2, 0, largeur / 2);
    sceneRef.current.add(floor);

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(longueur, 3, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    backWall.position.set(longueur / 2, 1.5, 0.1);
    sceneRef.current.add(backWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3, largeur),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    rightWall.position.set(0.1, 1.5, largeur / 2);
    sceneRef.current.add(rightWall);

    // Re-add lights and helper
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    sceneRef.current.add(directionalLight);

    const axesHelper = new THREE.AxesHelper(5);
    sceneRef.current.add(axesHelper);

  }, [longueur, largeur]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    />
  );
};

export default Box3D;