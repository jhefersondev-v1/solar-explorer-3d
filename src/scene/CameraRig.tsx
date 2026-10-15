import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PerspectiveCamera, Vector3 } from 'three';
import type { ComponentRef, Dispatch, RefObject } from 'react';
import { BODY_BY_ID } from '../data/bodies';
import { focusOffset, orbitalPosition, overviewOffset, smoothstep, type SimulationClock } from '../lib/orbital';
import type { Action, ExplorerState } from '../state/explorer';

export function CameraRig({state, dispatch, clock, reducedMotion}: {
  state: ExplorerState; dispatch: Dispatch<Action>; clock: RefObject<SimulationClock>; reducedMotion: boolean;
}) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const {camera, size, performance} = useThree();
  const initialized = useRef(false);
  const comparing = state.mode === 'compare';
  const educational = state.mode === 'education';
  const previous = useRef(new Vector3()), position = useRef(new Vector3()), deltaPosition = useRef(new Vector3());
  const flight = useRef({active: false, elapsed: 0, duration: 2.4, from: new Vector3(), fromTarget: new Vector3(), offset: new Vector3(), lift: 0});

  useEffect(() => {
    if (!controls.current) return;
    const body = state.selected ? BODY_BY_ID[state.selected] : null;
    const target = body ? orbitalPosition(body, clock.current.days) : new Vector3();
    const offset = body ? focusOffset(body, clock.current.days, state.view) : overviewOffset(state.showPluto, state.view, size.width / size.height);
    const portrait = size.width < 768 && size.height >= size.width;
    const compactLandscape = size.width <= 900 && size.height < 530 && size.width > size.height;
    const upperEdge = educational ? 264 : 147;
    const lowerEdge = size.height * (educational ? .75 : .72) - 175;
    const usableHeight = Math.max(70, lowerEdge - upperEdge);
    if (body && portrait) {
      // Fit the destination into the space between the header and the mobile sheet.
      const framingRadius = body.radius * (body.id === 'saturn' ? 2.36 : 1);
      const angle = Math.atan(usableHeight * .82 / size.height * Math.tan(24 * Math.PI / 180));
      const distance = Math.max(offset.length(), framingRadius / Math.sin(angle));
      offset.normalize().multiplyScalar(distance);
    }
    if (camera instanceof PerspectiveCamera) {
      const offsetX = (size.width >= 1024 || compactLandscape) && body && !comparing ? -size.width * 0.105 : 0;
      const offsetY = portrait && body ? size.height / 2 - (upperEdge + usableHeight / 2) : size.height * 0.025;
      camera.setViewOffset(size.width, size.height, offsetX, offsetY, size.width, size.height);
      camera.updateProjectionMatrix();
    }
    controls.current.minDistance = body ? body.radius * (body.id === 'saturn' ? 2.8 : 1.18) : 6;
    const f = flight.current;
    f.from.copy(camera.position); f.fromTarget.copy(controls.current.target); f.offset.copy(offset);
    f.elapsed = 0; f.duration = initialized.current && !reducedMotion ? 2.4 : 0;
    f.lift = f.from.distanceTo(target.clone().add(offset)) > 20 ? Math.min(65, f.from.distanceTo(target) * 0.16 + 5) : 0;
    f.active = true; controls.current.enabled = false; initialized.current = true;
  // Commands capture a new destination. Orbital time stays outside React renders.
  }, [camera, clock, reducedMotion, size.width, size.height, state.cameraCommand, state.selected, state.view, state.showPluto, comparing, educational]);

  useFrame((_, delta) => {
    const orbit = controls.current;
    if (!orbit) return;
    const body = state.selected ? BODY_BY_ID[state.selected] : null;
    const target = body ? orbitalPosition(body, clock.current.days, position.current) : position.current.set(0, 0, 0);
    const f = flight.current;
    if (f.active) {
      f.elapsed += Math.min(delta, .1);
      const raw = f.duration === 0 ? 1 : Math.min(1, f.elapsed / f.duration), t = smoothstep(raw);
      deltaPosition.current.copy(target).add(f.offset);
      camera.position.lerpVectors(f.from, deltaPosition.current, t);
      camera.position.y += Math.sin(Math.PI * raw) * f.lift;
      orbit.target.lerpVectors(f.fromTarget, target, t);
      camera.lookAt(orbit.target); orbit.update();
      if (raw === 1) {f.active = false; orbit.enabled = true; previous.current.copy(target);}
    } else {
      if (body && state.follow) {
        deltaPosition.current.subVectors(target, previous.current);
        camera.position.add(deltaPosition.current); orbit.target.add(deltaPosition.current);
      }
      previous.current.copy(target);
    }
  }, -10);

  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.07} maxDistance={1800}
    autoRotate={state.mode === 'cinematic' && !state.tourPaused && !reducedMotion} autoRotateSpeed={0.6}
    onStart={() => {performance.regress(); dispatch({type: 'interrupt-tour'});}} />;
}
