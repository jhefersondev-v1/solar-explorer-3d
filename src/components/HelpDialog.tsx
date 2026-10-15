import { MousePointer2, Move, ZoomIn, Orbit, ArrowUpRight } from 'lucide-react';
import { BODIES, DATA_DATE, FACT_SHEET } from '../data/bodies';
import { Modal } from './Primitives';

export function HelpDialog({onClose, reducedMotion}: {onClose: () => void; reducedMotion: boolean}) {
  return <Modal title="La exploración empieza aquí" onClose={onClose} className="help-modal" reducedMotion={reducedMotion}>
    <div className="help-gestures">
      <div><MousePointer2 size={21} /><strong>Elige un mundo</strong><p>Haz clic en un planeta, su nombre o la barra de destinos.</p></div>
      <div><Orbit size={21} /><strong>Mira alrededor</strong><p>Arrastra con el botón izquierdo o con un dedo.</p></div>
      <div><ZoomIn size={21} /><strong>Acércate</strong><p>Usa la rueda del mouse o pellizca con dos dedos.</p></div>
      <div><Move size={21} /><strong>Desplázate</strong><p>Arrastra con el botón derecho o con dos dedos.</p></div>
    </div>
    <h3>Atajos de tu nave</h3>
    <div className="keyboard-grid">{[['Espacio','Pausar / reanudar tiempo'],['Home','Vista general'],['R','Restablecer cámara'],['O','Órbitas'],['L','Nombres'],['F','Pantalla completa'],['/','Buscar'],['Esc','Cerrar ventana']].map(([key, label]) => <span key={key}><kbd>{key}</kbd>{label}</span>)}</div>
    <h3>La escala de esta experiencia</h3>
    <p className="help-copy">Los tamaños y las distancias están ajustados para explorar cómodamente. Las órbitas conservan períodos, excentricidades e inclinaciones de referencia y usan la ecuación de Kepler. Las fases iniciales son una composición visual; no muestran posiciones astronómicas de una fecha real.</p>
    <p className="help-copy">1× equivale a un día terrestre simulado por segundo. La rotación sobre el eje está ralentizada 25 veces para que puedas observar las superficies. Las velocidades de las órbitas mantienen sus proporciones: Neptuno se mueve mucho más despacio que Mercurio.</p>
    <p className="help-copy">El día solar mide el regreso del Sol al mismo lugar del cielo. La rotación sidérea mide un giro respecto a las estrellas. Temperaturas y gravedad son aproximadas y varían según el lugar y la altura. Los gigantes no tienen una superficie sólida comparable a la Tierra.</p>
    <h3>Fuentes y créditos</h3>
    <p className="help-copy">Datos consultados el {DATA_DATE}. Los recuentos de lunas de Júpiter, Saturno, Urano y Neptuno usan las páginas de lunas de NASA Science, que son más recientes que la tabla general.</p>
    <div className="sources-grid"><a href={FACT_SHEET} target="_blank" rel="noreferrer">NASA · Planetary Fact Sheet <ArrowUpRight size={12} /></a>{BODIES.map(body => <a key={body.id} href={body.source} target="_blank" rel="noreferrer">NASA · {body.name} <ArrowUpRight size={12} /></a>)}</div>
    <p className="help-copy credits-copy">Texturas de <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">Solar System Scope / INOVE</a>, basadas en imágenes de NASA, bajo <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>, convertidas a WebP. Los colores están realzados y algunas zonas sin cartografiar contienen reconstrucciones. El mapa de Plutón es de NASA/JHUAPL/SwRI, obtenido por New Horizons; las regiones sin datos permanecen oscuras.</p>
    <p className="modal-footnote">Solar Explorer es un proyecto educativo independiente.</p>
  </Modal>;
}
