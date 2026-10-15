import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import type { CelestialBody } from '../data/bodies';
import { positionAtAnomaly, TAU } from '../lib/orbital';

export function Orbit({body, selected}: {body: CelestialBody; selected: boolean}) {
  const points = useMemo(() => Array.from({length: 257}, (_, i) => positionAtAnomaly(body, i / 256 * TAU)), [body]);
  return <Line points={points} color={selected ? '#8fc5d5' : '#49607a'} lineWidth={selected ? 1 : 0.55}
    transparent opacity={selected ? 0.48 : 0.18} raycast={() => undefined} name={`orbit-${body.id}`} />;
}
