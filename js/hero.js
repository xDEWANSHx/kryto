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
  let coreSphere, wireframeSphere, ring1, ring2;
  let ambientLight, particleMaterial;
  let deviceCards = [];
  const mouse = new THREE.Vector2(0, 0); // Start at center
  const targetMouse = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();
  let hasMouseMoved = false;
  // Orbit configuration - Scaled down slightly to fit on the right side of the screen
  const numDevices = 6;
  const isMobile = window.innerWidth < 768;
  const orbitRadiusX = isMobile ? 3.0 : 2.5;
  const orbitRadiusZ = isMobile ? 1.8 : 1.6;
  const orbitRadiusY = isMobile ? 0.6 : 0.5;
  let baseOrbitAngle = 0;

  // Performance parameters based on device
  const maxParticles = isMobile ? 200 : 800;
  const pixelRatioCap = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);

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
    ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
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

    // 5. Central Logo/Shape Object - Premium Multi-layered Interactive Core
    centralMesh = new THREE.Group();
    sceneGroup.add(centralMesh);

    // Core refractive sphere
    const coreGeo = new THREE.SphereGeometry(1.0, 64, 64);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x7c6ff7,
      emissive: 0x3b24d7,
      emissiveIntensity: 1.2,
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.6,
      ior: 1.6,
      thickness: 0.4,
      transparent: true
    });
    coreSphere = new THREE.Mesh(coreGeo, coreMat);
    centralMesh.add(coreSphere);

    // Cyber wireframe outer mesh
    const wireframeGeo = new THREE.SphereGeometry(1.06, 24, 24);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x4ecb8d,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    wireframeSphere = new THREE.Mesh(wireframeGeo, wireframeMat);
    centralMesh.add(wireframeSphere);

    // Orbital rings
    const ring1Geo = new THREE.TorusGeometry(1.35, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x7c6ff7,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 4;
    centralMesh.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.45, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x4ecb8d,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    centralMesh.add(ring2);

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

    particleMaterial = new THREE.PointsMaterial({
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

    // Set initial responsive position
    adjustScenePosition();

    // Set initial theme colors
    updateThemeColors();

    // Listen for theme changes
    document.addEventListener('themeChanged', updateThemeColors);
  }

  function updateThemeColors() {
    const isLight = document.body.classList.contains('light-theme');
    
    if (scene) {
      // Update fog color matching background primary
      const fogColor = isLight ? 0xf6f7fb : 0x080808;
      scene.fog.color.setHex(fogColor);
      
      // Update ambient light intensity for better visibility in light theme
      if (ambientLight) {
        ambientLight.intensity = isLight ? 0.95 : 0.4;
      }
      
      // Update particle material opacity
      if (particleMaterial) {
        particleMaterial.opacity = isLight ? 0.15 : 0.35; // Lower opacity in light mode to keep it subtle
      }
    }
  }

  // Helper to generate dynamic canvas texture
  function generateMockupTexture(index) {
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 512;
    canvas2d.height = 312;
    const ctx = canvas2d.getContext('2d');

    // Content profiles for 6 cards matching exactly the 6 portfolio services
    const configs = [
      {
        title: "Web Development",
        desc: "Custom Performance Apps",
        colorBg: "#0c1f15",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Web page browser layout mockup
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
          
          ctx.fillStyle = "rgba(78, 203, 141, 0.2)";
          ctx.fillRect(30, 70, 140, 160);
        }
      },
      {
        title: "App Development",
        desc: "iOS & Android Native",
        colorBg: "#160a26",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Phone outline in center
          ctx.strokeStyle = "rgba(124, 111, 247, 0.5)";
          ctx.lineWidth = 4;
          ctx.strokeRect(180, 50, 152, 240); // Phone Bezel
          
          ctx.fillStyle = "#7c6ff7";
          ctx.fillRect(195, 70, 122, 40); // Stat cards
          ctx.fillStyle = "#4ecb8d";
          ctx.fillRect(195, 125, 122, 30);
          ctx.fillStyle = "#fff";
          ctx.fillRect(195, 170, 122, 8);
          ctx.fillRect(195, 185, 122, 8);
        }
      },
      {
        title: "UI/UX Redesigning",
        desc: "High-Conversion Redesigns",
        colorBg: "#081a24",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Split screen comparison layout
          ctx.fillStyle = "#040d12";
          ctx.fillRect(0, 0, 256, 312); // Left dark
          ctx.fillStyle = "#0c2836";
          ctx.fillRect(256, 0, 256, 312); // Right light
          
          ctx.strokeStyle = "rgba(124, 111, 247, 0.4)";
          ctx.beginPath();
          ctx.moveTo(256, 0);
          ctx.lineTo(256, 312);
          ctx.stroke();

          ctx.fillStyle = "rgba(255, 95, 86, 0.3)";
          ctx.fillRect(30, 80, 180, 20); // Old clunky layout
          ctx.fillStyle = "rgba(78, 203, 141, 0.7)";
          ctx.fillRect(290, 80, 190, 40); // Polished redesign UI
        }
      },
      {
        title: "Photo Editing",
        desc: "Frequency Retouch & Grade",
        colorBg: "#1c0d03",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Color wheel graphic mockup
          ctx.strokeStyle = "#f07a3a";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(256, 150, 70, 0, Math.PI * 2);
          ctx.stroke();
          
          // Color sectors
          ctx.fillStyle = "rgba(240, 122, 58, 0.4)";
          ctx.beginPath();
          ctx.moveTo(256, 150);
          ctx.arc(256, 150, 68, 0, Math.PI / 2);
          ctx.fill();
          
          ctx.fillStyle = "rgba(78, 203, 141, 0.4)";
          ctx.beginPath();
          ctx.moveTo(256, 150);
          ctx.arc(256, 150, 68, Math.PI, Math.PI * 1.5);
          ctx.fill();
        }
      },
      {
        title: "Video Editing",
        desc: "Cinematic Cut & Grade",
        colorBg: "#210410",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Cinema aspect mockup
          ctx.fillStyle = "#0c0108";
          ctx.fillRect(0, 0, 512, 35);
          ctx.fillRect(0, 277, 512, 35);

          // Audio track waveform visualizer mockup
          ctx.fillStyle = "#f07a3a";
          for (let i = 40; i < 480; i += 12) {
            const h = Math.abs(Math.sin(i * 0.05)) * 80 + 10;
            ctx.fillRect(i, 156 - h / 2, 6, h);
          }
        }
      },
      {
        title: "Enterprise Systems",
        desc: "Scalable Administrative ERPs",
        colorBg: "#121212",
        colorText: "#ffffff",
        draw: (ctx) => {
          // Srijan database cylinder layout and analytical bars
          ctx.strokeStyle = "#4ecb8d";
          ctx.lineWidth = 3;
          ctx.strokeRect(30, 80, 140, 150); // DB frame
          
          // Analytical stats charts inside system mockup
          ctx.fillStyle = "#1e1e1e";
          ctx.fillRect(200, 80, 280, 45);
          ctx.fillRect(200, 140, 280, 45);
          
          ctx.fillStyle = "#4ecb8d";
          ctx.font = "bold 14px sans-serif";
          ctx.fillText("✓ 100% Fully Connected", 220, 108);
          ctx.fillText("✓ Automatic Fee Reports", 220, 168);
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
        title: ["Web Dev", "Mobile Apps", "UI/UX Redesign", "Photo Edit", "Video Edit", "Enterprise Systems"][i]
      };

      deviceCards.push(group);
    }
  }

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    adjustScenePosition();
  }

  function adjustScenePosition() {
    if (window.innerWidth >= 1200) {
      sceneGroup.position.set(2.2, -0.2, 0); // Shipped to the right, slightly down for perfect balance
    } else if (window.innerWidth >= 768) {
      sceneGroup.position.set(1.6, -0.2, 0);
    } else {
      sceneGroup.position.set(0, -0.6, 0); // Centered on mobile, slightly lower to clear title
    }
  }

  function onMouseMove(e) {
    hasMouseMoved = true;
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

    // Smooth mouse coordinate interpolation (only track if moved to avoid -9999 initialization jump)
    if (hasMouseMoved) {
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
    } else {
      // Smooth return/stay at flat alignment
      sceneGroup.rotation.y += (0 - sceneGroup.rotation.y) * 0.05;
      sceneGroup.rotation.x += (0 - sceneGroup.rotation.x) * 0.05;
    }

    // 3. Central mesh self rotation & core animations - Slowed down significantly for a premium majestic glide
    if (centralMesh) {
      centralMesh.rotation.y += 0.0006;
      centralMesh.rotation.x += 0.0003;
    }
    if (wireframeSphere) {
      wireframeSphere.rotation.y -= 0.0012;
      wireframeSphere.rotation.x -= 0.0006;
    }
    if (ring1) {
      ring1.rotation.z += 0.002;
    }
    if (ring2) {
      ring2.rotation.z -= 0.0012;
      ring2.rotation.y += 0.0006;
    }

    // 4. Background particle slow spin
    if (particleSystem) {
      particleSystem.rotation.y += 0.0001;
    }

    // 5. Update Orbiting Cards
    if (!isMobile) {
      // Check if mouse is hovering specifically over the globe/frames section (right half of the screen)
      const isOverGlobeSection = hasMouseMoved && mouse.x >= 0.0 && mouse.x <= 1.0;

      // Calculate dynamic speed based on relative mouse x position inside the globe's square bounds
      let dynamicOrbitSpeed = 0.0008;
      if (isOverGlobeSection) {
        // Globe center screen X is around 0.5. Normalize relative displacement to range -1.0 to 1.0
        const relativeX = Math.max(-1.0, Math.min(1.0, (mouse.x - 0.55) * 2.5));
        const interactionSpeed = Math.abs(relativeX) * 0.006;
        dynamicOrbitSpeed = 0.0008 + interactionSpeed;
        
        // Direction matches cursor side relative to the globe center
        if (relativeX > 0) {
          baseOrbitAngle += dynamicOrbitSpeed;
        } else {
          baseOrbitAngle -= dynamicOrbitSpeed;
        }
      } else {
        // Default graceful leftward glide when mouse is outside the globe section
        baseOrbitAngle -= 0.0008;
      }

      // Raycast to check hover - ONLY active when mouse is inside the globe section
      if (isOverGlobeSection) {
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
          } else {
            data.targetHoverOffset = 0;
            data.targetScale = 1;
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
      } else {
        // Just position cards statically/gracefully without any hover checks until mouse enters the globe square
        deviceCards.forEach((group, idx) => {
          const data = group.userData;
          data.hoverOffset += (0 - data.hoverOffset) * 0.1;
          const currentScale = group.scale.x;
          const newScale = currentScale + (1 - currentScale) * 0.1;
          group.scale.set(newScale, newScale, newScale);

          const angle = baseOrbitAngle + data.angleOffset;
          const baseX = Math.cos(angle) * orbitRadiusX;
          const baseY = Math.sin(angle * 0.4) * orbitRadiusY;
          const baseZ = Math.sin(angle) * orbitRadiusZ;

          group.position.set(baseX, baseY, baseZ);
          group.lookAt(camera.position);
        });
      }
    }

    renderer.render(scene, camera);
  }
});
