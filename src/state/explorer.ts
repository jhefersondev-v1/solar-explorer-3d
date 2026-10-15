import type { BodyId } from '../data/bodies';
export type Mode = 'explore' | 'education' | 'compare' | 'cinematic';
export type View = 'perspective' | 'top' | 'ecliptic';
export type Quality = 'auto' | 'high' | 'low';
export interface ExplorerState {
  selected: BodyId | null; mode: Mode; speed: number; lastSpeed: number;
  follow: boolean; showOrbits: boolean; showNames: boolean; showPluto: boolean;
  view: View; quality: Quality; cameraCommand: number; tourPaused: boolean;
}
export const initialState: ExplorerState = {
  selected: 'earth', mode: 'explore', speed: 1, lastSpeed: 1,
  follow: true, showOrbits: true, showNames: true, showPluto: false,
  view: 'perspective', quality: 'auto', cameraCommand: 0, tourPaused: false,
};
export type Action =
  | {type: 'select'; id: BodyId; tour?: boolean}
  | {type: 'mode'; mode: Mode}
  | {type: 'speed'; speed: number}
  | {type: 'pause'}
  | {type: 'overview'}
  | {type: 'reset'}
  | {type: 'view'; view: View}
  | {type: 'quality'; quality: Quality}
  | {type: 'toggle'; key: 'follow' | 'showOrbits' | 'showNames' | 'showPluto' | 'tourPaused'}
  | {type: 'interrupt-tour'};

export function explorerReducer(state: ExplorerState, action: Action): ExplorerState {
  switch (action.type) {
    case 'select': return {...state, selected: action.id, showPluto: state.showPluto || action.id === 'pluto', follow: true,
      mode: action.tour ? 'cinematic' : state.mode === 'cinematic' ? 'explore' : state.mode,
      cameraCommand: state.cameraCommand + 1};
    case 'mode': return {...state, mode: action.mode, tourPaused: false,
      ...(action.mode === 'cinematic' ? {selected: 'sun' as BodyId, follow: true, view: 'perspective' as View, cameraCommand: state.cameraCommand + 1} : {})};
    case 'speed': {
      const speed = Math.min(1000, Math.max(0, Number.isFinite(action.speed) ? action.speed : 0));
      return {...state, speed, lastSpeed: speed > 0 ? speed : state.lastSpeed};
    }
    case 'pause': return {...state, speed: state.speed > 0 ? 0 : state.lastSpeed, lastSpeed: state.speed > 0 ? state.speed : state.lastSpeed};
    case 'overview': return {...state, selected: null, follow: false, mode: state.mode === 'cinematic' ? 'explore' : state.mode, cameraCommand: state.cameraCommand + 1};
    case 'reset': return {...state, view: 'perspective', follow: Boolean(state.selected), cameraCommand: state.cameraCommand + 1};
    case 'view': return {...state, view: action.view, cameraCommand: state.cameraCommand + 1};
    case 'quality': return {...state, quality: action.quality};
    case 'interrupt-tour': return state.mode === 'cinematic' ? {...state, mode: 'explore'} : state;
    case 'toggle': {
      const next = {...state, [action.key]: !state[action.key]};
      if (action.key === 'follow' && next.follow && state.selected) next.cameraCommand++;
      if (action.key === 'showPluto' && !next.showPluto && state.selected === 'pluto') return {...next, selected: null, follow: false, cameraCommand: state.cameraCommand + 1};
      return next;
    }
  }
}
