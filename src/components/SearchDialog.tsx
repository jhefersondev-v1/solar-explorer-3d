import { useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { searchBodies } from '../data/bodies';
import type { BodyId } from '../data/bodies';
import { BodyThumb, Modal } from './Primitives';

export function SearchDialog({onClose, onSelect, reducedMotion}: {onClose: () => void; onSelect: (id: BodyId) => void; reducedMotion: boolean}) {
  const [query, setQuery] = useState('');
  const results = searchBodies(query);
  return <Modal title="Tu próximo destino" onClose={onClose} className="search-modal" reducedMotion={reducedMotion}>
    <div className="search-field"><Search size={18} /><input autoFocus aria-label="Nombre del planeta" placeholder="Busca Tierra, Saturno, Plutón…" value={query} onChange={e => setQuery(e.target.value)}
      onKeyDown={e => {if (e.key === 'Enter' && results[0]) {onSelect(results[0].id); onClose();}}} /><kbd>↵</kbd></div>
    <div className="search-results">{results.map(body => <button key={body.id} onClick={() => {onSelect(body.id); onClose();}}>
      <BodyThumb body={body} size={35} /><span><strong>{body.name}</strong><small>{body.kind}</small></span><ArrowUpRight size={17} />
    </button>)}{results.length === 0 && <p className="empty-search">No encontramos ese mundo. Prueba con el nombre de un planeta.</p>}</div>
    <p className="modal-footnote">Selecciona un destino para viajar. Esc para volver a la exploración.</p>
  </Modal>;
}
