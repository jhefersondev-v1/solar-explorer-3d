import { useEffect } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ExplorerState } from '../src/state/explorer';
import App from '../src/App';

vi.mock('../src/scene/Universe', () => ({default: function InstrumentedUniverse(props: {state: ExplorerState; onReady: (failed: string[]) => void; onProgress: (progress: number) => void}) {
  useEffect(() => {props.onProgress(100); props.onReady([]);}, [props.onReady, props.onProgress]);
  return <div data-testid="scene-connector" data-target={props.state.selected ?? 'system'} data-mode={props.state.mode} data-speed={props.state.speed} data-follow={props.state.follow} data-orbits={props.state.showOrbits} data-labels={props.state.showNames} data-view={props.state.view} data-quality={props.state.quality} data-pluto={props.state.showPluto} />;
}}));
const scene = () => screen.getByTestId('scene-connector');
async function start() {render(<App />); await screen.findByTestId('scene-connector');}

describe('Interface actions connected to the 3D engine', () => {
  it('opens with Earth selected and actually changes the scene target from the dock', async () => {
    await start(); expect(scene().getAttribute('data-target')).toBe('earth');
    fireEvent.click(screen.getByRole('button', {name:'Explorar Marte'}));
    expect(scene().getAttribute('data-target')).toBe('mars');
    expect(screen.getByRole('complementary', {name:'Información de Marte'})).toBeTruthy();
    fireEvent.click(screen.getByRole('button', {name:'Vista general del sistema solar'}));
    expect(scene().getAttribute('data-target')).toBe('system'); expect(scene().getAttribute('data-follow')).toBe('false');
  });
  it('sets 1000x, pauses at 0x and resumes the remembered speed', async () => {
    await start(); fireEvent.change(screen.getByRole('spinbutton', {name:'Velocidad exacta'}), {target:{value:'1000'}});
    expect(scene().getAttribute('data-speed')).toBe('1000');
    fireEvent.click(screen.getByRole('button', {name:'Pausar tiempo'})); expect(scene().getAttribute('data-speed')).toBe('0');
    fireEvent.click(screen.getByRole('button', {name:'Reanudar tiempo'})); expect(scene().getAttribute('data-speed')).toBe('1000');
    fireEvent.change(screen.getByRole('slider', {name:'VELOCIDAD DEL TIEMPO'}), {target:{value:'0'}}); expect(scene().getAttribute('data-speed')).toBe('0');
  });
  it('toggles actual orbit and label visibility, follow and camera perspectives', async () => {
    await start(); fireEvent.click(screen.getByRole('button', {name:'Ocultar órbitas'})); expect(scene().getAttribute('data-orbits')).toBe('false');
    fireEvent.click(screen.getByRole('button', {name:'Ocultar nombres'})); expect(scene().getAttribute('data-labels')).toBe('false');
    fireEvent.click(screen.getByRole('button', {name:'Seguir planeta'})); expect(scene().getAttribute('data-follow')).toBe('false');
    fireEvent.click(screen.getByRole('button', {name:'Vista superior'})); expect(scene().getAttribute('data-view')).toBe('top');
    fireEvent.click(screen.getByRole('button', {name:'Plano orbital'})); expect(scene().getAttribute('data-view')).toBe('ecliptic');
    fireEvent.click(screen.getByRole('button', {name:'Restablecer cámara'})); expect(scene().getAttribute('data-view')).toBe('perspective');
  });
  it('searches Pluto without accents, focuses the field and enables its geometry on selection', async () => {
    await start(); fireEvent.click(screen.getByRole('button', {name:'Buscar un planeta'}));
    const input = screen.getByRole('textbox', {name:'Nombre del planeta'}); expect(document.activeElement).toBe(input);
    fireEvent.change(input, {target:{value:'pluton'}});
    fireEvent.keyDown(input, {key:'Enter'});
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(scene().getAttribute('data-target')).toBe('pluto'); expect(scene().getAttribute('data-pluto')).toBe('true');
    expect(screen.getByRole('button', {name:'Explorar Plutón'})).toBeTruthy();
  });
  it('supports keyboard shortcuts without hijacking typing in the search field', async () => {
    await start(); fireEvent.keyDown(window, {key:' '}); expect(scene().getAttribute('data-speed')).toBe('0');
    fireEvent.keyDown(window, {key:'o'}); expect(scene().getAttribute('data-orbits')).toBe('false');
    fireEvent.keyDown(window, {key:'/'}); const input = screen.getByRole('textbox', {name:'Nombre del planeta'});
    fireEvent.keyDown(input, {key:' '}); expect(scene().getAttribute('data-speed')).toBe('0');
    fireEvent.keyDown(input, {key:'Escape'}); await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    fireEvent.keyDown(window, {key:'Home'}); expect(scene().getAttribute('data-target')).toBe('system');
  });
  it('compares two different planets, swaps identical choices and updates numeric data', async () => {
    await start(); fireEvent.click(screen.getByRole('button', {name:'Comparar'}));
    expect(screen.getByRole('dialog', {name:'Dos mundos, otra perspectiva'})).toBeTruthy();
    const first = screen.getByRole('combobox', {name:'Primer planeta'}) as HTMLSelectElement;
    const second = screen.getByRole('combobox', {name:'Segundo planeta'}) as HTMLSelectElement;
    fireEvent.change(first, {target:{value:'jupiter'}}); expect(first.value).toBe('jupiter');
    expect(screen.getByRole('cell', {name:'115'})).toBeTruthy();
    fireEvent.change(second, {target:{value:'jupiter'}}); expect(first.value).toBe('mars'); expect(second.value).toBe('jupiter');
    fireEvent.click(screen.getByRole('button', {name:'Intercambiar planetas'})); expect(first.value).toBe('jupiter'); expect(second.value).toBe('mars');
    fireEvent.click(screen.getByRole('button', {name:'Cerrar ventana'})); await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(scene().getAttribute('data-mode')).toBe('explore');
  });
  it('shows scientific data and an educational explanation, then visits the next world', async () => {
    await start(); fireEvent.click(screen.getByRole('button', {name:'Aprender'}));
    expect(scene().getAttribute('data-mode')).toBe('education');
    expect(screen.getByText('Atmósfera')).toBeTruthy();
    expect(screen.getByText(/La inclinación de 23,4°/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', {name:'Siguiente mundo'})); expect(scene().getAttribute('data-target')).toBe('mars');
    fireEvent.click(screen.getByRole('tab', {name:/Curiosidades/})); expect(screen.getByText('Sus dos lunas se llaman Fobos y Deimos.')).toBeTruthy();
  });
  it('changes quality and optional Pluto through functional settings', async () => {
    await start(); fireEvent.click(screen.getByRole('button', {name:'Ajustes de visualización'}));
    fireEvent.click(screen.getByRole('radio', {name:/Ligera/})); expect(scene().getAttribute('data-quality')).toBe('low');
    fireEvent.click(screen.getByRole('switch', {name:'Incluir Plutón'})); expect(scene().getAttribute('data-pluto')).toBe('true');
    fireEvent.click(screen.getByRole('switch', {name:'Trayectorias orbitales'})); expect(scene().getAttribute('data-orbits')).toBe('false');
    fireEvent.click(screen.getByRole('button', {name:'Cerrar ventana'})); await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
  it('runs the cinematic sequence, pauses its route and resumes it independently of simulation time', async () => {
    await start(); vi.useFakeTimers();
    fireEvent.click(screen.getByRole('button', {name:'Cinemático'})); expect(scene().getAttribute('data-target')).toBe('sun');
    await act(async () => {await vi.advanceTimersByTimeAsync(10010);}); expect(scene().getAttribute('data-target')).toBe('mercury');
    fireEvent.click(screen.getByRole('button', {name:'Pausar recorrido'}));
    await act(async () => {await vi.advanceTimersByTimeAsync(20000);}); expect(scene().getAttribute('data-target')).toBe('mercury');
    fireEvent.click(screen.getByRole('button', {name:'Reanudar recorrido'}));
    await act(async () => {await vi.advanceTimersByTimeAsync(10010);}); expect(scene().getAttribute('data-target')).toBe('venus');
    fireEvent.click(screen.getByRole('button', {name:'Finalizar recorrido'})); expect(scene().getAttribute('data-mode')).toBe('explore');
  });
  it('requests and exits native fullscreen, reflecting fullscreenchange events', async () => {
    const original = Object.getOwnPropertyDescriptor(document.documentElement, 'requestFullscreen');
    const request = vi.fn(async function(this: HTMLElement) {Object.defineProperty(document,'fullscreenElement',{configurable:true,value:this}); document.dispatchEvent(new Event('fullscreenchange'));});
    Object.defineProperty(document.documentElement, 'requestFullscreen', {configurable:true,value:request});
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {configurable:true,value:request});
    Object.defineProperty(document, 'fullscreenEnabled', {configurable:true,value:true});
    Object.defineProperty(document, 'exitFullscreen', {configurable:true,value:vi.fn(async () => {Object.defineProperty(document,'fullscreenElement',{configurable:true,value:null}); document.dispatchEvent(new Event('fullscreenchange'));})});
    await start(); fireEvent.click(screen.getByRole('button', {name:'Pantalla completa'}));
    await screen.findByRole('button', {name:'Salir de pantalla completa'}); expect(request).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', {name:'Salir de pantalla completa'})); await screen.findByRole('button',{name:'Pantalla completa'});
    delete (HTMLElement.prototype as unknown as Record<string,unknown>).requestFullscreen;
    if (original) Object.defineProperty(document.documentElement,'requestFullscreen',original); else delete (document.documentElement as unknown as Record<string,unknown>).requestFullscreen;
  });
});
