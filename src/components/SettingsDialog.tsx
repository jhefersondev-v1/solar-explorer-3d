import type { Dispatch } from 'react';
import { Check, Monitor, Smartphone, Zap } from 'lucide-react';
import type { Action, ExplorerState, Quality } from '../state/explorer';
import { Modal } from './Primitives';

export function SettingsDialog({state, dispatch, onClose, reducedMotion}: {state: ExplorerState; dispatch: Dispatch<Action>; onClose: () => void; reducedMotion: boolean}) {
  const qualities = [{id:'auto', title:'Automática', description:'Se adapta a tu dispositivo y al rendimiento.', icon:Zap}, {id:'high', title:'Alta', description:'Más estrellas y mayor detalle geométrico.', icon:Monitor}, {id:'low', title:'Ligera', description:'Menor carga para móviles y equipos modestos.', icon:Smartphone}] as const;
  return <Modal title="A tu manera" onClose={onClose} reducedMotion={reducedMotion}>
    <p className="section-label">CALIDAD GRÁFICA</p>
    <div className="quality-options" role="radiogroup" aria-label="Calidad gráfica">
      {qualities.map(({id, title, description, icon:Icon}) => <button key={id} role="radio" aria-checked={state.quality === id} className={state.quality === id ? 'active' : ''} onClick={() => dispatch({type:'quality', quality:id as Quality})}>
        <Icon size={18} /><span><strong>{title}</strong><small>{description}</small></span>{state.quality === id && <Check size={16} />}
      </button>)}
    </div>
    <p className="section-label">EN EL UNIVERSO</p>
    {[{key:'showOrbits', label:'Trayectorias orbitales', description:'Observa cómo cada mundo recorre el espacio.'}, {key:'showNames', label:'Nombres de los mundos', description:'Etiquetas seleccionables dentro de la escena.'}, {key:'showPluto', label:'Incluir Plutón', description:'Explora también este planeta enano.'}].map(({key, label, description}) => <div className="setting-row" key={key}>
      <span><strong>{label}</strong><small>{description}</small></span><button role="switch" className={`switch ${state[key as 'showOrbits'] ? 'on' : ''}`} aria-label={label} aria-checked={state[key as 'showOrbits']} onClick={() => dispatch({type:'toggle', key:key as 'showOrbits' | 'showNames' | 'showPluto'})}><span /></button>
    </div>)}
    <p className="modal-footnote">En modo automático, la resolución se reduce si el dispositivo necesita más fluidez. Las preferencias de movimiento reducido se respetan.</p>
  </Modal>;
}
