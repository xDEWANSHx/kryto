/* js/hero.js - Three.js 3D Hero Section Scene */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hero');
  const canvas = document.getElementById('hero-canvas');
  
  if (!container || !canvas) return;

  // Fallback check
  function showFallback() {
    console.warn("WebGL not supported or Three.js failed to load. Showing 3D fallback styling.");
    canvas.style.display = 'none';
    container.style.background = 'radial-gradient(circle at 80% 30%, #151138 0%, #080808 80%)';
  }

  if (typeof THREE === 'undefined') {
    showFallback();
    return;
  }

  // Scene variables
  let scene, camera, renderer, particleSystem, centralMesh, sceneGroup;
  let deviceCards = [];
  const mouse = new THREE.Vector2(-9999, -9999); // Offscreen initially
  const targetMouse = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();
  let hoverTooltip;

  // Orbit configuration
  const numDevices = 5;
  const orbitRadiusX = 3.8;
  const orbitRadiusZ = 2.4;
  const orbitRadiusY = 0.8;
  let baseOrbitAngle = 0;

  // Performance parameters based on device
  const isMobile = window.innerWidth < 768;
  const maxParticles = isMobile ? 200 : 800;
  const pixelRatioCap = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);

  // HTML Tooltip Setup
  hoverTooltip = document.createElement('div');
  hoverTooltip.style.position = 'fixed';
  hoverTooltip.style.pointerEvents = 'none';
  hoverTooltip.style.zIndex = '9999';
  hoverTooltip.style.padding = '8px 16px';
  hoverTooltip.style.background = 'rgba(20, 20, 20, 0.9)';
  hoverTooltip.style.border = '1px solid rgba(124, 111, 247, 0.4)';
  hoverTooltip.style.borderRadius = '6px';
  hoverTooltip.style.fontFamily = "'Space Grotesk', sans-serif";
  hoverTooltip.style.color = '#ffffff';
  hoverTooltip.style.fontSize = '12px';
  hoverTooltip.style.fontWeight = '600';
  hoverTooltip.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
  hoverTooltip.style.opacity = '0';
  hoverTooltip.style.transition = 'opacity 0.2s';
  hoverTooltip.innerHTML = 'View Work <span style="color:#4ecb8d">→</span>';
  document.body.appendChild(hoverTooltip);

  try {
    init();
    animate();
  } catch (error) {
    console.error("Three.js initialization error:", error);
    showFallback();
  }

  function init() {
    // 1. Scene & Group Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.08);

    sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    // Position camera slightly back and angled down
    camera.position.set(0, 0, 7.5);

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(pixelRatioCap);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Mouse follow glowing light
    const mouseLight = new THREE.PointLight(0x7c6ff7, 3, 15);
    mouseLight.position.set(0, 0, 2);
    scene.add(mouseLight);
    scene.userData.mouseLight = mouseLight;

    // Static fill light
    const staticLight = new THREE.PointLight(0x4ecb8d, 1.5, 12);
    staticLight.position.set(-4, 3, -2);
    scene.add(staticLight);

    // 5. Central Logo/Shape Object
    // Icosahedron: complex geometric sphere representing "core engine" of Kryto
    const geometry = new THREE.IcosahedronGeometry(1.2, 1);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x7c6ff7,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.3, // Subtle glass refraction transparency
      ior: 1.5,
      thickness: 0.5,
    });
    centralMesh = new THREE.Mesh(geometry, material);
    sceneGroup.add(centralMesh);

    // 6. Particle Field Background
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(maxParticles * 3);

    for (let i = 0; i < maxParticles * 3; i += 3) {
      // Scatter in a sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 5.0 + Math.random() * 8.0; // Keep outside central orbit

      particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = r * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x7c6ff7,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    sceneGroup.add(particleSystem);

    // 7. Orbiting Device Cards
    if (!isMobile) {
      createOrbitingDevices();
    }

    // 8. Event Listeners
    window.addEventListener('resize', onWindowResize);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onCanvasClick);
  }

  // Helper to generate dynamic canvas texture
  function generateMockupTexture(index) {
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 512;
    canvas2d.height = 312;
    const ctx = canvas2d.getContext('2d');

    // Content profiles for 5 cards
    const configs = [
      {
        title: "Srijan Institute",
        desc: "Enterprise Admin ERP",
        colorBg: "#0d1b2a",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Draw sidebar admin panel layout mockup
          ctx.fillStyle = "#1b263b";
          ctx.fillRect(0, 0, 100, 312);
          ctx.fillStyle = "#4ecb8d";
          ctx.fillRect(10, 20, 80, 20); // Top sidebar item
          
          ctx.fillStyle = "#a0a0a0";
          ctx.fillRect(15, 60, 70, 8);
          ctx.fillRect(15, 80, 70, 8);
          ctx.fillRect(15, 100, 70, 8);

          // Dashboard stats
          ctx.fillStyle = "#1e1e1e";
          ctx.fillRect(120, 80, 100, 50);
          ctx.fillRect(240, 80, 100, 50);
          ctx.fillRect(360, 80, 130, 50);

          ctx.fillStyle = "#7c6ff7";
          ctx.font = "bold 16px sans-serif";
          ctx.fillText("500+ Students", 130, 110);
          ctx.fillStyle = "#4ecb8d";
          ctx.fillText("₹ Fees Ok", 250, 110);
        }
      },
      {
        title: "Web Development",
        desc: "Custom Performance Apps",
        colorBg: "#0d2218",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Web page browser layout
          ctx.fillStyle = "#141414";
          ctx.fillRect(0, 0, 512, 40); // Browser chrome
          ctx.fillStyle = "#ff5f56"; ctx.beginPath(); ctx.arc(20, 20, 6, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#ffbd2e"; ctx.beginPath(); ctx.arc(36, 20, 6, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "#27c93f"; ctx.beginPath(); ctx.arc(52, 20, 6, 0, Math.PI*2); ctx.fill();

          ctx.strokeStyle = "rgba(78, 203, 141, 0.4)";
          ctx.lineWidth = 2;
          ctx.strokeRect(30, 70, 140, 160); // Wireframe box
          ctx.strokeRect(190, 70, 290, 80);
          ctx.strokeRect(190, 170, 290, 60);
        }
      },
      {
        title: "Mobile Apps",
        desc: "iOS & Android Handcrafted",
        colorBg: "#1a0d2e",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Phone outline in center
          ctx.strokeStyle = "rgba(124, 111, 247, 0.5)";
          ctx.lineWidth = 4;
          ctx.strokeRect(180, 50, 150, 240); // Phone Bezel
          ctx.fillStyle = "#7c6ff7";
          ctx.fillRect(195, 70, 120, 40); // Stat cards
          ctx.fillStyle = "#4ecb8d";
          ctx.fillRect(195, 125, 120, 30);
          ctx.fillStyle = "#fff";
          ctx.fillRect(195, 170, 120, 8);
          ctx.fillRect(195, 185, 120, 8);
        }
      },
      {
        title: "Photo & Video",
        desc: "Cinematic Post-Production",
        colorBg: "#1a0a00",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Film strip graphic
          ctx.fillStyle = "#111111";
          ctx.fillRect(0, 220, 512, 60);
          for(let i=10; i<512; i+=40) {
            ctx.fillStyle = "#333333";
            ctx.fillRect(i, 235, 20, 30); // Film sprockets
          }
          // Gradient curves simulating color wheels
          ctx.fillStyle = "#f07a3a";
          ctx.fillRect(50, 70, 120, 120);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.strokeRect(50, 70, 120, 120);
        }
      },
      {
        title: "Modern Redesigns",
        desc: "Conversion-Focused UX",
        colorBg: "#001a1a",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Split screen
          ctx.fillStyle = "#000a0a";
          ctx.fillRect(0, 0, 256, 312); // Left dark (outdated)
          ctx.fillStyle = "#002a2a";
          ctx.fillRect(256, 0, 256, 312); // Right light (modern)
          
          ctx.strokeStyle = "rgba(78, 203, 141, 0.5)";
          ctx.beginPath();
          ctx.moveTo(256, 0);
          ctx.lineTo(256, 312);
          ctx.stroke();

          ctx.fillStyle = "rgba(255, 95, 86, 0.4)";
          ctx.fillRect(30, 80, 180, 20); // Old clunky layout
          ctx.fillStyle = "rgba(78, 203, 141, 0.8)";
          ctx.fillRect(290, 80, 190, 40); // Fresh neat UI
        }
      }
    ];

    const cfg = configs[index];
    ctx.fillStyle = cfg.colorBg;
    ctx.fillRect(0, 0, 512, 312);

    // Canvas Border
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, 512, 312);

    // Title text
    ctx.fillStyle = cfg.colorText;
    ctx.font = "bold 28px 'Space Grotesk', sans-serif";
    ctx.fillText(cfg.title, 40, 100);

    // Description text
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText(cfg.desc, 40, 135);

    // Subtitle label
    ctx.fillStyle = "rgba(124, 111, 247, 0.8)";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("KRYTO STUDIOS PORTFOLIO PROJECT", 40, 60);

    // Run custom drawer
    if (cfg.draw) cfg.draw(ctx);

    const texture = new THREE.CanvasTexture(canvas2d);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  function createOrbitingDevices() {
    const cardGeometry = new THREE.BoxGeometry(2.0, 1.25, 0.05);

    for (let i = 0; i < numDevices; i++) {
      const texture = generateMockupTexture(i);

      // Create material array for 6 faces
      const sideMat = new THREE.MeshPhysicalMaterial({ color: 0x141414, metalness: 0.8, roughness: 0.4 });
      const frontMat = new THREE.MeshPhysicalMaterial({
        map: texture,
        metalness: 0.4,
        roughness: 0.2,
        clearcoat: 0.8
      });
      const backMat = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, metalness: 0.9, roughness: 0.1 });

      const materials = [
        sideMat, // Right
        sideMat, // Left
        sideMat, // Top
        sideMat, // Bottom
        frontMat, // Front (+Z)
        backMat  // Back (-Z)
      ];

      const mesh = new THREE.Mesh(cardGeometry, materials);
      
      const group = new THREE.Group();
      group.add(mesh);
      sceneGroup.add(group);

      // Track angles and user states in custom data
      group.userData = {
        index: i,
        angleOffset: (i * (Math.PI * 2)) / numDevices,
        hoverOffset: 0,
        targetHoverOffset: 0,
        targetScale: 1,
        title: ["Srijan ERP", "Web Dev", "Mobile Apps", "Photo/Video", "UX Redesign"][i]
      };

      deviceCards.push(group);
    }
  }

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    // Normalize coordinates -1 to +1
    targetMouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    targetMouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
  }

  function onCanvasClick(e) {
    if (isMobile) return;
    
    raycaster.setFromCamera(mouse, camera);
    
    // Extract actual mesh children of our card groups for intersection
    const intersectObjects = deviceCards.map(group => group.children[0]);
    const intersects = raycaster.intersectObjects(intersectObjects);

    if (intersects.length > 0) {
      // Find parent group of hit mesh
      const hitMesh = intersects[0].object;
      const parentGroup = hitMesh.parent;
      if (parentGroup) {
        console.log("Clicked card:", parentGroup.userData.title);
        // Scroll to work section smoothly
        const workSection = document.getElementById('work');
        if (workSection && window.lenis) {
          window.lenis.scrollTo(workSection, { offset: -72 });
        } else if (workSection) {
          workSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }

  // Animation Frame Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse coordinate interpolation
    mouse.x += (targetMouse.x - mouse.x) * 0.1;
    mouse.y += (targetMouse.y - mouse.y) * 0.1;

    // 1. Move point light to track mouse
    if (scene.userData.mouseLight) {
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance * 0.7));
      scene.userData.mouseLight.position.copy(pos);
    }

    // 2. Parallax rotation on entire scene
    sceneGroup.rotation.y += (mouse.x * 0.15 - sceneGroup.rotation.y) * 0.05;
    sceneGroup.rotation.x += (-mouse.y * 0.1 - sceneGroup.rotation.x) * 0.05;

    // 3. Central mesh self rotation
    if (centralMesh) {
      centralMesh.rotation.y += 0.003;
      centralMesh.rotation.x += 0.001;
    }

    // 4. Background particle slow spin
    if (particleSystem) {
      particleSystem.rotation.y += 0.0002;
    }

    // 5. Update Orbiting Cards
    if (!isMobile) {
      baseOrbitAngle -= 0.0025; // Continuous orbit spin

      // Raycast to check hover
      raycaster.setFromCamera(mouse, camera);
      const intersectObjects = deviceCards.map(group => group.children[0]);
      const intersects = raycaster.intersectObjects(intersectObjects);

      let hoveredGroupIndex = -1;
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const parent = hitMesh.parent;
        if (parent) hoveredGroupIndex = parent.userData.index;
      }

      deviceCards.forEach((group, idx) => {
        const data = group.userData;
        
        // Handle hovering values
        if (idx === hoveredGroupIndex) {
          data.targetHoverOffset = 0.8;
          data.targetScale = 1.22;
          
          // Position tooltip near cursor
          const screenX = ((mouse.x + 1) / 2) * window.innerWidth;
          const screenY = (-(mouse.y - 1) / 2) * window.innerHeight;
          hoverTooltip.style.left = `${screenX + 15}px`;
          hoverTooltip.style.top = `${screenY + 15}px`;
          hoverTooltip.style.opacity = '1';
        } else {
          data.targetHoverOffset = 0;
          data.targetScale = 1;
        }

        // Hide tooltip if nothing hovered
        if (hoveredGroupIndex === -1) {
          hoverTooltip.style.opacity = '0';
        }

        // Interpolate hover values (lerp)
        data.hoverOffset += (data.targetHoverOffset - data.hoverOffset) * 0.1;
        const currentScale = group.scale.x;
        const newScale = currentScale + (data.targetScale - currentScale) * 0.1;
        group.scale.set(newScale, newScale, newScale);

        // Map ellipse formula
        const angle = baseOrbitAngle + data.angleOffset;
        
        // Normal base position
        const baseX = Math.cos(angle) * orbitRadiusX;
        const baseY = Math.sin(angle * 0.4) * orbitRadiusY;
        const baseZ = Math.sin(angle) * orbitRadiusZ;

        // Apply forward hover push
        const radialVector = new THREE.Vector3(baseX, baseY, baseZ).normalize();
        const finalX = baseX + radialVector.x * data.hoverOffset;
        const finalY = baseY + radialVector.y * data.hoverOffset;
        const finalZ = baseZ + radialVector.z * data.hoverOffset;

        group.position.set(finalX, finalY, finalZ);

        // Face camera smoothly
        group.lookAt(camera.position);
      });
    }

    renderer.render(scene, camera);
  }
});
