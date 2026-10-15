import { useMemo, useRef, useState } from 'react';
import { Html, useCursor } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { DoubleSide, RingGeometry, type Group, type Mesh, type Texture } from 'three';
import type { RefObject } from 'react';
import type { CelestialBody } from '../data/bodies';
import { orbitalPosition, spinAngle, TAU, type SimulationClock } from '../lib/orbital';
import type { TexturePack } from './textures';
import { Atmosphere } from './Atmosphere';

export function SaturnRings({radius, texture, segments, onSelect}: {radius: number; texture?: Texture; segments: number; onSelect?: () => void}) {
  const geometry = useMemo(() => {
    const inner = radius * 1.24, outer = radius * 2.36;
    const ring = new RingGeometry(inner, outer, segments);
    const positions = ring.attributes.position, uv = ring.attributes.uv;
    for (let i = 0; i < positions.count; i++) uv.setXY(i, (Math.hypot(positions.getX(i), positions.getY(i)) - inner) / (outer - inner), 0.5);
    return ring;
  }, [radius, segments]);
  return <mesh name="saturn-rings" geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} onClick={e => {e.stopPropagation(); onSelect?.();}}>
    <meshStandardMaterial map={texture} color={texture ? '#ffffff' : '#c9b894'} transparent opacity={0.94} side={DoubleSide} roughness={1} depthWrite={false} />
  </mesh>;
}

function EarthSurface({day, night}: {day: Texture; night: Texture}) {
  const uniforms = useMemo(() => ({dayMap: {value: day}, nightMap: {value: night}}), [day, night]);
  return <shaderMaterial uniforms={uniforms}
    vertexShader={`varying vec2 vUv; varying vec3 vNormal; varying vec3 vWorld; varying vec3 vView;
      void main() { vUv = uv; vec4 world = modelMatrix * vec4(position, 1.0); vWorld = world.xyz;
        vNormal = normalize(mat3(modelMatrix) * normal); vView = cameraPosition - world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world; }`}
    fragmentShader={`uniform sampler2D dayMap; uniform sampler2D nightMap;
      varying vec2 vUv; varying vec3 vNormal; varying vec3 vWorld; varying vec3 vView;
      void main() {
        vec3 n = normalize(vNormal); vec3 light = normalize(-vWorld); float illumination = dot(n, light);
        vec3 surface = texture2D(dayMap, vUv).rgb;
        vec3 cities = texture2D(nightMap, vUv).rgb;
        float darkness = 1.0 - smoothstep(-0.12, 0.22, illumination);
        float ocean = smoothstep(0.06, 0.22, surface.b - max(surface.r, surface.g));
        float spec = pow(max(dot(n, normalize(light + normalize(vView))), 0.0), 80.0) * ocean * max(illumination, 0.0);
        vec3 color = surface * (0.045 + 1.28 * max(illumination, 0.0)) + cities * darkness * 0.72 + vec3(0.38, 0.51, 0.64) * spec;
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`} />;
}

function Moon({clock, textures, segments}: {clock: RefObject<SimulationClock>; textures: TexturePack; segments: number}) {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const angle = clock.current.days / 27.3 * TAU + 1;
    ref.current.position.set(Math.cos(angle) * 3.35, Math.sin(angle) * 0.30, Math.sin(angle) * 3.35);
    ref.current.rotation.y = -angle;
  }, -40);
  return <mesh ref={ref} name="moon" position={[1.81, 0.25, 2.82]}>
    <sphereGeometry args={[0.327, segments, segments / 2]} />
    <meshStandardMaterial map={textures['/textures/moon.webp']} color="#b8b8b8" roughness={1} />
  </mesh>;
}

export function Planet({body, clock, textures, selected, labels, lowQuality, onSelect}: {
  body: CelestialBody; clock: RefObject<SimulationClock>; textures: TexturePack;
  selected: boolean; labels: boolean; lowQuality: boolean; onSelect: (id: CelestialBody['id']) => void;
}) {
  const root = useRef<Group>(null), surface = useRef<Mesh>(null), clouds = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const segments = lowQuality ? 32 : 64;
  const initialPosition = useMemo(() => orbitalPosition(body, clock.current.days), [body, clock]);
  useFrame(() => {
    if (root.current) orbitalPosition(body, clock.current.days, root.current.position);
    if (surface.current) surface.current.rotation.y = spinAngle(body, clock.current.days) + 1.8;
    if (clouds.current) clouds.current.rotation.y = spinAngle(body, clock.current.days) * 1.035 + 1.8;
  }, -50);
  const pick = (e: ThreeEvent<MouseEvent>) => {e.stopPropagation(); onSelect(body.id);};
  const day = textures[body.texture], night = textures['/textures/earth_nightmap.webp'];
  return <group ref={root} position={initialPosition} name={`planet-group-${body.id}`}>
    <group rotation={[0, 0, body.tilt * Math.PI / 180]}>
      <mesh ref={surface} name={`planet-${body.id}`} onClick={pick} onPointerOver={e => {e.stopPropagation(); setHovered(true);}} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[body.radius, segments, segments / 2]} />
        {body.id === 'earth' && day && night ? <EarthSurface day={day} night={night} /> :
          <meshStandardMaterial map={day} color={day ? '#ffffff' : body.color} roughness={0.94} />}
      </mesh>
      {body.id === 'earth' && <>
        <mesh ref={clouds} scale={body.radius * 1.011} raycast={() => undefined}>
          <sphereGeometry args={[1, segments, segments / 2]} />
          <meshStandardMaterial alphaMap={textures['/textures/earth_clouds.webp']} color="#ffffff" transparent opacity={textures['/textures/earth_clouds.webp'] ? 0.48 : 0} depthWrite={false} roughness={1} />
        </mesh>
        <Atmosphere radius={body.radius} strength={0.72} />
      </>}
      {body.id === 'venus' && <Atmosphere radius={body.radius} color="#e4bd81" strength={0.2} />}
      {body.id === 'saturn' && <SaturnRings radius={body.radius} texture={textures['/textures/saturn_ring.webp']} segments={lowQuality ? 96 : 192} onSelect={() => onSelect(body.id)} />}
      {body.id === 'uranus' && <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => undefined}>
        <ringGeometry args={[body.radius * 1.65, body.radius * 1.72, 96]} />
        <meshBasicMaterial color="#749394" side={DoubleSide} transparent opacity={0.34} depthWrite={false} />
      </mesh>}
    </group>
    {body.id === 'earth' && <Moon clock={clock} textures={textures} segments={lowQuality ? 24 : 48} />}
    {labels && <Html center position={[0, body.radius * (body.id === 'saturn' ? 2.5 : 1.5) + 0.5, 0]} zIndexRange={[12, 0]} occlude>
      <button className={`world-label ${selected ? 'selected' : ''}`} onClick={() => onSelect(body.id)} aria-label={`Viajar a ${body.name}`}>
        <span style={{background: body.color}} />{body.name}
      </button>
    </Html>}
  </group>;
}
