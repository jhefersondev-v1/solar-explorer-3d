import { motion } from 'framer-motion';
import { GraduationCap, Film, ChevronRight, Pause, Play, X } from 'lucide-react';
import type { Dispatch } from 'react';
import { BODY_BY_ID, getVisibleBodies } from '../data/bodies';
import type { Action, ExplorerState } from '../state/explorer';
import { IconButton } from './Primitives';

export function ModeOverlay({state, dispatch, reducedMotion}: {state: ExplorerState; dispatch: Dispatch<Action>; reducedMotion: boolean}) {
  if (!state.selected || !['education','cinematic'].includes(state.mode)) return null;
  const body = BODY_BY_ID[state.selected], visible = getVisibleBodies(state.showPluto), index = visible.findIndex(p => p.id === body.id);
  if (state.mode === 'education') return <motion.section className="education-card glass" initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} transition={{duration:reducedMotion ? 0 : .25}}>
    <div className="education-heading"><GraduationCap size={16} /><span>LA CIENCIA DETRÁS</span><span>{String(index + 1).padStart(2, '0')} / {visible.length}</span></div>
    <p>{body.lesson}</p><button onClick={() => dispatch({type:'select', id:visible[(index + 1) % visible.length].id})}>Siguiente mundo <ChevronRight size={14} /></button>
  </motion.section>;
  return <section className="tour-card glass" aria-label="Recorrido cinematográfico">
    <Film size={17} /><div><span className="eyebrow">RECORRIDO CINEMATOGRÁFICO</span><strong>{body.name} <small>{index + 1} / {visible.length}</small></strong></div>
    <IconButton label={state.tourPaused ? 'Reanudar recorrido' : 'Pausar recorrido'} onClick={() => dispatch({type:'toggle', key:'tourPaused'})}>{state.tourPaused ? <Play size={15} /> : <Pause size={15} />}</IconButton>
    <IconButton label="Finalizar recorrido" onClick={() => dispatch({type:'mode', mode:'explore'})}><X size={16} /></IconButton>
    <div className="tour-progress"><motion.span key={`${body.id}-${state.tourPaused}`} initial={{scaleX:0}} animate={{scaleX:state.tourPaused ? 0 : 1}} transition={{duration:reducedMotion || state.tourPaused ? 0 : 10, ease:'linear'}} /></div>
  </section>;
}
