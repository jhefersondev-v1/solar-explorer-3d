import { describe, expect, it, vi } from 'vitest';
import { create, act } from '@react-three/test-renderer';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3, type Mesh, type Group } from 'three';
import { BODY_BY_ID } from '../src/data/bodies';
import { Planet, SaturnRings } from '../src/scene/Planet';
import { CameraRig } from '../src/scene/CameraRig';
import { Asteroids } from '../src/scene/Asteroids';
import { orbitalPosition, focusDistance } from '../src/lib/orbital';
import { explorerReducer, initialState } from '../src/state/explorer';
import type { RootState } from '@react-three/fiber';

describe('Real R3F scene graph (no browser or GPU)', () => {
  it('clicking the Earth mesh selects it, and frame updates move and rotate it with the Moon', async () => {
    const clock = {current:{days:0}}, onSelect = vi.fn();
    const renderer = await create(<Planet body={BODY_BY_ID.earth} clock={clock} textures={{}} selected={true} labels={false} lowQuality={false} onSelect={onSelect} />);
    const mesh = renderer.scene.findByProps({name:'planet-earth'});
    await renderer.fireEvent(mesh, 'click'); expect(onSelect).toHaveBeenCalledWith('earth');
    const root = renderer.scene.findByProps({name:'planet-group-earth'}).instance as Group;
    const before = root.position.clone();
    clock.current.days = 10; await renderer.advanceFrames(1,.016);
    expect(root.position.distanceTo(before)).toBeGreaterThan(1);
    expect(root.position.distanceTo(orbitalPosition(BODY_BY_ID.earth,10))).toBeLessThan(1e-9);
    const moon = renderer.scene.findByProps({name:'moon'}).instance as Mesh;
    expect(moon.position.length()).toBeCloseTo(3.35,1);
    const paused = root.position.clone(), rotation = (mesh.instance as Mesh).rotation.y;
    await renderer.advanceFrames(10,.1);
    expect(root.position.equals(paused)).toBe(true); expect((mesh.instance as Mesh).rotation.y).toBe(rotation);
    await renderer.unmount();
  });
  it('Saturn has genuine ring geometry with UVs based on radial distance', async () => {
    const onSelect = vi.fn();
    const renderer = await create(<SaturnRings radius={BODY_BY_ID.saturn.radius} segments={192} onSelect={onSelect} />);
    const rings = renderer.scene.findByProps({name:'saturn-rings'}).instance as Mesh;
    expect(rings.geometry.type).toBe('RingGeometry');
    const uv = rings.geometry.attributes.uv;
    expect([...Array(uv.count).keys()].every(i => uv.getX(i) >= -.001 && uv.getX(i) <= 1.001)).toBe(true);
    expect(rings.rotation.x).toBeCloseTo(-Math.PI / 2);
    await renderer.fireEvent(renderer.scene.findByProps({name:'saturn-rings'}), 'click');
    expect(onSelect).toHaveBeenCalledOnce();
    await renderer.unmount();
  });
  it('renders the asteroid belt in one instanced object with reduced counts for mobile', async () => {
    const renderer = await create(<Asteroids clock={{current:{days:0}}} lowQuality={true} />);
    expect(renderer.scene.findByProps({name:'asteroid-belt'}).props.args[2]).toBe(650);
    await renderer.unmount();
  });
  it('flies to the selected planet, tracks its orbit, permits free camera and restores the overview', async () => {
    let captured: RootState | undefined;
    function Probe() {captured = useThree(); return null;}
    const clock = {current:{days:0}}, dispatch = vi.fn();
    let state = {...initialState};
    const tree = () => <><CameraRig state={state} dispatch={dispatch} clock={clock} reducedMotion={false} /><Probe /></>;
    const renderer = await create(tree(), {width:1280, height:800, camera:{position:[50,70,100],fov:48}});
    await renderer.advanceFrames(1,.016);
    const cam = captured!.camera as PerspectiveCamera;
    expect(cam.position.distanceTo(orbitalPosition(BODY_BY_ID.earth,0))).toBeCloseTo(focusDistance(BODY_BY_ID.earth),4);
    const offset = cam.position.clone().sub(orbitalPosition(BODY_BY_ID.earth,0));
    clock.current.days = 10; await renderer.advanceFrames(1,.016);
    expect(cam.position.clone().sub(orbitalPosition(BODY_BY_ID.earth,10)).distanceTo(offset)).toBeLessThan(1e-7);
    state = explorerReducer(state, {type:'toggle',key:'follow'}); await renderer.update(tree());
    const fixed = cam.position.clone(); clock.current.days = 20; await renderer.advanceFrames(1,.016);
    expect(cam.position.distanceTo(fixed)).toBeLessThan(1e-7);
    state = explorerReducer(state, {type:'select',id:'jupiter'}); await renderer.update(tree());
    await act(async () => {await renderer.advanceFrames(30,.1);});
    expect(cam.position.distanceTo(orbitalPosition(BODY_BY_ID.jupiter,20))).toBeCloseTo(focusDistance(BODY_BY_ID.jupiter),3);
    state = explorerReducer(state, {type:'view',view:'top'}); await renderer.update(tree()); await renderer.advanceFrames(30,.1);
    const top = cam.position.clone().sub(orbitalPosition(BODY_BY_ID.jupiter,20));
    expect(top.y).toBeGreaterThan(top.length() * .999);
    state = explorerReducer(state, {type:'overview'}); await renderer.update(tree()); await renderer.advanceFrames(30,.1);
    expect((captured!.controls as unknown as {target:Vector3}).target.length()).toBeLessThan(1e-6);
    expect(cam.position.length()).toBeGreaterThan(300);
    await renderer.unmount();
  });
  it('fits a focused planet between the header and information sheet on a portrait phone', async () => {
    let captured: RootState | undefined;
    function Probe() {captured = useThree(); return null;}
    const renderer = await create(<><CameraRig state={initialState} dispatch={vi.fn()} clock={{current:{days:0}}} reducedMotion={true} /><Probe /></>, {width:390,height:844,camera:{position:[50,70,100],fov:48}});
    await renderer.advanceFrames(1,.016);
    const cam = captured!.camera as PerspectiveCamera;
    const body = BODY_BY_ID.earth, distance = cam.position.distanceTo(orbitalPosition(body,0));
    const radiusPixels = Math.tan(Math.asin(body.radius / distance)) / Math.tan(24*Math.PI/180) * 844 / 2;
    const centerY = 844/2 - cam.view!.offsetY;
    expect(centerY - radiusPixels).toBeGreaterThan(147);
    expect(centerY + radiusPixels).toBeLessThan(844*.72-175);
    await renderer.unmount();
  });
});
