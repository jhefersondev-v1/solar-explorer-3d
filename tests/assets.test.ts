import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BODIES } from '../src/data/bodies';

describe('Bundled assets', () => {
  it('includes a non-empty local WebP for every body and every additional layer', () => {
    const paths = [...BODIES.map(p => p.texture), '/textures/earth_nightmap.webp', '/textures/earth_clouds.webp', '/textures/moon.webp', '/textures/saturn_ring.webp'];
    for (const path of paths) {
      const bytes = readFileSync(resolve(process.cwd(), 'public', path.replace(/^\//, '')));
      expect(bytes.length, path).toBeGreaterThan(8000);
      expect(bytes.toString('ascii',0,4),path).toBe('RIFF');
      expect(bytes.toString('ascii',8,12),path).toBe('WEBP');
    }
  });
});
