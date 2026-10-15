# Verificación de la entrega

## Comprobaciones realizadas

Resultado final: **46 pruebas correctas en 4 archivos; TypeScript y compilación de producción correctos.**

- Instalación completa de dependencias, con versiones bloqueadas en `package-lock.json`.
- Comprobación estricta de TypeScript mediante `tsc -b`.
- Compilación de producción mediante Vite.
- Decodificación de las 14 texturas WebP con Pillow: archivos válidos, hasta 2048 × 1024; anillos de Saturno de 2048 × 125 con canal alfa.
- Pruebas automatizadas con Vitest, jsdom y el renderizador de pruebas de React Three Fiber.

Las pruebas orbitales verifican que los nueve destinos planetarios regresen a su posición después de un año, la ecuación de Kepler, perihelio y afelio, mayor velocidad cerca del Sol, pausa, pestañas ocultas, velocidades de 1000× y estabilidad numérica. Comprueban el encuadre de los destinos y la vista general en pantallas verticales.

Las pruebas de escena crean mallas, geometrías y cámara reales de Three.js con el renderizador de pruebas R3F. Verifican clic en la Tierra y anillos de Saturno, desplazamiento orbital, rotación axial, presencia y desplazamiento de la Luna, congelación sin avanzar el reloj, UVs radiales de los anillos e instancias de asteroides. Verifican que la cámara llegue a un planeta, lo siga, se mantenga libre al desactivar el seguimiento, cambie a una vista superior y regrese al centro del sistema. El encuadre móvil se comprueba calculando la proyección de la esfera entre la cabecera y la ficha.

Las pruebas de interfaz usan la interfaz real con el conector del universo instrumentado. Comprueban que los botones y entradas envíen el destino, velocidad, seguimiento, vistas, calidad y visibilidad correctos a la escena. Cubren búsqueda de Plutón sin tilde, selección de destinos, comparación y cambios de datos, navegación educativa, recorrido automático y su pausa, atajos, entradas de búsqueda y peticiones de pantalla completa.

La prueba de pantalla completa verifica la petición y los eventos mediante la API del navegador simulada por jsdom; no comprueba la experiencia real del sistema operativo. Las pruebas de geometría no equivalen a una revisión visual de la GPU.

## Límite de esta verificación

No se realizó una revisión visual en un navegador ni en un dispositivo físico. No se comprobó la compilación de shaders en una GPU, la pérdida de contexto en un navegador real, una tasa de cuadros concreta ni los gestos sobre una pantalla táctil real. La implementación compila y sus pruebas de lógica, interfaz y cámara pasan; esos aspectos visuales y de dispositivo requieren una comprobación local.

## Recorrido de comprobación local

| Comprobación | Resultado esperado |
| --- | --- |
| Abrir http://localhost:5173 | Pantalla de carga y Tierra 3D con nubes y borde atmosférico |
| Arrastrar y usar la rueda | Giro libre de la cámara y zoom |
| Seleccionar Saturno desde la barra y sus anillos | Viaje a Saturno y selección efectiva al pulsar los anillos |
| Cambiar a Sistema y vista superior | Planetas y trayectorias alrededor del Sol |
| Pausar y reanudar | Órbitas y rotación detenidas, luego reanudadas |
| Elegir 1000× | Movimiento orbital mucho más rápido; las proporciones de años se conservan |
| Desactivar seguimiento | El planeta puede salir del encuadre; al reactivarlo se vuelve a encuadrar |
| Alternar nombres y órbitas | Las etiquetas y líneas aparecen y desaparecen |
| Buscar «pluton» | Viaje a Plutón y activación del planeta enano |
| Abrir Aprender | Explicación contextual y datos ampliados |
| Comparar Tierra y Júpiter | Tabla y diámetros relativos actualizados |
| Iniciar Cinemático | Viajes automáticos cada diez segundos; pausa y salida funcionales |
| Activar pantalla completa | Expansión de la app, si el navegador lo permite |
| Probar en móvil vertical y horizontal | Ficha desplazable, barra de destinos desplazable, giro y zoom táctil |
| Cambiar a Ligera | Menos estrellas, asteroides y detalle, conservando los controles |

Para repetir las pruebas automatizadas y reconstruir la entrega:

```bash
npm ci
npm run test
npm run build
```
