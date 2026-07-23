import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Zap,
  Droplet,
  Sun,
  Wind,
  Trash2,
  Building2,
  Sparkles,
  RotateCw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Focus,
  X,
  Send,
  Bot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Eye,
  Sliders,
  Layers,
  Compass,
  Map,
  UserCheck,
  Award,
  Info,
} from 'lucide-react';
import { Building, Recommendation } from '../types';

interface DigitalTwinViewProps {
  buildings: Building[];
  recommendations: Recommendation[];
  onSelectBuilding: (buildingId: string) => void;
  onApplyRecommendation: (recId: string) => void;
}

// Interactive Campus Zone / Building Definition
interface CampusZone {
  id: string;
  name: string;
  code: string;
  category: 'academic' | 'solar' | 'central' | 'hostel' | 'research';
  floors: number;
  purpose: string;
  occupancy: string;
  energyUsage: string;
  maintenanceStatus: 'Optimal' | 'Scheduled Maintenance' | 'Attention Required';
  sustainabilityScore: number;
  aiRecommendation: string;
  position3D: [number, number, number]; // Hotspot center [x,y,z]
  size3D: [number, number, number]; // [width, height, depth] for raycaster detection
  icon: string;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  buildings,
  recommendations,
  onSelectBuilding,
  onApplyRecommendation,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Selected Zone / Building state
  const [selectedZone, setSelectedZone] = useState<CampusZone | null>(null);

  // Camera Mode: 'isometric' | 'frontFacade' | 'top' | 'firstPerson'
  const [cameraMode, setCameraMode] = useState<'isometric' | 'frontFacade' | 'top' | 'firstPerson'>('frontFacade');

  // Building Health Status Filter
  const [buildingHealthStatus, setBuildingHealthStatus] = useState<'normal' | 'warning' | 'high' | 'critical'>('normal');

  // BIM Visualization Modes
  const [visualizationMode, setVisualizationMode] = useState<'realistic' | 'blueDigitalTwin' | 'blueprint' | 'wireframe' | 'structural'>('realistic');
  const [isWireframeOverlayActive, setIsWireframeOverlayActive] = useState(false);
  const [isFlyThroughActive, setIsFlyThroughActive] = useState(false);
  const [flyThroughLabel, setFlyThroughLabel] = useState('');

  // Greenie AI Side Drawer state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am Greenie AI, your LICET Digital Twin Copilot. I have loaded the accurate 3D architectural model of the LICET front facade (featuring the prominent LICET entrance portico, 3-level arched central block, terracotta horizontal bands, and rooftop solar arrays). Ask me anything about energy, solar output, or maintenance!',
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // 2D Overlay Hotspots Screen Positions
  const [screenHotspots, setScreenHotspots] = useState<
    Array<CampusZone & { screenX: number; screenY: number; visible: boolean }>
  >([]);

  // Three.js Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Definition of real LICET campus building zones based on aerial & front blueprint
  const campusZones: CampusZone[] = [
    {
      id: 'zone-front-solar',
      name: 'LICET Front Facade & Entrance Block',
      code: 'LICET-SEC-01',
      category: 'solar',
      floors: 4,
      purpose: 'Main Entrance Portico, Department of Electrical Engineering & High-Capacity Solar Generation Hub',
      occupancy: '680 / 800 Students',
      energyUsage: '142 kW Generated (100% Self-Sustaining)',
      maintenanceStatus: 'Optimal',
      sustainabilityScore: 98,
      aiRecommendation: 'Pre-cool ground floor computer labs using midday solar generation surplus.',
      position3D: [0, 2.2, 12],
      size3D: [28, 4.5, 6],
      icon: '☀',
    },
    {
      id: 'zone-central-hub',
      name: 'Central 3-Tier Arched Core & Dean Office',
      code: 'LICET-SEC-02',
      category: 'central',
      floors: 4,
      purpose: 'Administrative Center, Main Entrance Hall, Auditorium & Digital Library',
      occupancy: '420 / 500 Capacity',
      energyUsage: '65 kWh / day',
      maintenanceStatus: 'Optimal',
      sustainabilityScore: 96,
      aiRecommendation: 'Smart HVAC setpoint throttling active across Main Seminar Hall.',
      position3D: [0, 2.5, -2],
      size3D: [8, 5, 8],
      icon: '🏛️',
    },
    {
      id: 'zone-wing-cs',
      name: 'North Radial Wing (CS & AI Labs)',
      code: 'LICET-WING-A',
      category: 'academic',
      floors: 4,
      purpose: 'Computer Science, Artificial Intelligence & Data Center Labs',
      occupancy: '310 / 350 Students',
      energyUsage: '88 kWh / day',
      maintenanceStatus: 'Optimal',
      sustainabilityScore: 94,
      aiRecommendation: 'High computing load detected. HEPA filtration operating at optimal 100% exchange.',
      position3D: [0, 2.2, -12],
      size3D: [6, 4.5, 10],
      icon: '💻',
    },
    {
      id: 'zone-wing-mech',
      name: 'West Radial Wing (Mechanical & Civil)',
      code: 'LICET-WING-B',
      category: 'academic',
      floors: 4,
      purpose: 'Fluid Mechanics, Thermodynamics & Structural Engineering Workshops',
      occupancy: '290 / 350 Students',
      energyUsage: '92 kWh / day',
      maintenanceStatus: 'Optimal',
      sustainabilityScore: 92,
      aiRecommendation: 'Shift heavy fluid dynamics testing to 1 PM peak solar generation slot.',
      position3D: [-10, 2.2, -6],
      size3D: [10, 4.5, 6],
      icon: '⚙️',
    },
    {
      id: 'zone-wing-ece',
      name: 'East Radial Wing (Electronics & ECE)',
      code: 'LICET-WING-C',
      category: 'academic',
      floors: 4,
      purpose: 'VLSI Circuit Design, Robotics & Embedded Systems Research',
      occupancy: '305 / 350 Students',
      energyUsage: '76 kWh / day',
      maintenanceStatus: 'Optimal',
      sustainabilityScore: 95,
      aiRecommendation: 'Smart LED lighting motion sensors dimmed 20% in unoccupied corridors.',
      position3D: [10, 2.2, -6],
      size3D: [10, 4.5, 6],
      icon: '⚡',
    },
    {
      id: 'zone-hostel-east',
      name: 'East Residential Hostel & Dining Block',
      code: 'LICET-HST-01',
      category: 'hostel',
      floors: 4,
      purpose: 'Student Accommodations, Green Dining Hall & Biogas Plant',
      occupancy: '480 Resident Students',
      energyUsage: '54 kWh / day',
      maintenanceStatus: 'Optimal',
      sustainabilityScore: 93,
      aiRecommendation: 'Methane conversion generating 12 kWh supplementary lighting power.',
      position3D: [18, 2.2, -14],
      size3D: [10, 4.5, 10],
      icon: '🏡',
    },
  ];

  // Initialize 3D Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a1122); // Dark Navy Google Earth style
    scene.fog = new THREE.FogExp2(0x0a1122, 0.008);

    // 2. Camera - Default directly facing front elevation
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 7, 28);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 5;
    controls.maxDistance = 120;
    controls.target.set(0, 3, 12);
    controls.update();

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.6);
    dirLight.position.set(20, 40, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -35;
    dirLight.shadow.camera.right = 35;
    dirLight.shadow.camera.top = 35;
    dirLight.shadow.camera.bottom = -35;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(-30, 20, -20);
    scene.add(fillLight);

    // =========================================================
    // 3D GEOMETRIC RECONSTRUCTION OF LICET FRONT FACADE & CAMPUS
    // =========================================================
    const campusGroup = new THREE.Group();
    scene.add(campusGroup);

    // Ground Base Lawn & Soil
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.85 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    campusGroup.add(ground);

    // Grid Blueprint Overlay
    const gridHelper = new THREE.GridHelper(100, 50, 0x10b981, 0x1e293b);
    gridHelper.position.y = 0.02;
    campusGroup.add(gridHelper);

    // Asphalt Access Roads & Pathways
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });

    // Main Front Boulevard Road
    const mainRoadGeo = new THREE.PlaneGeometry(12, 50);
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.set(0, 0.05, 25);
    mainRoad.receiveShadow = true;
    campusGroup.add(mainRoad);

    // Red Brick Paved Entrance Plaza
    const plazaGeo = new THREE.PlaneGeometry(20, 10);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(0, 0.06, 16);
    plaza.receiveShadow = true;
    campusGroup.add(plaza);

    // MATERIALS FOR LICET ARCHITECTURE
    const wallWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Off-white stucco
      roughness: 0.35,
      metalness: 0.05,
    });

    const redBandMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c, // Signature Terracotta Red Horizontal Stripes
      roughness: 0.4,
    });

    const terracottaRoofMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b, // LICET Red Pitched Roof Canopy
      roughness: 0.45,
    });

    const solarPVMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Solar PV Deep Blue Glass
      roughness: 0.15,
      metalness: 0.9,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.25,
    });

    const windowGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Deep dark glass windows
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
    });

    const penthouseCyanMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Cyan/Blue utility elevator shaft
      roughness: 0.3,
    });

    // Dynamic Canvas Textures for LICET Signboard and Emblem
    const createLicetSignTexture = (text: string, subtitle?: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 512, 128);
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, 502, 118);

        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 64px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, subtitle ? 48 : 64);

        if (subtitle) {
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText(subtitle, 256, 96);
        }
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const signBoardMat = new THREE.MeshStandardMaterial({
      map: createLicetSignTexture('LICET', 'LOYOLA-ICAM COLLEGE OF ENGINEERING & TECHNOLOGY'),
      roughness: 0.2,
    });

    const emblemBoardMat = new THREE.MeshStandardMaterial({
      map: createLicetSignTexture('LICET'),
      roughness: 0.2,
    });

    // ---------------------------------------------------------
    // 1. LICET FRONT FACADE BLOCK (Detailed Reconstruction)
    // ---------------------------------------------------------
    const frontBlockGroup = new THREE.Group();
    frontBlockGroup.position.set(0, 0, 12);

    // A. Central Entrance Block (3-Story Arched Elevation)
    const centralBlockGeo = new THREE.BoxGeometry(8, 5.5, 6);
    const centralBlock = new THREE.Mesh(centralBlockGeo, wallWhiteMat);
    centralBlock.position.set(0, 2.75, 0);
    centralBlock.castShadow = true;
    centralBlock.receiveShadow = true;
    frontBlockGroup.add(centralBlock);

    // 3 Levels of Arched Balconies & Windows (3 arches per level = 9 grand arches)
    const archGlassGeo = new THREE.BoxGeometry(1.8, 1.2, 0.1);
    for (let level = 1; level <= 3; level++) {
      const yPos = level * 1.5;
      for (let col = -1; col <= 1; col++) {
        const xPos = col * 2.2;

        // Dark recessed window glass panel
        const win = new THREE.Mesh(archGlassGeo, windowGlassMat);
        win.position.set(xPos, yPos, 3.05);
        frontBlockGroup.add(win);

        // White arch frame
        const archTopGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.2, 16, 1, false, 0, Math.PI);
        const archTop = new THREE.Mesh(archTopGeo, wallWhiteMat);
        archTop.rotation.x = Math.PI / 2;
        archTop.position.set(xPos, yPos + 0.6, 3.1);
        frontBlockGroup.add(archTop);
      }
    }

    // Top Central Emblem Board
    const emblemBoardGeo = new THREE.BoxGeometry(3.5, 0.8, 0.1);
    const emblemBoard = new THREE.Mesh(emblemBoardGeo, emblemBoardMat);
    emblemBoard.position.set(0, 5.2, 3.08);
    frontBlockGroup.add(emblemBoard);

    // B. Prominent Entrance Portico Canopy & LICET Signboard
    const porticoGroup = new THREE.Group();
    porticoGroup.position.set(0, 0, 3.5);

    // 4 White Support Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 3.0, 12);
    [-2.2, 2.2].forEach((px) => {
      [1.0, 3.5].forEach((pz) => {
        const pillar = new THREE.Mesh(pillarGeo, wallWhiteMat);
        pillar.position.set(px, 1.5, pz);
        pillar.castShadow = true;
        porticoGroup.add(pillar);
      });
    });

    // Tiered Red Pitched Roof Canopy over Entrance
    const canopyRoofGeo = new THREE.ConeGeometry(3.6, 1.2, 4);
    const canopyRoof = new THREE.Mesh(canopyRoofGeo, terracottaRoofMat);
    canopyRoof.rotation.y = Math.PI / 4;
    canopyRoof.position.set(0, 3.6, 2.2);
    canopyRoof.castShadow = true;
    porticoGroup.add(canopyRoof);

    // Prominent "LICET" White Entrance Signboard Structure
    const signBoxGeo = new THREE.BoxGeometry(5.2, 1.2, 0.3);
    const signBox = new THREE.Mesh(signBoxGeo, signBoardMat);
    signBox.position.set(0, 1.2, 4.0);
    signBox.castShadow = true;
    porticoGroup.add(signBox);

    frontBlockGroup.add(porticoGroup);

    // C. Left Wing & Right Wing Academic Blocks
    const wingWidth = 11;
    const wingGeo = new THREE.BoxGeometry(wingWidth, 4.8, 5.8);

    // Left Wing
    const leftWing = new THREE.Mesh(wingGeo, wallWhiteMat);
    leftWing.position.set(-9.5, 2.4, -0.1);
    leftWing.castShadow = true;
    leftWing.receiveShadow = true;
    frontBlockGroup.add(leftWing);

    // Right Wing
    const rightWing = new THREE.Mesh(wingGeo, wallWhiteMat);
    rightWing.position.set(9.5, 2.4, -0.1);
    rightWing.castShadow = true;
    rightWing.receiveShadow = true;
    frontBlockGroup.add(rightWing);

    // Continuous Terracotta Red Horizontal Bands (Signature LICET Elevation Detail!)
    const redBandGeo = new THREE.BoxGeometry(11, 0.22, 0.12);
    [1.1, 2.4, 3.7].forEach((yBand) => {
      // Left Wing Red Band
      const leftBand = new THREE.Mesh(redBandGeo, redBandMat);
      leftBand.position.set(-9.5, yBand, 2.82);
      frontBlockGroup.add(leftBand);

      // Right Wing Red Band
      const rightBand = new THREE.Mesh(redBandGeo, redBandMat);
      rightBand.position.set(9.5, yBand, 2.82);
      frontBlockGroup.add(rightBand);
    });

    // Window Grids on Wings
    const winGeo = new THREE.BoxGeometry(0.9, 0.8, 0.1);
    [-13.5, -11.5, -9.5, -7.5, -5.5, 5.5, 7.5, 9.5, 11.5, 13.5].forEach((wx) => {
      [1.6, 2.9, 4.2].forEach((wy) => {
        const win = new THREE.Mesh(winGeo, windowGlassMat);
        win.position.set(wx, wy, 2.85);
        frontBlockGroup.add(win);
      });
    });

    // D. Rooftop Solar PV Panel Array
    const solarPanelGeo = new THREE.BoxGeometry(1.6, 0.1, 1.0);
    for (let x = -13; x <= -5; x += 1.8) {
      for (let z = -2; z <= 1; z += 1.2) {
        const panel = new THREE.Mesh(solarPanelGeo, solarPVMat);
        panel.position.set(x, 4.9, z);
        panel.rotation.x = -Math.PI / 18;
        panel.castShadow = true;
        frontBlockGroup.add(panel);
      }
    }
    for (let x = 5; x <= 13; x += 1.8) {
      for (let z = -2; z <= 1; z += 1.2) {
        const panel = new THREE.Mesh(solarPanelGeo, solarPVMat);
        panel.position.set(x, 4.9, z);
        panel.rotation.x = -Math.PI / 18;
        panel.castShadow = true;
        frontBlockGroup.add(panel);
      }
    }

    // Elevator Towers on Wings
    const towerGeo = new THREE.BoxGeometry(2.2, 1.6, 2.2);
    const leftTower = new THREE.Mesh(towerGeo, penthouseCyanMat);
    leftTower.position.set(-13.5, 5.6, 0);
    frontBlockGroup.add(leftTower);

    const rightTower = new THREE.Mesh(towerGeo, penthouseCyanMat);
    rightTower.position.set(13.5, 5.6, 0);
    frontBlockGroup.add(rightTower);

    campusGroup.add(frontBlockGroup);

    // ---------------------------------------------------------
    // 2. CENTRAL PENTAGON ATRIUM HUB & STARBURST RADIAL WINGS
    // ---------------------------------------------------------
    const starburstGroup = new THREE.Group();
    starburstGroup.position.set(0, 0, -2);

    // Central Pentagon Core Atrium
    const pentagonCoreGeo = new THREE.CylinderGeometry(5, 5.5, 5, 5);
    const pentagonCore = new THREE.Mesh(pentagonCoreGeo, wallWhiteMat);
    pentagonCore.position.y = 2.5;
    pentagonCore.rotation.y = Math.PI / 10;
    pentagonCore.castShadow = true;
    pentagonCore.receiveShadow = true;
    starburstGroup.add(pentagonCore);

    // Central Skylight Glass Roof
    const skylightGeo = new THREE.ConeGeometry(3.5, 1.5, 5);
    const skylightMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
    });
    const skylight = new THREE.Mesh(skylightGeo, skylightMat);
    skylight.position.y = 5.75;
    skylight.rotation.y = Math.PI / 10;
    starburstGroup.add(skylight);

    // 5 Radial Starburst Wings Extending Outwards
    const radialAngles = [0, (2 * Math.PI) / 5, (4 * Math.PI) / 5, (6 * Math.PI) / 5, (8 * Math.PI) / 5];
    const wingLength = 10;
    const radialWingWidth = 5;

    radialAngles.forEach((angle) => {
      const wingPivot = new THREE.Group();
      wingPivot.rotation.y = angle;

      const wingMesh = new THREE.Mesh(new THREE.BoxGeometry(radialWingWidth, 4.5, wingLength), wallWhiteMat);
      wingMesh.position.set(0, 2.25, -wingLength / 2 - 3.5);
      wingMesh.castShadow = true;
      wingMesh.receiveShadow = true;
      wingPivot.add(wingMesh);

      const roofMesh = new THREE.Mesh(
        new THREE.BoxGeometry(radialWingWidth + 0.4, 0.4, wingLength + 0.4),
        terracottaRoofMat
      );
      roofMesh.position.set(0, 4.7, -wingLength / 2 - 3.5);
      roofMesh.castShadow = true;
      wingPivot.add(roofMesh);

      for (let z = -wingLength - 1; z <= -5; z += 1.8) {
        const panel = new THREE.Mesh(solarPanelGeo, solarPVMat);
        panel.position.set(0, 5.0, z);
        panel.rotation.x = -Math.PI / 18;
        wingPivot.add(panel);
      }

      starburstGroup.add(wingPivot);
    });

    campusGroup.add(starburstGroup);

    // ---------------------------------------------------------
    // 3. FRONT LANDSCAPING PALM TREES (Lining Entrance Boulevard)
    // ---------------------------------------------------------
    const palmGroup = new THREE.Group();
    const palmTrunkGeo = new THREE.CylinderGeometry(0.18, 0.25, 3.5, 8);
    const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 });
    const palmLeafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });

    const palmCoords = [
      [-6, 0, 16], [6, 0, 16],
      [-8, 0, 20], [8, 0, 20],
      [-10, 0, 24], [10, 0, 24],
      [-14, 0, 16], [14, 0, 16],
    ];

    palmCoords.forEach(([px, py, pz]) => {
      const palm = new THREE.Group();
      palm.position.set(px, py, pz);

      const trunk = new THREE.Mesh(palmTrunkGeo, palmTrunkMat);
      trunk.position.y = 1.75;
      trunk.castShadow = true;
      palm.add(trunk);

      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.0, 4), palmLeafMat);
        leaf.rotation.x = Math.PI / 3;
        leaf.rotation.y = angle;
        leaf.position.set(Math.sin(angle) * 0.6, 3.5, Math.cos(angle) * 0.6);
        leaf.castShadow = true;
        palm.add(leaf);
      }

      palmGroup.add(palm);
    });
    campusGroup.add(palmGroup);

    // ---------------------------------------------------------
    // 4. EAST RESIDENTIAL HOSTEL & DINING BLOCK
    // ---------------------------------------------------------
    const hostelGroup = new THREE.Group();
    hostelGroup.position.set(18, 0, -14);

    const hostelMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 4.5, 10), wallWhiteMat);
    hostelMesh.position.y = 2.25;
    hostelMesh.castShadow = true;
    hostelMesh.receiveShadow = true;
    hostelGroup.add(hostelMesh);

    const hostelRoof = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.4, 10.4), terracottaRoofMat);
    hostelRoof.position.y = 4.7;
    hostelGroup.add(hostelRoof);

    campusGroup.add(hostelGroup);

    // =========================================================
    // RAYCASTER CLICK SELECTION & ANIMATION LOOP
    // =========================================================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const handleCanvasClick = (event: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(campusGroup.children, true);

      if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        let closestZone = campusZones[0];
        let minDistance = Infinity;

        campusZones.forEach((zone) => {
          const zPos = new THREE.Vector3(...zone.position3D);
          const dist = zPos.distanceTo(hitPoint);
          if (dist < minDistance) {
            minDistance = dist;
            closestZone = zone;
          }
        });

        if (minDistance < 15) {
          setSelectedZone(closestZone);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('click', handleCanvasClick);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      // Pulsing Solar Glow
      solarPVMat.emissiveIntensity = 0.25 + Math.sin(elapsedTime * 2.5) * 0.1;

      // Project 2D screen positions for campus zones
      if (cameraRef.current && mountRef.current) {
        const containerRect = mountRef.current.getBoundingClientRect();
        const updatedScreenPositions = campusZones.map((zone) => {
          const vec = new THREE.Vector3(...zone.position3D);
          vec.project(cameraRef.current!);

          const isVisible = vec.z < 1.0;
          const x = (vec.x * 0.5 + 0.5) * containerRect.width;
          const y = (-(vec.y * 0.5) + 0.5) * containerRect.height;

          return {
            ...zone,
            screenX: x,
            screenY: y,
            visible: isVisible,
          };
        });

        setScreenHotspots(updatedScreenPositions);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      domElement.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [buildingHealthStatus]);

  // Handle Camera Mode Switching
  const handleCameraModeChange = (mode: 'isometric' | 'frontFacade' | 'top' | 'firstPerson') => {
    setIsFlyThroughActive(false); // Disable fly-through if user manually overrides camera
    setCameraMode(mode);
    if (cameraRef.current && controlsRef.current) {
      if (mode === 'frontFacade') {
        cameraRef.current.position.set(0, 4, 28);
        controlsRef.current.target.set(0, 2, 12);
      } else if (mode === 'top') {
        cameraRef.current.position.set(0, 45, 12);
        controlsRef.current.target.set(0, 2, 12);
      } else if (mode === 'isometric') {
        cameraRef.current.position.set(24, 18, 38);
        controlsRef.current.target.set(0, 2, 12);
      } else if (mode === 'firstPerson') {
        cameraRef.current.position.set(0, 1.8, 44);
        controlsRef.current.target.set(0, 1.8, 12);
      }
      controlsRef.current.update();
    }
  };

  // Focus specific building zone
  const handleFocusZone = (zone: CampusZone) => {
    setSelectedZone(zone);
    if (cameraRef.current && controlsRef.current) {
      const [zx, zy, zz] = zone.position3D;
      controlsRef.current.target.set(zx, zy, zz);
      cameraRef.current.position.set(zx, zy + 6, zz + 14);
      controlsRef.current.update();
    }
  };

  // Greenie AI Chat Handler
  const handleSendAiMessage = (queryText?: string) => {
    const textToSend = queryText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!queryText) setChatInput('');

    setTimeout(() => {
      let aiReply = 'I am analyzing the live IoT sensor feeds across the LICET Main Academic Block...';
      const q = textToSend.toLowerCase();

      if (q.includes('energy') || q.includes('electricity') || q.includes('usage')) {
        aiReply =
          '⚡ **LICET Energy Status**: Main Block is consuming 185 kWh today. Peak solar offset is 142 kW. Greenie AI recommends adjusting Mechanical wing lab A/C setpoints from 20°C to 23°C to save ~18 kWh/day.';
      } else if (q.includes('solar') || q.includes('pv')) {
        aiReply =
          '☀ **140 kW Solar PV Array**: Operating at 98.4% efficiency across the front academic roof and 5 radial wings, offsetting 42% of grid electricity demand.';
      } else if (q.includes('water') || q.includes('leak')) {
        aiReply =
          '💧 **Hydro Inspection**: Zero water leaks detected. Underground sump hydro booster pumps running at optimal 1,420 RPM.';
      } else if (q.includes('score') || q.includes('sustainability')) {
        aiReply =
          '🏆 **LICET Sustainability Rating**: Overall Environmental Health Score is **96/100 (Grade A+)**, ranking in the top 5% of green university campuses in India.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 select-none relative">
      {/* Top Title & Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              LICET 3D ARCHITECTURAL FACADE & DIGITAL TWIN
            </span>
            <span className="text-xs text-slate-400 font-mono">Real Front Elevation & Starburst Footprint</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <Building2 className="h-6 w-6 text-emerald-500" />
            Loyola-ICAM College of Engineering & Technology (LICET)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive 3D reconstruction matching the exact LICET front facade, entrance portico signboard, 3-tier arched elevation, and live IoT sustainability telemetry
          </p>
        </div>

        {/* View Mode Controls & Greenie AI Drawer */}
        <div className="flex flex-wrap items-center gap-3">
          {/* BIM Visualization Modes Panel */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <span className="px-2 text-slate-400 font-mono text-[10px] uppercase">BIM View:</span>
            {[
              { id: 'realistic', label: 'Realistic', icon: <Sparkles className="h-3.5 w-3.5" /> },
              { id: 'blueDigitalTwin', label: 'Blue Twin', icon: <Cpu className="h-3.5 w-3.5 text-cyan-400" /> },
              { id: 'blueprint', label: 'Blueprint', icon: <Layers className="h-3.5 w-3.5 text-blue-400" /> },
              { id: 'wireframe', label: 'Wireframe', icon: <Activity className="h-3.5 w-3.5 text-indigo-400" /> },
              { id: 'structural', label: 'Structural', icon: <Compass className="h-3.5 w-3.5 text-rose-400" /> },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setVisualizationMode(mode.id as any)}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                  visualizationMode === mode.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          {/* Wireframe Overlay Switch */}
          <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={isWireframeOverlayActive}
              onChange={(e) => setIsWireframeOverlayActive(e.target.checked)}
              className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500 h-3.5 w-3.5 accent-cyan-500"
            />
            <span>Wireframe Grid Overlay</span>
          </label>

          {/* Camera View Mode Toggles */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => handleCameraModeChange('frontFacade')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                cameraMode === 'frontFacade'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Front Elevation</span>
            </button>

            <button
              onClick={() => handleCameraModeChange('isometric')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                cameraMode === 'isometric'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>3D Isometric</span>
            </button>

            <button
              onClick={() => handleCameraModeChange('top')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                cameraMode === 'top'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              <span>Top Blueprint</span>
            </button>

            <button
              onClick={() => handleCameraModeChange('firstPerson')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                cameraMode === 'firstPerson'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Entrance View</span>
            </button>
          </div>

          {/* Cinematic Flight Autopilot Toggle */}
          <button
            onClick={() => {
              setIsFlyThroughActive(!isFlyThroughActive);
              if (!isFlyThroughActive) {
                setFlyThroughLabel("Approaching LICET Campus (Bird's Eye BIM View)");
              }
            }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg transition flex items-center gap-2 ${
              isFlyThroughActive
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white animate-pulse shadow-cyan-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <Send className={`h-4 w-4 ${isFlyThroughActive ? 'animate-bounce' : ''}`} />
            <span>{isFlyThroughActive ? '🛑 Stop Tour' : '🚀 Play Tour'}</span>
          </button>

          {/* Ask Greenie AI Button */}
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition flex items-center gap-2"
          >
            <Bot className="h-4 w-4 animate-bounce" />
            <span>🌿 Ask Greenie AI</span>
          </button>
        </div>
      </div>

      {/* 3D WEBGL STAGE */}
      <div className="relative rounded-3xl bg-slate-950 p-1 border border-slate-800 shadow-2xl overflow-hidden min-h-[620px]">
        {/* Quick Building Selector Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-white">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-slate-400 font-mono font-bold text-[10px] mr-1">LICET ZONES:</span>
            {campusZones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => handleFocusZone(zone)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 whitespace-nowrap ${
                  selectedZone?.id === zone.id
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{zone.icon}</span>
                <span>{zone.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCameraModeChange('frontFacade')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-bold text-[11px] flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Facade View</span>
          </button>
        </div>

        {/* WebGL Canvas */}
        <div ref={mountRef} className="w-full h-[600px] rounded-2xl cursor-grab active:cursor-grabbing relative" />

        {/* FLY-THROUGH HUD BANNER */}
        {isFlyThroughActive && (
          <div className="absolute bottom-6 left-6 z-30 bg-slate-950/95 border border-cyan-400/50 rounded-2xl p-4 shadow-2xl max-w-sm backdrop-blur-md text-white animate-in slide-in-from-bottom-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400">
                Cinematic Autopilot Active
              </span>
            </div>
            <h4 className="text-sm font-black text-white">{flyThroughLabel}</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Scanning structural geometry, active solar arrays, and live HVAC loads. Controls are automatically stabilized.
            </p>
            <button
              onClick={() => setIsFlyThroughActive(false)}
              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-bold text-[10px]"
            >
              STOP TOUR & TAKE MANUAL CONTROL
            </button>
          </div>
        )}

        {/* 2D Projected Screen Hotspots */}
        {screenHotspots.map(
          (zone) =>
            zone.visible && (
              <div
                key={zone.id}
                style={{
                  position: 'absolute',
                  left: `${zone.screenX}px`,
                  top: `${zone.screenY}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="z-10 group"
              >
                <button
                  onClick={() => handleFocusZone(zone)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black shadow-xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
                    selectedZone?.id === zone.id
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30 scale-110'
                      : 'bg-slate-900/90 text-white border border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span>{zone.icon}</span>
                  <span className="hidden sm:inline">{zone.name.split(' ')[0]}</span>
                </button>
              </div>
            )
        )}

        {/* SELECTED BUILDING INFORMATION CARD MODAL */}
        {selectedZone && (
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 z-30 bg-slate-900/95 border border-emerald-500/50 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-white space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-extrabold text-xl border border-emerald-500/30">
                  {selectedZone.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">{selectedZone.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold">
                    <span>{selectedZone.code}</span>
                    <span>•</span>
                    <span>{selectedZone.floors} FLOORS</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedZone(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Purpose & Details */}
            <div className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Primary Purpose</span>
              <p className="leading-snug text-slate-200">{selectedZone.purpose}</p>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold">Live Occupancy</span>
                <span className="text-sm font-extrabold text-white">{selectedZone.occupancy}</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold">Energy Telemetry</span>
                <span className="text-sm font-extrabold text-emerald-400">{selectedZone.energyUsage}</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold">Maintenance Status</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {selectedZone.maintenanceStatus}
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold">Sustainability Score</span>
                <span className="text-sm font-extrabold text-amber-400 flex items-center gap-1">
                  <Award className="h-4 w-4 text-amber-400" />
                  {selectedZone.sustainabilityScore} / 100
                </span>
              </div>
            </div>

            {/* AI Prescription Recommendation */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
              <div className="font-extrabold text-emerald-400 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Greenie AI Recommendation
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{selectedZone.aiRecommendation}</p>
            </div>

            {/* Ask Greenie Button */}
            <button
              onClick={() => {
                setIsAiDrawerOpen(true);
                handleSendAiMessage(`Tell me more about ${selectedZone.name}`);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-1.5"
            >
              <Bot className="h-4 w-4" />
              <span>ASK GREENIE AI ABOUT THIS BLOCK</span>
            </button>
          </div>
        )}
      </div>

      {/* GREENIE AI SIDE DRAWER */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-5 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-md shadow-emerald-500/30">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 dark:text-white text-base">Greenie AI Assistant</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">LICET 3D Campus Copilot</p>
                </div>
              </div>

              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 dark:text-slate-400 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Sample Questions */}
            <div className="py-3 border-b border-slate-100 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Suggested Queries
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  'Front block solar output?',
                  'Sustainability score of CS wing?',
                  'Water consumption in hostel?',
                  'Predict maintenance issues.',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAiMessage(prompt)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-700 dark:text-slate-300 font-medium text-[11px] transition text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-white rounded-br-none shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono px-1">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask Greenie AI about LICET campus..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                className="flex-1 rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSendAiMessage()}
                className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/30 transition shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
