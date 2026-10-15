import { Vector3 } from 'three';
import type { CelestialBody } from '../data/bodies';

export const TAU = Math.PI * 2;
export const ROTATION_VISUAL_FACTOR = 0.04;
export interface SimulationClock { days: number }

/** Kepler equation M = E - e sin(E). Phases are artistic, not ephemerides. */
export function eccentricAnomaly(mean: number, eccentricity: number) {
  const m = ((mean % TAU) + TAU) % TAU;
  let e = m;
  for (let i = 0; i < 8; i++) e -= (e - eccentricity * Math.sin(e) - m) / (1 - eccentricity * Math.cos(e));
  return e;
}

/** Coordinates with the Sun at a focus; all callers share this exact transform. */
export function positionAtAnomaly(body: CelestialBody, e: number, out = new Vector3()) {
  const x = body.orbitRadius * (Math.cos(e) - body.eccentricity);
  const z = body.orbitRadius * Math.sqrt(1 - body.eccentricity ** 2) * Math.sin(e);
  const inc = body.inclination * Math.PI / 180;
  const cos = Math.cos(body.node), sin = Math.sin(body.node);
  const projectedZ = z * Math.cos(inc);
  return out.set(x * cos + projectedZ * sin, z * Math.sin(inc), -x * sin + projectedZ * cos);
}

export function orbitalPosition(body: CelestialBody, days: number, out = new Vector3()) {
  if (!body.orbitalDays) return out.set(0, 0, 0);
  const mean = body.phase + TAU * (days % body.orbitalDays) / body.orbitalDays;
  return positionAtAnomaly(body, eccentricAnomaly(mean, body.eccentricity), out);
}

export function advanceSimulation(clock: SimulationClock, delta: number, speed: number, visible = true) {
  if (visible && speed > 0) clock.days += Math.min(Math.max(delta, 0), 0.1) * Math.min(speed, 1000);
}

/** Tilt > 90° supplies retrograde direction; don't apply the negative sign twice. */
export const spinAngle = (body: CelestialBody, days: number) => TAU * ((days * 24 * ROTATION_VISUAL_FACTOR / Math.abs(body.rotationHours)) % 1);
export const smoothstep = (t: number) => { const p = Math.min(1, Math.max(0, t)); return p * p * (3 - 2 * p); };

export function focusDistance(body: CelestialBody) { return body.radius * (body.id === 'saturn' ? 8.2 : 4.8); }

export function focusOffset(body: CelestialBody, days: number, view: 'perspective' | 'top' | 'ecliptic', out = new Vector3()) {
  const distance = focusDistance(body);
  if (view === 'top') return out.set(0, distance, distance * 0.001);
  if (view === 'ecliptic') return out.set(0.64, 0.045, 0.77).normalize().multiplyScalar(distance);
  orbitalPosition(body, days, out).negate();
  if (out.lengthSq() < 0.01) out.set(0.5, 0, 1);
  out.y = 0;
  out.normalize().applyAxisAngle(new Vector3(0, 1, 0), 0.6);
  out.y = 0.30;
  return out.normalize().multiplyScalar(distance);
}

export function overviewOffset(showPluto: boolean, view: 'perspective' | 'top' | 'ecliptic', aspect = 1) {
  const extent = showPluto ? 196 : 138;
  const distance = extent / Math.sin(24 * Math.PI / 180) / Math.min(1, aspect) * 1.08;
  if (view === 'top') return new Vector3(0, distance, 0.01);
  if (view === 'ecliptic') return new Vector3(0, distance * 0.08, distance);
  return new Vector3(0.3, 0.6, 0.74).normalize().multiplyScalar(distance);
}
