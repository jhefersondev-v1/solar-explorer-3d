import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { BODY_BY_ID, PLANETS, dayLabel, massLabel, number, yearLabel } from '../data/bodies';
import type { BodyId, CelestialBody } from '../data/bodies';
import { BodyThumb, Modal } from './Primitives';

export function Comparison({onClose, reducedMotion}: {onClose: () => void; reducedMotion: boolean}) {
  const [a, setA] = useState<BodyId>('earth'), [b, setB] = useState<BodyId>('mars');
  const left = BODY_BY_ID[a], right = BODY_BY_ID[b];
  const max = Math.max(left.diameter, right.diameter);
  const change = (side: 'a' | 'b', id: BodyId) => {
    if (side === 'a') {setA(id); if (id === b) setB(a);} else {setB(id); if (id === a) setA(b);}
  };
  const rows: {label: string; format: (body: CelestialBody) => string}[] = [
    {label:'Diámetro ecuatorial', format:p => `${number(p.diameter)} km`},
    {label:'Masa', format:massLabel}, {label:'Distancia media al Sol', format:p => `${number(p.distanceMkm, 1)} M km`},
    {label:'Temperatura de referencia', format:p => `≈ ${p.temperatureC} °C`}, {label:'Día solar', format:p => dayLabel(p.solarDayHours)},
    {label:'Año', format:p => yearLabel(p.orbitalDays)}, {label:'Gravedad de referencia', format:p => `≈ ${number(p.gravity, 1)} m/s²`},
    {label:'Lunas conocidas', format:p => `${p.moons}`}, {label:'Atmósfera', format:p => p.atmosphere},
  ];
  return <Modal title="Dos mundos, otra perspectiva" onClose={onClose} className="comparison-modal" reducedMotion={reducedMotion}>
    <p className="modal-subtitle">Compara sus tamaños y descubre lo que los hace únicos.</p>
    <div className="comparison-selectors">
      <label>PRIMER PLANETA<select aria-label="Primer planeta" value={a} onChange={e => change('a', e.target.value as BodyId)}>{PLANETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      <button className="icon-button" aria-label="Intercambiar planetas" onClick={() => {setA(b); setB(a);}}><ArrowRightLeft size={19} /></button>
      <label>SEGUNDO PLANETA<select aria-label="Segundo planeta" value={b} onChange={e => change('b', e.target.value as BodyId)}>{PLANETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    </div>
    <div className="relative-size" aria-label="Diámetros a la misma escala">
      {[left, right].map(p => <div key={p.id}><div className="size-holder"><BodyThumb body={p} size={p.diameter / max * 135} /></div><strong style={{color:p.color}}>{p.name}</strong><small>{number(p.diameter)} km</small></div>)}
      <span className="size-scale">DIÁMETROS A LA MISMA ESCALA · ANILLOS EXCLUIDOS</span>
    </div>
    <div className="comparison-insight"><strong>{number(Math.max(left.diameter, right.diameter) / Math.min(left.diameter, right.diameter), 2)}×</strong><span>El diámetro de {left.diameter > right.diameter ? left.name : right.name} es ese múltiplo del de {left.diameter > right.diameter ? right.name : left.name}.</span></div>
    <div className="comparison-table"><table><thead><tr><th scope="col">Propiedad</th><th scope="col">{left.name}</th><th scope="col">{right.name}</th></tr></thead><tbody>{rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.format(left)}</td><td>{row.format(right)}</td></tr>)}</tbody></table></div>
    <p className="modal-footnote">Valores aproximados. Las temperaturas representan condiciones de referencia distintas en mundos rocosos y gigantes. Las lunas pueden actualizarse con nuevos descubrimientos.</p>
  </Modal>;
}
