import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { SRGBColorSpace, TextureLoader, type Texture } from 'three';
import { BODIES } from '../data/bodies';

export type TexturePack = Record<string, Texture | undefined>;
const paths = [...BODIES.map(body => body.texture), '/textures/earth_nightmap.webp', '/textures/earth_clouds.webp', '/textures/moon.webp', '/textures/saturn_ring.webp'];

export function useLocalTextures(onProgress: (value: number) => void, onReady: (failed: string[]) => void) {
  const gl = useThree(state => state.gl);
  const [pack, setPack] = useState<TexturePack>({});
  useEffect(() => {
    let cancelled = false;
    let completed = 0;
    const loaded: TexturePack = {}, failed: string[] = [];
    const loader = new TextureLoader();
    const finish = () => {
      completed++;
      if (cancelled) return;
      onProgress(Math.round(completed / paths.length * 100));
      if (completed === paths.length) { setPack(loaded); onReady(failed); }
    };
    paths.forEach(path => {
      loader.load(path, tex => {
        if (cancelled) { tex.dispose(); return; }
        tex.colorSpace = SRGBColorSpace;
        tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        loaded[path] = tex;
        finish();
      }, undefined, () => { failed.push(path); finish(); });
    });
    return () => { cancelled = true; Object.values(loaded).forEach(tex => tex?.dispose()); };
  }, [gl, onProgress, onReady]);
  return pack;
}
