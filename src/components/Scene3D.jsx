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

    // Renderer setup avec ombres activées
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      canvas: mountRef.current
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50, // FOV plus réaliste
      window.innerWidth / window.innerHeight,
      0.1,
      30
    );
    camera.position.set(
      cameraPositionRef.current.x,
      cameraPositionRef.current.y,
      cameraPositionRef.current.z
    );
    cameraRef.current = camera;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.minDistance = 1;
    controls.maxDistance = 20;
    controls.target.set(
      controlsTargetRef.current.x,
      controlsTargetRef.current.y,
      controlsTargetRef.current.z
    );
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xfff0dd, 0.7);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      
      cameraPositionRef.current = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      };
      
      controlsTargetRef.current = {
        x: controls.target.x,
        y: controls.target.y,
        z: controls.target.z
      };
      
      renderer.render(scene, camera);
    };
    animate();

    // Prevent context menu
    renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update objects
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    scene.children = scene.children.filter(child => 
      child instanceof THREE.Light || child instanceof THREE.DirectionalLight
    );

    // Materials
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x808080,
      roughness: 0.8,
      metalness: 0.2
    });

    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee,
      roughness: 0.9,
      metalness: 0.1
    });

    const tableMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.5,
      metalness: 0.3
    });

    const seatMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x454545,
      roughness: 0.7,
      metalness: 0.2
    });

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(longueur, largeur),
      floorMaterial
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(longueur/2, 0, largeur/2);
    floor.receiveShadow = true;
    scene.add(floor);

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 2.7, largeur),
      wallMaterial
    );
    backWall.position.set(0, 2.7/2, largeur/2);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(longueur, 2.7, 0.2),
      wallMaterial
    );
    rightWall.position.set(longueur/2, 2.7/2, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Table Group
    const tableGroup = new THREE.Group();

    // Table
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(tableLongueur, 0.74, tableLargeur),
      tableMaterial
    );
    table.position.y = 0.37;
    table.castShadow = true;
    table.receiveShadow = true;
    tableGroup.add(table);

    // Seats configuration
    const seatRadius = 0.2;
    const seatHeight = 0.45;
    const minSpacing = 0.7;
    const seatEdgeMargin = 0.3;

    // Calcul du nombre de sièges avec la marge et répartition naturelle
    const usableLength = tableLongueur - (2 * seatEdgeMargin);
    const longSideSeats = Math.max(2, Math.floor(usableLength / minSpacing));

    // Calcul des positions pour les sièges sur la longueur
    let longSidePositions = [];
    if (longSideSeats === 2) {
        // Pour 2 sièges, on les centre avec un espacement de 70cm
        const spacing = minSpacing;
        const startX = -spacing/2;
        longSidePositions = [startX, startX + spacing];
    } else {
        // Pour plus de sièges, répartition uniforme
        const spacing = usableLength / (longSideSeats - 1);
        for (let i = 0; i < longSideSeats; i++) {
            longSidePositions.push((-tableLongueur/2 + seatEdgeMargin) + (i * spacing));
        }
    }

    // Calcul des positions pour les sièges sur la largeur
    let shortSidePositions = [];
    const shortSideSeats = Math.floor((tableLargeur - minSpacing) / minSpacing);
    
    if (shortSideSeats === 1) {
        // Un seul siège centré
        shortSidePositions.push(0);
    } else if (shortSideSeats > 1) {
        // Plusieurs sièges répartis uniformément
        const usableWidth = tableLargeur - minSpacing;
        const spacing = usableWidth / (shortSideSeats + 1);
        for (let i = 1; i <= shortSideSeats; i++) {
            shortSidePositions.push(-tableLargeur/2 + minSpacing + (i-1) * spacing);
        }
    }

    const seatGeometry = new THREE.CylinderGeometry(seatRadius, seatRadius, seatHeight, 32);

    // Ajout des sièges sur la longueur
    longSidePositions.forEach(x => {
        // Siège avant
        const frontSeat = new THREE.Mesh(seatGeometry, seatMaterial);
        frontSeat.position.set(x, 0, -tableLargeur/2 - seatRadius - 0.1);
        frontSeat.castShadow = true;
        frontSeat.receiveShadow = true;
        tableGroup.add(frontSeat);
        
        // Siège arrière
        const backSeat = new THREE.Mesh(seatGeometry, seatMaterial);
        backSeat.position.set(x, 0, tableLargeur/2 + seatRadius + 0.1);
        backSeat.castShadow = true;
        backSeat.receiveShadow = true;
        tableGroup.add(backSeat);
    });

    // Ajout des sièges sur la largeur (côté droit uniquement)
    shortSidePositions.forEach(z => {
        const rightSeat = new THREE.Mesh(seatGeometry, seatMaterial);
        rightSeat.position.set(tableLongueur/2 + seatRadius + 0.1, 0.25, z);
        rightSeat.castShadow = true;
        rightSeat.receiveShadow = true;
        tableGroup.add(rightSeat);
    });

    // Position the entire table group
    tableGroup.position.set(
      tableDistance,  // Position depuis le mur du fond (x)
      0,         // Hauteur fixe (y)
      largeur/2      // Centré sur la largeur de la pièce (z)
    );

    scene.add(tableGroup);

    return () => {
      scene.remove(floor);
      scene.remove(backWall);
      scene.remove(rightWall);
      scene.remove(tableGroup);
    };
  }, [longueur, largeur, tableDistance, tableLongueur, tableLargeur]);

  return (
    <>
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
    </>
  );
};

export default Scene3D;