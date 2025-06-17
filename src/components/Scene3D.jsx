import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Scene3D = ({ 
  longueur = 10, 
  largeur = 6, 
  tableDistance = 2,
  tableLongueur = 2,
  tableLargeur = 1 
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const frameIdRef = useRef();
  // Ajout des refs pour sauvegarder la position de la caméra
  const cameraPositionRef = useRef({ x: 15, y: 10, z: 15 });
  const controlsTargetRef = useRef({ x: longueur/2, y: 0, z: largeur/2 });

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = sceneRef.current;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      canvas: mountRef.current
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Camera setup - utiliser la position sauvegardée
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(
      cameraPositionRef.current.x,
      cameraPositionRef.current.y,
      cameraPositionRef.current.z
    );
    cameraRef.current = camera;

    // Controls setup - utiliser la target sauvegardée
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.target.set(
      controlsTargetRef.current.x,
      controlsTargetRef.current.y,
      controlsTargetRef.current.z
    );
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

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

    // Table
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(tableLongueur, 0.8, tableLargeur),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    table.position.set(longueur/2, 0.4, tableDistance + tableLargeur/2);
    scene.add(table);

    // Animation loop avec sauvegarde de la position
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      
      // Sauvegarder la position actuelle de la caméra
      cameraPositionRef.current = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      };
      
      // Sauvegarder la target des controls
      controlsTargetRef.current = {
        x: controls.target.x,
        y: controls.target.y,
        z: controls.target.z
      };
      
      renderer.render(scene, camera);
    };
    animate();

    // Prevent context menu
    renderer.domElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.removeEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
    };
  }, []);

  // Ajout d'un nouveau useEffect pour gérer les mises à jour des dimensions
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;

    // Nettoyer les objets existants (sauf lumières)
    scene.children = scene.children.filter(child => 
      child instanceof THREE.Light || child instanceof THREE.DirectionalLight
    );

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(longueur, largeur),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(longueur/2, 0, largeur/2);
    scene.add(floor);

    // Back wall (mur du fond)
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3, largeur),  // dimensions inversées
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    backWall.position.set(0, 1.5, largeur/2);  // position du mur du fond
    scene.add(backWall);

    // Right wall (mur de droite)
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(longueur, 3, 0.2),  // dimensions inversées
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    rightWall.position.set(longueur/2, 1.5, 0);  // position du mur de droite
    scene.add(rightWall);

    // Table (maintenant par rapport au mur du fond)
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(tableLongueur, 0.8, tableLargeur),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    table.position.set(
      tableDistance + tableLongueur/2,  // distance depuis le mur du fond
      0.4,                              // hauteur fixe
      largeur/2                         // centrée sur la largeur
    );
    scene.add(table);

  }, [longueur, largeur, tableDistance, tableLongueur, tableLargeur]);

  return (
    <canvas
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        touchAction: 'none'
      }}
    />
  );
};

export default Scene3D;