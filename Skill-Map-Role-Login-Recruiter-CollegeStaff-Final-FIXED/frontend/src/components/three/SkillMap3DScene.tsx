import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const SkillMap3DScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.055);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.4, 9.5);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth || 600, mount.clientHeight || 500);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0x9cc7ff, 1.6));
    const key = new THREE.PointLight(0x60a5fa, 28, 20); key.position.set(4, 4, 5); scene.add(key);
    const rim = new THREE.PointLight(0xa78bfa, 20, 16); rim.position.set(-4, -2, 4); scene.add(rim);
    const root = new THREE.Group(); scene.add(root);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 4), new THREE.MeshPhysicalMaterial({ color: 0x2563eb, emissive: 0x172554, emissiveIntensity: 1.2, roughness: 0.22, metalness: 0.5, transparent: true, opacity: 0.92 })); root.add(core);
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 2), new THREE.MeshBasicMaterial({ color: 0x93c5fd, wireframe: true, transparent: true, opacity: 0.24 })); root.add(wire);
    root.add(new THREE.Mesh(new THREE.SphereGeometry(1.9, 32, 32), new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.045 })));
    const nodes: THREE.Mesh[] = [], links: THREE.Line[] = [], positions: THREE.Vector3[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.105, 16, 16);
    for (let i = 0; i < 18; i += 1) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 18), theta = Math.PI * (1 + Math.sqrt(5)) * i, r = 2.8 + (i % 3) * 0.25;
      const p = new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)); positions.push(p);
      const node = new THREE.Mesh(nodeGeometry, new THREE.MeshStandardMaterial({ color: i % 2 ? 0xa78bfa : 0x38bdf8, emissive: i % 2 ? 0x6d28d9 : 0x0369a1, emissiveIntensity: 2.2, metalness: 0.2, roughness: 0.25 })); node.position.copy(p); root.add(node); nodes.push(node);
    }
    positions.forEach((a, i) => positions.slice(i + 1).forEach((b, j) => { if (a.distanceTo(b) < 2.65 && (i + j) % 2 === 0) { const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.18 })); root.add(line); links.push(line); } }));
    const starPositions = new Float32Array(850 * 3);
    for (let i = 0; i < 850; i += 1) { const r = 12 + Math.random() * 18, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1); starPositions[i * 3] = r * Math.sin(p) * Math.cos(t); starPositions[i * 3 + 1] = r * Math.cos(p); starPositions[i * 3 + 2] = r * Math.sin(p) * Math.sin(t); }
    const starsGeometry = new THREE.BufferGeometry(); starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xbfdbfe, size: 0.035, transparent: true, opacity: 0.7 })); scene.add(stars);
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => { const r = mount.getBoundingClientRect(); pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2; pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2; };
    mount.addEventListener('pointermove', onPointerMove);
    const resize = () => { const w = mount.clientWidth || 600, h = mount.clientHeight || 500; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); }; window.addEventListener('resize', resize); resize();
    let frame = 0; const animate = () => { frame = requestAnimationFrame(animate); root.rotation.y += 0.0019; root.rotation.x += 0.0005; wire.rotation.y -= 0.0026; wire.rotation.x += 0.0008; stars.rotation.y -= 0.00025; root.position.x += (pointer.x * 0.35 - root.position.x) * 0.025; root.position.y += (-pointer.y * 0.25 - root.position.y) * 0.025; core.rotation.x += 0.002; core.rotation.y += 0.003; nodes.forEach((n, i) => n.scale.setScalar(1 + Math.sin(frame * 0.025 + i) * 0.18)); links.forEach((l, i) => ((l.material as THREE.LineBasicMaterial).opacity = 0.11 + (Math.sin(frame * 0.015 + i) + 1) * 0.055)); renderer.render(scene, camera); }; animate();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); mount.removeEventListener('pointermove', onPointerMove); renderer.dispose(); starsGeometry.dispose(); nodeGeometry.dispose(); if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement); scene.traverse(o => { if (o instanceof THREE.Mesh || o instanceof THREE.Line) { o.geometry.dispose(); const m = o.material; if (Array.isArray(m)) m.forEach(x => x.dispose()); else m.dispose(); } }); };
  }, []);
  return <div ref={mountRef} aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`} />;
};
