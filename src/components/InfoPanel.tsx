import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Crosshair, X, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import type { Dispatch } from 'react';
import { BODY_BY_ID, DATA_DATE, FACT_SHEET, dayLabel, massLabel, number, yearLabel } from '../data/bodies';
import type { ExplorerState, Action } from '../state/explorer';
import { IconButton } from './Primitives';

export function InfoPanel({state, dispatch, reducedMotion}: {state: ExplorerState; dispatch: Dispatch<Action>; reducedMotion: boolean}) {
  const [tab, setTab] = useState<'data' | 'facts'>('data');
  if (!state.selected) return <motion.aside className="overview-intro" initial={{opacity:0, x:-8}} animate={{opacity:1, x:0}} transition={{duration:reducedMotion ? 0 : .3}}>
    <div className="eyebrow"><span className="status-dot" />UN UNIVERSO POR DESCUBRIR</div>
    <h2>Cada órbita,<br /><span>una historia.</span></h2>
    <p>Viaja desde nuestra estrella hasta los mundos más lejanos. Elige un destino y observa el universo en movimiento.</p>
    <button className="primary-button" onClick={() => dispatch({type:'select', id:'earth'})}>Explorar la Tierra <ArrowRight size={17} /></button>
    <div className="overview-facts"><span><strong>08</strong>planetas</span><span><strong>01</strong>estrella</span><span><strong>∞</strong>por descubrir</span></div>
  </motion.aside>;
  const body = BODY_BY_ID[state.selected];
  return <motion.aside className="info-panel glass" key={body.id} initial={{opacity:0, x:reducedMotion ? 0 : -12}} animate={{opacity:1, x:0}} transition={{duration:reducedMotion ? 0 : .32}} aria-label={`Información de ${body.name}`}>
    <div className="info-kicker"><span className="eyebrow">{String(body.order).padStart(2, '0')} / {body.kind}</span><IconButton label="Cerrar información y ver sistema" onClick={() => dispatch({type:'overview'})}><X size={16} /></IconButton></div>
    <h2>{body.name}<span style={{color:body.color}}>.</span></h2>
    <p className="tagline">{body.tagline}</p>
    <p className="body-description">{body.description}</p>
    <button className={`follow-button ${state.follow ? 'following' : ''}`} aria-pressed={state.follow} onClick={() => dispatch({type:'toggle', key:'follow'})}>
      <Crosshair size={14} />{state.follow ? 'Siguiendo este mundo' : 'Seguir este mundo'}<span className={state.follow ? 'status-dot' : 'empty-dot'} />
    </button>
    <div className="info-tabs" role="tablist" aria-label="Contenido del planeta">
      <button id="data-tab" role="tab" aria-controls="planet-data" aria-selected={tab === 'data'} className={tab === 'data' ? 'active' : ''} onClick={() => setTab('data')}>Ficha científica</button>
      <button id="facts-tab" role="tab" aria-controls="planet-facts" aria-selected={tab === 'facts'} className={tab === 'facts' ? 'active' : ''} onClick={() => setTab('facts')}>Curiosidades <Sparkles size={12} /></button>
    </div>
    {tab === 'data' ? <div id="planet-data" role="tabpanel" aria-labelledby="data-tab">
      <dl className="quick-stats">
        <div><dt>DIÁMETRO ECUATORIAL</dt><dd>{number(body.diameter)}<span> km</span></dd></div>
        <div><dt>DISTANCIA MEDIA AL SOL</dt><dd>{body.id === 'sun' ? 'Centro' : number(body.distanceMkm, 1)}<span>{body.id === 'sun' ? '' : ' M km'}</span></dd></div>
        <div><dt>DÍA SOLAR</dt><dd className="text-stat">{body.id === 'sun' ? 'Rotación variable' : dayLabel(body.solarDayHours)}</dd></div>
        <div><dt>AÑO</dt><dd className="text-stat">{yearLabel(body.orbitalDays)}</dd></div>
      </dl>
      <details className="detail-stats" open={state.mode === 'education' ? true : undefined}>
        <summary>Más datos de este mundo <ChevronDown size={14} /></summary>
        <dl>
          <div><dt>Masa</dt><dd>{massLabel(body)}</dd></div>
          <div><dt>Temperatura de referencia</dt><dd>≈ {number(body.temperatureC)} °C</dd></div>
          <div><dt>Gravedad de referencia</dt><dd>≈ {number(body.gravity, 1)} m/s²</dd></div>
          <div><dt>Lunas conocidas</dt><dd>{body.moons ?? 'No aplica'}</dd></div>
          <div><dt>Rotación sidérea</dt><dd>{dayLabel(Math.abs(body.rotationHours))}{body.rotationHours < 0 ? ' · retrógrada' : ''}</dd></div>
          <div><dt>Inclinación axial</dt><dd>{number(body.tilt, 2)}°</dd></div>
        </dl>
        {body.moonNote && <p className="stat-note"><a href={body.moonSource} target="_blank" rel="noreferrer">Lunas: {body.moonNote} <ArrowUpRight size={10} /></a></p>}
        <h3>Atmósfera</h3><p>{body.atmosphere}</p>
        <p className="stat-note">Cifras aproximadas. En gigantes, temperatura y gravedad corresponden a niveles atmosféricos de referencia; no a una superficie sólida.</p>
      </details>
    </div> : <div id="planet-facts" role="tabpanel" aria-labelledby="facts-tab" className="curiosities">
      {body.facts.map((fact, i) => <div key={fact}><span>{String(i + 1).padStart(2, '0')}</span><p>{fact}</p></div>)}
      <div className="lesson-mini"><GraduationLabel /><p>{body.lesson}</p></div>
    </div>}
    <div className="source-line"><a href={body.source} target="_blank" rel="noreferrer">NASA Science <ArrowUpRight size={11} /></a><a href={FACT_SHEET} target="_blank" rel="noreferrer">Datos de referencia <ArrowUpRight size={11} /></a></div>
    <p className="data-date">Fuentes consultadas: {DATA_DATE}. Los recuentos de lunas pueden cambiar.</p>
  </motion.aside>;
}

function GraduationLabel() {return <h3><Sparkles size={13} />La ciencia detrás</h3>;}
