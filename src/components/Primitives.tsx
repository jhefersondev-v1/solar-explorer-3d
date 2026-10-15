import { useEffect, useRef, useId } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import type { CelestialBody } from '../data/bodies';

export function IconButton({label, active = false, children, className = '', ...props}: ButtonHTMLAttributes<HTMLButtonElement> & {label: string; active?: boolean}) {
  return <button className={`icon-button ${active ? 'active' : ''} ${className}`} title={label} aria-label={label} {...props}>{children}</button>;
}

export function BodyThumb({body, size = 34}: {body: CelestialBody; size?: number}) {
  const style = {width:size, height:size, '--planet-color':body.color, backgroundImage:`radial-gradient(circle at 30% 25%, transparent 15%, rgba(0,0,0,.7) 100%), url("${body.texture}")`} as CSSProperties;
  return <span className={`body-thumb ${body.id === 'saturn' ? 'with-rings' : ''}`} style={style} aria-hidden="true" />;
}

export function Modal({title, children, onClose, className = '', reducedMotion = false}: {title: string; children: ReactNode; onClose: () => void; className?: string; reducedMotion?: boolean}) {
  const panel = useRef<HTMLDivElement>(null), titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const first = panel.current?.querySelector<HTMLElement>('input') ?? panel.current?.querySelector<HTMLElement>('button, select, a[href], [tabindex="0"]');
    first?.focus();
    return () => previous?.focus();
  }, []);
  return <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
    transition={{duration:reducedMotion ? 0 : .16}} onMouseDown={e => {if (e.target === e.currentTarget) onClose();}}>
    <motion.div ref={panel} className={`glass modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}
      initial={{opacity:0, y:reducedMotion ? 0 : 16}} animate={{opacity:1, y:0}} exit={{opacity:0, y:8}} transition={{duration:reducedMotion ? 0 : .2}}
      onKeyDown={e => {
        if (e.key === 'Escape') {e.stopPropagation(); onClose();}
        if (e.key !== 'Tab') return;
        const items = [...(panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]') ?? [])];
        const first = items[0], last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {e.preventDefault(); last?.focus();}
        else if (!e.shiftKey && document.activeElement === last) {e.preventDefault(); first?.focus();}
      }}>
      <div className="modal-heading"><h2 id={titleId}>{title}</h2><IconButton label="Cerrar ventana" onClick={onClose}><X size={18} /></IconButton></div>
      {children}
    </motion.div>
  </motion.div>;
}
