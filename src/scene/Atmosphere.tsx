import { useMemo } from 'react';
import { Color, AdditiveBlending } from 'three';

export function Atmosphere({radius, color = '#489dff', strength = 0.65}: {radius: number; color?: string; strength?: number}) {
  const uniforms = useMemo(() => ({uColor: {value: new Color(color)}, uStrength: {value: strength}}), [color, strength]);
  return <mesh scale={radius * 1.045} raycast={() => undefined}>
    <sphereGeometry args={[1, 48, 32]} />
    <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} uniforms={uniforms}
      vertexShader={`varying vec3 vNormal; varying vec3 vView;
        void main() { vec4 p = modelViewMatrix * vec4(position, 1.0); vNormal = normalize(normalMatrix * normal); vView = -p.xyz; gl_Position = projectionMatrix * p; }`}
      fragmentShader={`uniform vec3 uColor; uniform float uStrength; varying vec3 vNormal; varying vec3 vView;
        void main() { float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.8); gl_FragColor = vec4(uColor, rim * uStrength); }`} />
  </mesh>;
}
