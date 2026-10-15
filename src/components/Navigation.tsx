import { Compass, GraduationCap, ArrowRightLeft, Film, Search, Maximize, Minimize, CircleHelp, Orbit, Scan, MoveUpRight } from 'lucide-react';
import { getVisibleBodies } from '../data/bodies';
import type { Dispatch } from 'react';
import type { Action, ExplorerState, Mode } from '../state/explorer';
import { BodyThumb, IconButton } from './Primitives';

export function Navigation({state, dispatch, onSearch, onHelp, onFullscreen, fullscreen, fullscreenSupported}: {
  state: ExplorerState; dispatch: Dispatch<Action>; onSearch: () => void; onHelp: () => void;
  onFullscreen: () => void; fullscreen: boolean; fullscreenSupported: boolean;
}) {
  const modes = [
    {id:'explore', label:'Explorar', icon:Compass}, {id:'education', label:'Aprender', icon:GraduationCap},
    {id:'compare', label:'Comparar', icon:ArrowRightLeft}, {id:'cinematic', label:'Cinemático', icon:Film},
  ] as const;
  return <header className="navigation">
    <div className="brand"><span className="brand-mark"><Orbit size={31} strokeWidth={1.15} /></span>
      <div><h1>SOLAR EXPLORER <span>3D</span></h1><p>Explora nuestro universo, un planeta a la vez</p></div>
    </div>
    <nav className="mode-nav glass" aria-label="Modos de exploración">
      {modes.map(({id, label, icon:Icon}) => <button key={id} className={state.mode === id ? 'active' : ''}
        aria-pressed={state.mode === id} onClick={() => dispatch({type:'mode', mode:id as Mode})}><Icon size={15} /><span>{label}</span></button>)}
    </nav>
    <div className="nav-actions">
      <button className="search-trigger" onClick={onSearch} aria-label="Buscar un planeta"><Search size={16} /><span>Buscar planeta</span><kbd>/</kbd></button>
      <IconButton label="Guía y fuentes" onClick={onHelp}><CircleHelp size={19} /></IconButton>
      <IconButton label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'} disabled={!fullscreenSupported} onClick={onFullscreen}>
        {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </IconButton>
    </div>
  </header>;
}

export function PlanetDock({state, dispatch}: {state: ExplorerState; dispatch: Dispatch<Action>}) {
  return <section className="planet-dock glass" aria-label="Seleccionar destino">
    <button className={`overview-button ${!state.selected ? 'active' : ''}`} onClick={() => dispatch({type:'overview'})} title="Vista general del sistema solar" aria-label="Vista general del sistema solar">
      <Scan size={23} strokeWidth={1.25} /><span>Sistema</span>
    </button>
    <div className="dock-divider" />
    <div className="destinations">
      {getVisibleBodies(state.showPluto).map(body => <button key={body.id} className={`destination ${state.selected === body.id ? 'active' : ''}`}
        aria-label={`Explorar ${body.name}`} aria-pressed={state.selected === body.id} onClick={() => dispatch({type:'select', id:body.id})}>
        <span className="destination-visual"><BodyThumb body={body} size={body.id === 'sun' ? 28 : body.id === 'jupiter' ? 35 : 30} /></span>
        <span>{body.name}</span><small>{String(body.order).padStart(2, '0')}</small>
      </button>)}
    </div>
    <MoveUpRight className="dock-hint" size={15} />
  </section>;
}
