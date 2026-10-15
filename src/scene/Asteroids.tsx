import { useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D, type InstancedMesh } from 'three';
import type { RefObject } from 'react';
import { TAU, type SimulationClock } from '../lib/orbital';

export function Asteroids({clock, lowQuality}: {clock: RefObject<SimulationClock>; lowQuality: boolean}) {
  const ref = useRef<InstancedMesh>(null), count = lowQuality ? 650 : 1600;
  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new Object3D(); let seed = 72;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < count; i++) {
      const angle = random() * TAU, distance = 40 + random() * 8;
      dummy.position.set(Math.cos(angle) * distance, (random() - .5) * 1.4, Math.sin(angle) * distance);
      dummy.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
      dummy.scale.setScalar(.025 + random() * .065); dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [count]);
  useFrame(() => { if (ref.current) ref.current.rotation.y = clock.current.days / 1680 * TAU; }, -50);
  return <instancedMesh key={count} ref={ref} args={[undefined, undefined, count]} name="asteroid-belt" raycast={() => undefined}>
    <icosahedronGeometry args={[1, 0]} />
    <meshStandardMaterial color="#787b82" roughness={1} />
  </instancedMesh>;
}
