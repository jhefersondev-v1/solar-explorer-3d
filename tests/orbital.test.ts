import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { BODIES, BODY_BY_ID, getVisibleBodies, searchBodies } from '../src/data/bodies';
import { advanceSimulation, eccentricAnomaly, focusDistance, focusOffset, orbitalPosition, overviewOffset, positionAtAnomaly, spinAngle, TAU } from '../src/lib/orbital';
import { explorerReducer, initialState } from '../src/state/explorer';

describe('Orbital mechanics and simulation time', () => {
  it.each(BODIES.filter(p => p.id !== 'sun'))('$name returns to the same position after one sidereal year', body => {
    expect(orbitalPosition(body, 0).distanceTo(orbitalPosition(body, body.orbitalDays))).toBeLessThan(1e-9);
  });
  it('solves Kepler for all eccentricities used by the model', () => {
    for (const body of BODIES) for (let i=0; i<128; i++) {
      const mean = i / 128 * TAU, e = eccentricAnomaly(mean, body.eccentricity);
      expect(Math.abs(e - body.eccentricity * Math.sin(e) - mean)).toBeLessThan(1e-10);
    }
  });
  it('places the Sun at the focus and preserves perihelion and aphelion distances', () => {
    for (const body of BODIES.filter(p => p.id !== 'sun')) {
      expect(positionAtAnomaly(body, 0).length()).toBeCloseTo(body.orbitRadius * (1 - body.eccentricity), 8);
      expect(positionAtAnomaly(body, Math.PI).length()).toBeCloseTo(body.orbitRadius * (1 + body.eccentricity), 8);
    }
  });
  it('makes Mercury travel faster near perihelion than near aphelion', () => {
    const body = BODY_BY_ID.mercury, step = .001;
    const periSpeed = positionAtAnomaly(body, eccentricAnomaly(step, body.eccentricity)).distanceTo(positionAtAnomaly(body, 0));
    const apoSpeed = positionAtAnomaly(body, eccentricAnomaly(Math.PI + step, body.eccentricity)).distanceTo(positionAtAnomaly(body, Math.PI));
    expect(periSpeed / apoSpeed).toBeGreaterThan(1.4);
  });
  it('freezes position and axial rotation at 0x, and does not advance in background tabs', () => {
    const clock = {days:19};
    const position = orbitalPosition(BODY_BY_ID.earth, clock.days), angle = spinAngle(BODY_BY_ID.earth, clock.days);
    advanceSimulation(clock, .1, 0); advanceSimulation(clock, .1, 1000, false);
    expect(clock.days).toBe(19);
    expect(orbitalPosition(BODY_BY_ID.earth, clock.days).equals(position)).toBe(true);
    expect(spinAngle(BODY_BY_ID.earth, clock.days)).toBe(angle);
  });
  it('caps large frame deltas and supports 1000x without unstable orbital coordinates', () => {
    const clock = {days:0}; advanceSimulation(clock, 20, 1000); expect(clock.days).toBe(100);
    for (const body of BODIES) expect(orbitalPosition(body, 1e12).toArray().every(Number.isFinite)).toBe(true);
  });
  it.each(BODIES)('focus framing of $name stays outside its sphere in every view', body => {
    for (const view of ['perspective','top','ecliptic'] as const) {
      expect(focusOffset(body, 14, view).length()).toBeGreaterThan(body.radius * 2.5);
      expect(focusOffset(body, 14, view).length()).toBeCloseTo(focusDistance(body), view === 'ecliptic' ? 1 : 3);
    }
  });
  it('fits overview to portrait screens and Pluto’s distant aphelion', () => {
    const desktop = overviewOffset(true,'top',1.6), mobile = overviewOffset(true,'top',.45);
    expect(mobile.length()).toBeGreaterThan(desktop.length() * 2);
    const visibleHalfWidth = mobile.length() * Math.sin(24 * Math.PI / 180) * .45;
    expect(visibleHalfWidth).toBeGreaterThan(BODY_BY_ID.pluto.orbitRadius * (1 + BODY_BY_ID.pluto.eccentricity));
    expect(orbitalPosition(BODY_BY_ID.sun, 400).equals(new Vector3())).toBe(true);
  });
});

describe('Search and navigation state', () => {
  it('finds accented Spanish names, English IDs and hidden Pluto', () => {
    expect(searchBodies('JUPITER')[0].id).toBe('jupiter');
    expect(searchBodies('pluton')[0].id).toBe('pluto');
    expect(searchBodies('earth')[0].id).toBe('earth');
    expect(searchBodies('inventado')).toHaveLength(0);
  });
  it('keeps precisely eight planets by default, and includes Pluto on demand', () => {
    expect(getVisibleBodies(false).filter(p => p.id !== 'sun')).toHaveLength(8);
    expect(getVisibleBodies(true).filter(p => p.id !== 'sun')).toHaveLength(9);
  });
  it('remembers the speed across pause and clamps invalid inputs', () => {
    const faster = explorerReducer(initialState, {type:'speed', speed:1000});
    const paused = explorerReducer(faster, {type:'pause'});
    expect(paused.speed).toBe(0); expect(explorerReducer(paused, {type:'pause'}).speed).toBe(1000);
    expect(explorerReducer(initialState, {type:'speed', speed:Infinity}).speed).toBe(0);
    expect(explorerReducer(initialState, {type:'speed', speed:2000}).speed).toBe(1000);
  });
  it('enables Pluto when searched, and clears the target when Pluto is hidden', () => {
    const selected = explorerReducer(initialState, {type:'select', id:'pluto'});
    expect(selected.showPluto).toBe(true);
    const hidden = explorerReducer(selected, {type:'toggle', key:'showPluto'});
    expect(hidden.selected).toBeNull(); expect(hidden.follow).toBe(false);
    expect(hidden.cameraCommand).toBeGreaterThan(selected.cameraCommand);
  });
  it('stops the tour on direct selection, and reframes when following is restored', () => {
    const tour = explorerReducer(initialState, {type:'mode', mode:'cinematic'});
    const manual = explorerReducer(tour, {type:'select', id:'saturn'});
    expect(manual.mode).toBe('explore'); expect(manual.follow).toBe(true);
    const free = explorerReducer(manual, {type:'toggle', key:'follow'});
    const tracking = explorerReducer(free, {type:'toggle', key:'follow'});
    expect(tracking.cameraCommand).toBeGreaterThan(free.cameraCommand);
  });
});
