import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, Orbit, Tags, Settings2, Scan, Compass, Layers, AlignHorizontalJustifyCenter, Crosshair } from 'lucide-react';
import type { CSSProperties, Dispatch, RefObject } from 'react';
import type { SimulationClock } from '../lib/orbital';
import type { Action, ExplorerState, View } from '../state/explorer';
import { number } from '../data/bodies';
import { IconButton } from './Primitives';

export function CameraControls({state, dispatch, onSettings}: {state: ExplorerState; dispatch: Dispatch<Action>; onSettings: () => void}) {
  const views = [{id:'perspective', label:'Perspectiva 3D', icon:Compass}, {id:'top', label:'Vista superior', icon:Layers}, {id:'ecliptic', label:'Plano orbital', icon:AlignHorizontalJustifyCenter}] as const;
  return <aside className="camera-toolbar" aria-label="Herramientas de exploración">
    <div className="toolbar-group glass">
      {views.map(({id, label, icon:Icon}) => <IconButton key={id} label={label} active={state.view === id} aria-pressed={state.view === id} onClick={() => dispatch({type:'view', view:id as View})}><Icon size={18} strokeWidth={1.4} /></IconButton>)}
    </div>
    <div className="toolbar-group glass">
      <IconButton label={state.showOrbits ? 'Ocultar órbitas' : 'Mostrar órbitas'} active={state.showOrbits} aria-pressed={state.showOrbits} onClick={() => dispatch({type:'toggle', key:'showOrbits'})}><Orbit size={19} strokeWidth={1.4} /></IconButton>
      <IconButton label={state.showNames ? 'Ocultar nombres' : 'Mostrar nombres'} active={state.showNames} aria-pressed={state.showNames} onClick={() => dispatch({type:'toggle', key:'showNames'})}><Tags size={18} strokeWidth={1.4} /></IconButton>
      <IconButton label="Seguir planeta" disabled={!state.selected} active={state.follow} aria-pressed={state.follow} onClick={() => dispatch({type:'toggle', key:'follow'})}><Crosshair size={18} strokeWidth={1.4} /></IconButton>
    </div>
    <div className="toolbar-group glass">
      <IconButton label="Vista general" onClick={() => dispatch({type:'overview'})}><Scan size={18} strokeWidth={1.4} /></IconButton>
      <IconButton label="Restablecer cámara" onClick={() => dispatch({type:'reset'})}><RotateCcw size={17} strokeWidth={1.4} /></IconButton>
      <IconButton label="Ajustes de visualización" onClick={onSettings}><Settings2 size={18} strokeWidth={1.4} /></IconButton>
    </div>
  </aside>;
}

export function TimeControls({state, dispatch, clock}: {state: ExplorerState; dispatch: Dispatch<Action>; clock: RefObject<SimulationClock>}) {
  const [days, setDays] = useState(0);
  useEffect(() => {const interval = window.setInterval(() => setDays(Math.floor(clock.current.days)), 250); return () => window.clearInterval(interval);}, [clock]);
  const progress = Math.log10(state.speed + 1) / Math.log10(1001) * 1000;
  return <section className="time-controls" aria-label="Control del tiempo">
    <IconButton label={state.speed > 0 ? 'Pausar tiempo' : 'Reanudar tiempo'} className="play-button" onClick={() => dispatch({type:'pause'})}>
      {state.speed > 0 ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
    </IconButton>
    <div className="simulation-status"><span className={`status-dot ${state.speed === 0 ? 'paused' : ''}`} /><div><strong>{state.speed > 0 ? 'EN MOVIMIENTO' : 'EN PAUSA'}</strong><span>Día simulado {number(days).padStart(3, '0')}</span></div></div>
    <div className="time-divider" />
    <div className="speed-control"><div className="speed-heading"><label htmlFor="speed-slider">VELOCIDAD DEL TIEMPO</label><div className="speed-value"><input type="number" aria-label="Velocidad exacta" value={state.speed} min={0} max={1000} step={0.1} onChange={e => dispatch({type:'speed', speed:Number(e.target.value)})} /><span>×</span></div></div>
      <input id="speed-slider" className="speed-slider" type="range" min={0} max={1000} step={1} value={progress} aria-valuetext={`${state.speed}x, días simulados por segundo`} style={{'--progress':`${progress / 10}%`} as CSSProperties}
        onChange={e => dispatch({type:'speed', speed:Math.round((1001 ** (Number(e.target.value) / 1000) - 1) * 10) / 10})} />
      <div className="speed-presets">{[0,1,10,100,1000].map(speed => <button key={speed} className={state.speed === speed ? 'active' : ''} onClick={() => dispatch({type:'speed', speed})}>{speed}×</button>)}</div>
    </div>
    <p className="time-note">1× = 1 día terrestre / segundo</p>
  </section>;
}
