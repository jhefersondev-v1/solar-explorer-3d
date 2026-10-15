import { Component, lazy, Suspense, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Orbit, MousePointer2, ArrowUpRight, RefreshCw, AlertCircle } from 'lucide-react';
import type { ErrorInfo, ReactNode } from 'react';
import { BODY_BY_ID, number } from './data/bodies';
import { explorerReducer, initialState } from './state/explorer';
import { Navigation, PlanetDock } from './components/Navigation';
import { CameraControls, TimeControls } from './components/Controls';
import { InfoPanel } from './components/InfoPanel';
import { SearchDialog } from './components/SearchDialog';
import { Comparison } from './components/Comparison';
import { SettingsDialog } from './components/SettingsDialog';
import { HelpDialog } from './components/HelpDialog';
import { ModeOverlay } from './components/ModeOverlay';
import type { SimulationClock } from './lib/orbital';

const Universe = lazy(() => import('./scene/Universe'));
class SceneBoundary extends Component<{children: ReactNode; onError: () => void}, {failed: boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() {return {failed:true};}
  componentDidCatch(_error: Error, _info: ErrorInfo) {this.props.onError();}
  render() {return this.state.failed ? null : this.props.children;}
}

export default function App() {
  const [state, dispatch] = useReducer(explorerReducer, initialState);
  const clock = useRef<SimulationClock>({days:0});
  const shell = useRef<HTMLDivElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const [dialog, setDialog] = useState<'search' | 'settings' | 'help' | null>(null);
  const [progress, setProgress] = useState(0), [ready, setReady] = useState(false), [sceneError, setSceneError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false), [toast, setToast] = useState('');
  const fullscreenSupported = typeof document.documentElement.requestFullscreen === 'function' && document.fullscreenEnabled !== false;
  const overlayOpen = Boolean(dialog) || state.mode === 'compare';
  const onProgress = useCallback((value: number) => setProgress(value), []);
  const onReady = useCallback((failed: string[]) => {setReady(true); if (failed.length) setToast(`${failed.length} textura(s) no se cargaron. Los controles y la geometría siguen disponibles.`);}, []);
  const onSceneError = useCallback(() => {setSceneError(true); setReady(true);}, []);
  const toggleFullscreen = useCallback(async () => {
    try {if (document.fullscreenElement) await document.exitFullscreen(); else await shell.current?.requestFullscreen();}
    catch {setToast('El navegador no permitió la pantalla completa. Puedes continuar explorando.');}
  }, []);
  useEffect(() => {
    const changed = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);
  useEffect(() => {if (!toast) return; const id = window.setTimeout(() => setToast(''), 6000); return () => window.clearTimeout(id);}, [toast]);
  useEffect(() => {
    if (state.mode !== 'cinematic' || state.tourPaused || !ready) return;
    const visible = state.showPluto ? Object.values(BODY_BY_ID) : Object.values(BODY_BY_ID).filter(p => p.id !== 'pluto');
    const current = visible.findIndex(p => p.id === state.selected);
    const id = window.setInterval(() => dispatch({type:'select', id:visible[(current + 1) % visible.length].id, tour:true}), 10000);
    return () => window.clearInterval(id);
  }, [state.mode, state.tourPaused, state.selected, state.showPluto, ready]);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {setDialog(null); if (state.mode === 'compare') dispatch({type:'mode', mode:'explore'}); return;}
      if (overlayOpen || e.altKey || e.ctrlKey || e.metaKey || e.target instanceof HTMLElement && e.target.closest('input, textarea, select, button, [contenteditable="true"]')) return;
      switch (e.key.toLowerCase()) {
        case '/': e.preventDefault(); setDialog('search'); break;
        case ' ': e.preventDefault(); dispatch({type:'pause'}); break;
        case 'home': e.preventDefault(); dispatch({type:'overview'}); break;
        case 'r': dispatch({type:'reset'}); break;
        case 'o': dispatch({type:'toggle', key:'showOrbits'}); break;
        case 'l': dispatch({type:'toggle', key:'showNames'}); break;
        case 'f': if (fullscreenSupported) void toggleFullscreen(); break;
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [overlayOpen, state.mode, toggleFullscreen, fullscreenSupported]);
  const body = state.selected ? BODY_BY_ID[state.selected] : null;
  return <main ref={shell} className={`app-shell ${body ? 'focused' : 'system-view'} mode-${state.mode}`}>
    <div className="scene-layer" inert={overlayOpen || undefined}>
      <SceneBoundary onError={onSceneError}><Suspense fallback={null}><Universe state={state} dispatch={dispatch} clock={clock} reducedMotion={reducedMotion} onProgress={onProgress} onReady={onReady} onContextLost={onSceneError} /></Suspense></SceneBoundary>
    </div>
    <div className="interface-layer" inert={overlayOpen || undefined}>
      <Navigation state={state} dispatch={dispatch} onSearch={() => setDialog('search')} onHelp={() => setDialog('help')} onFullscreen={() => void toggleFullscreen()} fullscreen={fullscreen} fullscreenSupported={fullscreenSupported} />
      <div className="observatory-status"><span className="status-dot" /><span>OBSERVATORIO INTERACTIVO</span><span className="status-separator">/</span><span>VÍA LÁCTEA</span></div>
      {state.mode !== 'compare' && <InfoPanel key={state.selected ?? 'overview'} state={state} dispatch={dispatch} reducedMotion={reducedMotion} />}
      <CameraControls state={state} dispatch={dispatch} onSettings={() => setDialog('settings')} />
      <ModeOverlay state={state} dispatch={dispatch} reducedMotion={reducedMotion} />
      {body && state.mode !== 'compare' && <div className="scene-caption"><span className="caption-line" /><div><span className="eyebrow">{body.kind.toUpperCase()}</span><strong>{body.name}</strong><p>{body.id === 'sun' ? 'EL CENTRO DE NUESTRO SISTEMA' : `${number(body.tilt, 1)}° DE INCLINACIÓN AXIAL`}</p></div></div>}
      <div className="interaction-hint"><MousePointer2 size={13} /><span>Arrastra para explorar <i /> Rueda para acercar</span></div>
      <div className="bottom-console"><TimeControls state={state} dispatch={dispatch} clock={clock} /><PlanetDock state={state} dispatch={dispatch} />
        <footer><span><span className="tiny-square" />MODELO EDUCATIVO · ESCALA VISUAL AJUSTADA</span><button onClick={() => setDialog('help')}>Guía y fuentes <ArrowUpRight size={11} /></button></footer>
      </div>
    </div>
    <AnimatePresence>
      {!ready && <motion.div className="loading-screen" key="loader" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:reducedMotion ? 0 : .5}} role="status" aria-live="polite">
        <div className="loading-orbit"><Orbit size={56} strokeWidth={.85} /></div><span className="eyebrow">SOLAR EXPLORER 3D</span><h2>Un universo te espera.</h2><p>Preparando mundos, órbitas y estrellas</p><div className="load-progress"><span style={{width:`${progress}%`}} /></div><small>{progress} %</small>
      </motion.div>}
      {dialog === 'search' && <SearchDialog key="search" onClose={() => setDialog(null)} onSelect={id => dispatch({type:'select', id})} reducedMotion={reducedMotion} />}
      {dialog === 'settings' && <SettingsDialog key="settings" state={state} dispatch={dispatch} onClose={() => setDialog(null)} reducedMotion={reducedMotion} />}
      {dialog === 'help' && <HelpDialog key="help" onClose={() => setDialog(null)} reducedMotion={reducedMotion} />}
      {state.mode === 'compare' && <Comparison key="comparison" onClose={() => dispatch({type:'mode', mode:'explore'})} reducedMotion={reducedMotion} />}
      {toast && <motion.div className="toast glass" key="toast" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0}} role="status"><AlertCircle size={16} /><p>{toast}</p><button onClick={() => setToast('')} aria-label="Cerrar aviso">×</button></motion.div>}
    </AnimatePresence>
    {sceneError && <div className="scene-error glass" role="alert"><Orbit size={34} /><h2>La escena 3D necesita WebGL.</h2><p>Activa la aceleración gráfica del navegador y vuelve a cargar. Las fichas y el comparador siguen disponibles.</p><button className="primary-button" onClick={() => window.location.reload()}><RefreshCw size={15} />Volver a cargar</button></div>}
  </main>;
}
