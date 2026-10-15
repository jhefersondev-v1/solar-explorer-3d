import { useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, Stars } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import type { Dispatch, RefObject } from 'react';
import { getVisibleBodies } from '../data/bodies';
import type { SimulationClock } from '../lib/orbital';
import { advanceSimulation } from '../lib/orbital';
import type { Action, ExplorerState } from '../state/explorer';
import { CameraRig } from './CameraRig';
import { Planet } from './Planet';
import { Sun } from './Sun';
import { Orbit } from './Orbits';
import { Asteroids } from './Asteroids';
import { useLocalTextures } from './textures';

interface UniverseProps {
  state: ExplorerState; dispatch: Dispatch<Action>; clock: RefObject<SimulationClock>;
  reducedMotion: boolean; onProgress: (value: number) => void; onReady: (failed: string[]) => void;
  onContextLost: () => void;
}
function Scene({state, dispatch, clock, reducedMotion, onProgress, onReady, onContextLost, lowQuality}: UniverseProps & {lowQuality: boolean}) {
  const textures = useLocalTextures(onProgress, onReady);
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const element = gl.domElement;
    const lost = (e: Event) => {e.preventDefault(); onContextLost();};
    element.addEventListener('webglcontextlost', lost);
    return () => element.removeEventListener('webglcontextlost', lost);
  }, [gl, onContextLost]);
  useFrame((_, delta) => advanceSimulation(clock.current, delta, state.speed, !document.hidden && Boolean(textures['/textures/sun.webp'])), -100);
  const visible = getVisibleBodies(state.showPluto);
  return <>
    <ambientLight intensity={0.17} color="#adc5ee" />
    <Stars radius={500} depth={240} count={lowQuality ? 2600 : 6500} factor={lowQuality ? 2.4 : 2.2} saturation={0.25} fade speed={reducedMotion ? 0 : 0.08} />
    <Sun clock={clock} texture={textures['/textures/sun.webp']} labels={state.showNames} onSelect={() => dispatch({type:'select', id:'sun'})} />
    {visible.filter(body => body.id !== 'sun').map(body => <Planet key={body.id} body={body} clock={clock} textures={textures} selected={state.selected === body.id}
      labels={state.showNames} lowQuality={lowQuality} onSelect={id => dispatch({type:'select', id})} />)}
    {state.showOrbits && visible.filter(body => body.id !== 'sun').map(body => <Orbit key={body.id} body={body} selected={body.id === state.selected} />)}
    <Asteroids clock={clock} lowQuality={lowQuality} />
    <CameraRig state={state} dispatch={dispatch} clock={clock} reducedMotion={reducedMotion} />
    <AdaptiveDpr />
  </>;
}
export default function Universe(props: UniverseProps) {
  const [degraded, setDegraded] = useState(false);
  const smallDevice = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches || navigator.hardwareConcurrency <= 4;
  const lowQuality = props.state.quality === 'low' || props.state.quality === 'auto' && (smallDevice || degraded);
  return <div className="universe-canvas" aria-label="Sistema solar tridimensional interactivo">
    <Canvas camera={{position:[50, 70, 100], fov:48, near:0.025, far:2500}}
      gl={{antialias: !smallDevice, alpha: true, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping}}
      dpr={lowQuality ? 1 : [1, 1.75]} performance={{min:0.6}}>
      {props.state.quality === 'auto' && !smallDevice && <PerformanceMonitor onDecline={() => setDegraded(true)} />}
      <Scene {...props} lowQuality={lowQuality} />
    </Canvas>
  </div>;
}
