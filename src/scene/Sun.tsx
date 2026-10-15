import { useEffect, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, AdditiveBlending, type Mesh, type Texture } from 'three';
import type { RefObject } from 'react';
import { BODY_BY_ID } from '../data/bodies';
import { spinAngle, type SimulationClock } from '../lib/orbital';
import { Atmosphere } from './Atmosphere';

export function Sun({clock, texture, labels, onSelect}: {clock: RefObject<SimulationClock>; texture?: Texture; labels: boolean; onSelect: () => void}) {
  const mesh = useRef<Mesh>(null);
  const glow = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 165, 65, .9)'); gradient.addColorStop(.25, 'rgba(255, 120, 20, .38)');
      gradient.addColorStop(.55, 'rgba(238, 83, 10, .075)'); gradient.addColorStop(1, 'rgba(238, 83, 10, 0)');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
    }
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => glow.dispose(), [glow]);
  useFrame(() => { if (mesh.current) mesh.current.rotation.y = spinAngle(BODY_BY_ID.sun, clock.current.days); }, -50);
  return <group name="sun-group">
    <pointLight color="#fff0db" intensity={2.6} decay={0} />
    <mesh ref={mesh} name="sun" onClick={e => { e.stopPropagation(); onSelect(); }}>
      <sphereGeometry args={[4.4, 64, 48]} />
      <meshBasicMaterial map={texture} color="#ffdfb3" toneMapped={false} />
    </mesh>
    <Atmosphere radius={4.4} color="#ff963e" strength={0.9} />
    <sprite scale={[37, 37, 1]} raycast={() => undefined}>
      <spriteMaterial map={glow} transparent blending={AdditiveBlending} depthWrite={false} opacity={0.65} />
    </sprite>
    {labels && <Html position={[0, 6.4, 0]} center zIndexRange={[12, 0]}><button className="world-label" onClick={onSelect}><span style={{background:'#ffb75e'}} />Sol</button></Html>}
  </group>;
}
