import * as THREE from "../vendor/three.module.min.js";

// ─────────────────────────────────────────────────────────────
//  3D galaxy background: starfield, nebulae, a ringed hero
//  planet, an asteroid belt and one planet per project. The
//  camera flies forward as you scroll.
// ─────────────────────────────────────────────────────────────

const rand = (a, b) => a + Math.random() * (b - a);

function glowTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)", size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, inner);
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Procedural banded "gas giant" texture
function planetTexture(base, accent, seed = 1) {
  const w = 512, h = 256;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  const b = new THREE.Color(base), a = new THREE.Color(accent);
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const f1 = 2 + rnd() * 4, f2 = 6 + rnd() * 10, ph = rnd() * 6;
  for (let y = 0; y < h; y++) {
    const v = y / h;
    const n = 0.5 + 0.25 * Math.sin(v * Math.PI * f1 + ph) + 0.15 * Math.sin(v * Math.PI * f2 + ph * 2) + 0.1 * (rnd() - 0.5);
    const col = b.clone().lerp(a, Math.min(1, Math.max(0, n)));
    const shade = 0.75 + 0.35 * Math.sin(v * Math.PI);
    g.fillStyle = `rgb(${(col.r * 255 * shade) | 0},${(col.g * 255 * shade) | 0},${(col.b * 255 * shade) | 0})`;
    g.fillRect(0, y, w, 1);
  }
  // swirls / storms
  for (let i = 0; i < 40; i++) {
    g.fillStyle = `rgba(255,255,255,${0.02 + rnd() * 0.05})`;
    g.beginPath();
    g.ellipse(rnd() * w, rnd() * h, 10 + rnd() * 60, 2 + rnd() * 6, 0, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

function ringTexture(color) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 8;
  const g = c.getContext("2d");
  const col = new THREE.Color(color);
  for (let x = 0; x < 512; x++) {
    const v = x / 512;
    const alpha = Math.max(0, Math.sin(v * Math.PI)) * (0.35 + 0.65 * Math.abs(Math.sin(v * 40) * Math.sin(v * 13)));
    g.fillStyle = `rgba(${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0},${alpha * 0.85})`;
    g.fillRect(x, 0, 1, 8);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Fresnel atmosphere shell
function atmosphere(radius, color, intensity = 1.0) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uIntensity: { value: intensity } },
    vertexShader: `
      varying vec3 vN; varying vec3 vV;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uIntensity;
      varying vec3 vN; varying vec3 vV;
      void main(){
        // BackSide shell: d=0 at the outer rim, ~0.67 at the planet's edge
        float d = -dot(vN, vV);
        float f = pow(clamp(d / 0.67, 0.0, 1.0), 3.0);
        gl_FragColor = vec4(uColor, f * uIntensity * 0.9);
      }`,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
  // BackSide shell slightly larger than planet gives a halo
  const m = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.35, 48, 48), mat);
  return m;
}

function makePlanet({ radius, base, accent, ring, seed, glow }) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 64),
    new THREE.MeshStandardMaterial({ map: planetTexture(base, accent, seed), roughness: 0.85, metalness: 0.05 })
  );
  group.add(body);
  group.add(atmosphere(radius, glow || accent, 1.1));
  if (ring) {
    const rg = new THREE.RingGeometry(radius * 1.45, radius * 2.35, 128, 1);
    // remap UVs radially so the 1D ring texture wraps correctly
    const pos = rg.attributes.position, uv = rg.attributes.uv, v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      uv.setXY(i, (v3.length() - radius * 1.45) / (radius * 0.9), 0.5);
    }
    const r = new THREE.Mesh(
      rg,
      new THREE.MeshBasicMaterial({ map: ringTexture(ring), transparent: true, side: THREE.DoubleSide, depthWrite: false })
    );
    r.rotation.x = Math.PI / 2.25;
    group.add(r);
  }
  group.userData.body = body;
  return group;
}

export function initScene(canvas, { projects = [] } = {}) {
  const isMobile = matchMedia("(max-width: 760px)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, powerPreference: "high-performance" });
  } catch (e) {
    canvas.style.background = "radial-gradient(ellipse at 70% 30%, #1b1340, #05060f 70%)";
    return { ready: Promise.resolve(), setScroll() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#05060f");
  scene.fog = new THREE.FogExp2("#05060f", 0.0035);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 30);

  // Lights
  scene.add(new THREE.AmbientLight("#6b6bb5", 0.35));
  const sun = new THREE.DirectionalLight("#ffffff", 2.4);
  sun.position.set(-30, 20, 30);
  scene.add(sun);
  const rim = new THREE.PointLight("#22d3ee", 60, 120, 1.6);
  rim.position.set(30, -10, -10);
  scene.add(rim);

  // ── Starfield ──
  const starCount = isMobile ? 3500 : 8000;
  const starGeo = new THREE.BufferGeometry();
  const sPos = new Float32Array(starCount * 3);
  const sCol = new Float32Array(starCount * 3);
  const palette = [new THREE.Color("#ffffff"), new THREE.Color("#c4b5fd"), new THREE.Color("#a5f3fc"), new THREE.Color("#fbcfe8")];
  for (let i = 0; i < starCount; i++) {
    const r = rand(80, 700);
    const th = rand(0, Math.PI * 2);
    const ph = Math.acos(rand(-1, 1));
    sPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    sPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    sPos[i * 3 + 2] = r * Math.cos(ph) - 200;
    const c = palette[(Math.random() * palette.length) | 0];
    const k = rand(0.5, 1);
    sCol.set([c.r * k, c.g * k, c.b * k], i * 3);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(sCol, 3));
  const starTex = glowTexture();
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ size: 1.6, map: starTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false })
  );
  scene.add(stars);

  // Close dust that drifts past the camera for a sense of speed
  const dustCount = isMobile ? 300 : 700;
  const dGeo = new THREE.BufferGeometry();
  const dPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dPos.set([rand(-60, 60), rand(-40, 40), rand(-260, 40)], i * 3);
  }
  dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
  const dust = new THREE.Points(
    dGeo,
    new THREE.PointsMaterial({ size: 0.35, map: starTex, color: "#a5b4fc", transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  scene.add(dust);

  // ── Nebulae ──
  const nebulaColors = ["rgba(139,92,246,0.55)", "rgba(34,211,238,0.4)", "rgba(244,114,182,0.4)", "rgba(99,102,241,0.5)"];
  const nebulae = [];
  for (let i = 0; i < 9; i++) {
    const m = new THREE.SpriteMaterial({ map: glowTexture(nebulaColors[i % 4], "rgba(0,0,0,0)", 256), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: rand(0.35, 0.7), fog: false });
    const s = new THREE.Sprite(m);
    const sc = rand(120, 260);
    s.scale.set(sc, sc, 1);
    s.position.set(rand(-160, 160), rand(-90, 90), rand(-420, -120) - i * 20);
    scene.add(s);
    nebulae.push(s);
  }

  // ── Hero planet ──
  const hero = makePlanet({ radius: 7, base: "#2e1065", accent: "#a78bfa", ring: "#c4b5fd", seed: 7, glow: "#8b5cf6" });
  hero.position.set(isMobile ? 7 : 14, isMobile ? -11 : 0, isMobile ? -6 : 0);
  hero.rotation.z = 0.35;
  scene.add(hero);

  // Moons orbiting the hero
  const moons = [];
  [["#22d3ee", 0.9, 13, 0.5], ["#f472b6", 0.6, 17, -0.32]].forEach(([col, r, dist, speed], i) => {
    const moon = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35, roughness: 0.6 }));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: col, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.6 }));
    glow.scale.set(r * 6, r * 6, 1);
    moon.add(glow);
    scene.add(moon);
    moons.push({ mesh: moon, dist, speed, phase: i * 2, tilt: 0.3 + i * 0.25 });
  });

  // ── Asteroid belt ──
  const astCount = isMobile ? 220 : 520;
  const astGeo = new THREE.IcosahedronGeometry(1, 0);
  const astMat = new THREE.MeshStandardMaterial({ color: "#8b8fb5", roughness: 1, flatShading: true });
  const asteroids = new THREE.InstancedMesh(astGeo, astMat, astCount);
  const astData = [];
  const dummy = new THREE.Object3D();
  for (let i = 0; i < astCount; i++) {
    const a = rand(0, Math.PI * 2);
    const r = rand(28, 48);
    astData.push({ a, r, y: rand(-3, 3), s: rand(0.12, 0.6), rot: new THREE.Euler(rand(0, 6), rand(0, 6), 0), sp: rand(0.02, 0.06) });
  }
  asteroids.position.set(0, -4, -70);
  asteroids.rotation.x = 0.35;
  scene.add(asteroids);

  // ── Project planets along the flight path ──
  const projectPlanets = projects.map((p, i) => {
    const col = new THREE.Color(p.color);
    const dark = col.clone().multiplyScalar(0.25);
    const pl = makePlanet({
      radius: rand(2.2, 4.2),
      base: "#" + dark.getHexString(),
      accent: p.color,
      ring: i % 3 === 0 ? p.color : null,
      seed: i * 13 + 3,
      glow: p.color,
    });
    const side = i % 2 === 0 ? 1 : -1;
    pl.position.set(side * rand(13, 22) * (isMobile ? 0.6 : 1), rand(-8, 8), -95 - i * 26);
    pl.userData.spin = rand(0.05, 0.15);
    scene.add(pl);
    return pl;
  });

  // ── Interaction state ──
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollTarget = 0, scrollCur = 0;
  const pathLength = 95 + projects.length * 26 + 30;

  window.addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);

  const clock = new THREE.Clock();
  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) { clock.getDelta(); requestAnimationFrame(tick); }
  });

  function tick() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const motion = reduced ? 0.15 : 1;

    // ease scroll + mouse
    scrollCur += (scrollTarget - scrollCur) * Math.min(1, dt * 3.5);
    mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 2.5);
    mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 2.5);

    // camera flies forward and banks gently
    const z = 30 - scrollCur * pathLength;
    camera.position.z = z;
    camera.position.x = mouse.x * 2.2 + Math.sin(scrollCur * Math.PI * 3) * 3;
    camera.position.y = -mouse.y * 1.6 + Math.cos(scrollCur * Math.PI * 2) * 1.5 - 1.5 * scrollCur;
    camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, z - 40);
    camera.rotation.z += Math.sin(scrollCur * Math.PI * 4) * 0.02;

    hero.userData.body.rotation.y += dt * 0.08 * motion;
    hero.rotation.y = mouse.x * 0.15;
    moons.forEach((m) => {
      const a = t * m.speed * motion + m.phase;
      m.mesh.position.set(
        hero.position.x + Math.cos(a) * m.dist,
        hero.position.y + Math.sin(a) * m.dist * Math.sin(m.tilt),
        hero.position.z + Math.sin(a) * m.dist * Math.cos(m.tilt)
      );
    });

    for (let i = 0; i < astCount; i++) {
      const d = astData[i];
      d.a += d.sp * dt * 0.3 * motion;
      d.rot.x += dt * 0.3 * motion;
      d.rot.y += dt * 0.2 * motion;
      dummy.position.set(Math.cos(d.a) * d.r, d.y, Math.sin(d.a) * d.r);
      dummy.rotation.copy(d.rot);
      dummy.scale.setScalar(d.s);
      dummy.updateMatrix();
      asteroids.setMatrixAt(i, dummy.matrix);
    }
    asteroids.instanceMatrix.needsUpdate = true;

    projectPlanets.forEach((p, i) => {
      p.userData.body.rotation.y += dt * p.userData.spin * motion;
      p.position.y += Math.sin(t * 0.5 + i) * 0.003 * motion;
    });

    stars.rotation.y = t * 0.004 * motion;
    stars.rotation.x = mouse.y * 0.02;
    nebulae.forEach((n, i) => { n.material.rotation = t * 0.01 * (i % 2 ? 1 : -1) * motion; });

    // dust wraps around as the camera passes
    const dp = dGeo.attributes.position;
    for (let i = 0; i < dustCount; i++) {
      const zz = dp.getZ(i);
      if (zz > camera.position.z + 10) dp.setZ(i, zz - 280);
      else if (zz < camera.position.z - 270) dp.setZ(i, zz + 280);
    }
    dp.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);

  return {
    ready: Promise.resolve(),
    setScroll(p) { scrollTarget = Math.max(0, Math.min(1, p)); },
  };
}
