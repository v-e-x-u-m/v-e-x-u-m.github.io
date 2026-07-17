/* VEXUM // hero 3D — wireframe core + reactive particle field */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070708, 0.035);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // core: nested wireframe icosahedrons
  const coreGroup = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.7, 1),
    new THREE.MeshBasicMaterial({ color: 0xd91424, wireframe: true, transparent: true, opacity: 0.75 })
  );
  const innerCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.85, 0),
    new THREE.MeshBasicMaterial({ color: 0xededed, wireframe: true, transparent: true, opacity: 0.18 })
  );
  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.9, 0.012, 8, 90),
    new THREE.MeshBasicMaterial({ color: 0xd91424, transparent: true, opacity: 0.35 })
  );
  outerRing.rotation.x = Math.PI / 2.3;
  coreGroup.add(core, innerCore, outerRing);
  scene.add(coreGroup);

  // particle field
  const COUNT = 700;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 3.2 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: 0x8a8a8f, size: 0.02, transparent: true, opacity: 0.7, sizeAttenuation: true })
  );
  scene.add(particles);

  const redDust = particles.clone();
  redDust.material = new THREE.PointsMaterial({ color: 0xd91424, size: 0.03, transparent: true, opacity: 0.35, sizeAttenuation: true });
  redDust.rotation.y = Math.PI / 3;
  scene.add(redDust);

  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;

    coreGroup.rotation.y = t * 0.18 + mouseX * 0.45;
    coreGroup.rotation.x = t * 0.07 + mouseY * 0.3;
    innerCore.rotation.y = -t * 0.35;
    innerCore.rotation.z = t * 0.2;
    outerRing.rotation.z = t * 0.12;

    const s = 1 + Math.sin(t * 1.4) * 0.03;
    core.scale.set(s, s, s);

    particles.rotation.y = t * 0.025 + mouseX * 0.12;
    particles.rotation.x = mouseY * 0.08;
    redDust.rotation.y = -t * 0.02 - mouseX * 0.09;
    redDust.rotation.x = -mouseY * 0.06;

    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 0.35 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();
