# Solar Explorer 3D

Un observatorio interactivo del sistema solar. La escena usa geometría tridimensional real y WebGL; puedes orbitar la cámara, acercarte a los mundos, seguir sus movimientos y controlar el tiempo.

## Ejecutarlo en tu computadora

1. Extrae todo el ZIP. No ejecutes los archivos desde el interior del archivo comprimido.
2. Instala Node.js **24.19 o posterior**. También es compatible con la rama 22 desde 22.22.2. Descarga oficial: https://nodejs.org/
3. En Windows, abre **INICIAR-WINDOWS.bat**. Instala las dependencias si hacen falta y enciende el servidor.
4. Cuando la terminal muestre `Local`, abre http://localhost:5173 en Chrome, Edge o Firefox.
5. Mantén la terminal abierta. Usa Ctrl+C para detener el servidor.

Para hacerlo desde CMD, PowerShell o una terminal de macOS/Linux, entra en la carpeta que contiene `package.json` y ejecuta:

```bash
npm ci
npm run dev
```

Si 5173 está ocupado, Vite puede anunciar otro puerto; abre exactamente la dirección de `Local`. El archivo de Windows utiliza el puerto 5173 fijo y te informa si está ocupado. No abras `index.html` con doble clic: los módulos y las texturas se sirven mediante HTTP.

Las dependencias ya se instalaron y el proyecto se compiló en el entorno de desarrollo. El ZIP no incluye `node_modules`, que se instala para tu sistema operativo con `npm ci`. Sí incluye el código, el archivo de versiones bloqueadas, todas las texturas y la carpeta `dist` compilada.

## Explorar

| Acción | Control |
| --- | --- |
| Girar 360° | Arrastrar con botón izquierdo; un dedo en móvil |
| Acercar y alejar | Rueda; pellizcar con dos dedos |
| Desplazar la cámara | Botón derecho; arrastrar con dos dedos |
| Viajar a un mundo | Clic en su malla, etiqueta o destino de la barra inferior |
| Seguir un planeta | Botón con la mira o «Siguiendo este mundo» en su ficha |
| Vista general | Botón «Sistema», herramienta de vista general o Home |
| Pausar y reanudar | Botón de reproducción o Espacio |
| Velocidad 0–1000× | Deslizador, número editable o botones de velocidad |
| Órbitas y nombres | Herramientas laterales o teclas O y L |
| Perspectivas | Perspectiva 3D, vista superior y plano orbital |
| Restablecer cámara | Flecha circular o R |
| Pantalla completa | Esquinas de la barra superior o F; según soporte del navegador |
| Buscar | Lupa o /; Enter viaja al primer resultado |
| Cerrar una ventana | Botón de cierre, fondo de la ventana o Esc |

**Explorar:** navegación libre y fichas científicas. Al desactivar el seguimiento puedes dejar que el planeta salga del encuadre; al volver a activarlo, la cámara viaja de regreso.

**Aprender:** explicación contextual de cada mundo, datos ampliados y botón para visitar el siguiente. La pestaña Curiosidades añade hechos y la ciencia que los explica.

**Comparar:** elige dos planetas, observa sus diámetros a la misma escala y compara masa, distancia, temperatura, día, año, gravedad, lunas y atmósfera. Si seleccionas el mismo planeta en ambas listas, se intercambian los destinos para mantener dos distintos. Los anillos se excluyen del diagrama de diámetros.

**Cinemático:** inicia en el Sol y visita cada destino cada diez segundos, con un viaje de cámara de 2,4 segundos y una órbita suave. Puedes pausar el recorrido sin cambiar el tiempo de la simulación, finalizarlo o tomar el control de la cámara. Seleccionar un destino manualmente también finaliza el recorrido.

**Plutón:** se activa en Ajustes; buscarlo y seleccionarlo lo incluye automáticamente. Se identifica como planeta enano.

## Lo que incluye el universo

- Sol texturizado, corona y resplandor, con una fuente de iluminación en el centro.
- Los ocho planetas con mapas locales optimizados, inclinación del eje y rotación.
- Tierra con mapa de superficie, luces nocturnas, capa de nubes, atmósfera y Luna en órbita.
- Bandas y Gran Mancha Roja de Júpiter en su mapa de superficie.
- Anillos de Saturno con geometría real, transparencia y coordenadas radiales; anillos tenues de Urano.
- Plutón con mapa global obtenido por New Horizons.
- Cinturón de asteroides con instancias y un fondo de miles de estrellas.
- Órbitas elípticas inclinadas. El Sol está en un foco y la ecuación de Kepler relaciona el tiempo con la posición.
- Interfaz en español, información con fuentes, búsqueda sin depender de las tildes, ventanas con control de foco y navegación por teclado.

## Escala, tiempo y precisión científica

Esta es una experiencia **educativa con escala visual ajustada**. Los radios de los cuerpos y las distancias orbitales están comprimidos de forma independiente para que se puedan explorar. El esquema no representa las proporciones reales de tamaños y distancias; el comparador sí conserva la proporción entre diámetros.

Los períodos orbitales, excentricidades, inclinaciones y oblicuidades provienen de datos de referencia de NASA. Los planetas mantienen la proporción entre sus años. Las fases y nodos de la composición inicial son artísticos; **no es un cálculo de efemérides ni muestra el cielo de una fecha concreta**. No se calculan perturbaciones gravitatorias, precesión ni interacciones de múltiples cuerpos.

**1× = 1 día terrestre simulado por segundo.** El control 1000× equivale a 1000 días simulados por segundo. El deslizador usa una distribución logarítmica para facilitar el ajuste de las velocidades bajas; el valor editable indica siempre el multiplicador real. A 0× se congelan las órbitas, la rotación axial y la Luna. La simulación deja de avanzar si la pestaña está oculta y limita los saltos de cuadros largos para evitar cambios bruscos.

La rotación visual está ralentizada **25 veces** con respecto al tiempo orbital, conservando las proporciones entre períodos. Venus, Urano y Plutón muestran orientación retrógrada mediante sus ejes inclinados más de 90°. El movimiento de las nubes es ilustrativo, no un modelo meteorológico. Los asteroides comparten una rotación representativa del cinturón. La rotación solar usa un período representativo: una estrella de plasma no gira como un cuerpo sólido.

Las cifras de las fichas son aproximadas. Se utiliza diámetro ecuatorial; el día solar y el período de rotación sidérea aparecen separados. En gigantes, temperatura y gravedad son valores atmosféricos de referencia, no medidas de una superficie sólida. Los recuentos de lunas son una instantánea de las fuentes consultadas el **14 de octubre de 2026** y pueden cambiar. Las páginas recientes de NASA Science se usaron para los recuentos de Júpiter, Saturno, Urano y Neptuno, en lugar de los valores antiguos de la tabla general.

Todas las fuentes y atribuciones están en la guía dentro de la aplicación y en `CREDITS.md`.

## Estructura modular

| Ruta | Responsabilidad |
| --- | --- |
| `src/App.tsx` | Coordinación de modos, teclado, pantalla completa, carga y errores |
| `src/state/explorer.ts` | Estado y transiciones de la aplicación |
| `src/data/bodies.ts` | Datos astronómicos, fuentes y búsqueda |
| `src/lib/orbital.ts` | Kepler, tiempo y cálculos de cámara |
| `src/scene/Universe.tsx` | Canvas WebGL, escena, calidad y tiempo |
| `src/scene/Sun.tsx` | Sol, iluminación, corona y resplandor |
| `src/scene/Planet.tsx` | Planetas, superficie terrestre, nubes, Luna y anillos |
| `src/scene/Atmosphere.tsx` | Shader de atmósfera |
| `src/scene/Orbits.tsx` | Trayectorias 3D |
| `src/scene/Asteroids.tsx` | Cinturón mediante instancias |
| `src/scene/CameraRig.tsx` | Cámara, viajes, seguimiento y controles táctiles |
| `src/scene/textures.ts` | Carga local, progreso, fallos y liberación de texturas |
| `src/components/` | Navegación, ficha, controles, comparación, búsqueda, modos y ventanas |
| `public/textures/` | 14 mapas WebP locales |
| `tests/` | Lógica orbital, escena y cámara R3F, acciones de interfaz |

Tecnologías: React, Vite, TypeScript, Three.js, React Three Fiber, drei, Tailwind CSS, Framer Motion y Lucide React. Las versiones exactas están bloqueadas en `package-lock.json`.

## Rendimiento y recursos

Los mapas son de hasta 2048 × 1024, con WebP local. El universo se carga en un módulo separado de la interfaz. Los asteroides se dibujan con un objeto de instancias. La simulación actualiza las mallas con referencias en `useFrame` y evita actualizar React en cada cuadro. El indicador de días se actualiza cuatro veces por segundo.

La calidad automática elige menor resolución y geometría para dispositivos táctiles, pantallas pequeñas o equipos con pocos núcleos. En escritorio observa el rendimiento y puede bajar la calidad. `AdaptiveDpr` reduce la resolución durante interacciones exigentes. Los modos Alta y Ligera permiten elegir manualmente; Alta no promete un FPS concreto en todos los dispositivos.

En calidad normal se dibujan 6500 estrellas y 1600 asteroides. En calidad ligera, 2600 y 650 respectivamente. Se limitan la resolución de renderizado y la anisotropía. Se liberan las texturas al desmontar; las geometrías y los materiales de la escena siguen el ciclo de recursos de R3F. Los cuadros largos no producen grandes saltos del reloj.

Si una textura falla, el cuerpo mantiene su geometría y color para permitir la exploración. Si el contexto WebGL falla o se pierde, aparece un mensaje y un botón para recargar; las fichas y la comparación siguen accesibles. Se respetan las preferencias de movimiento reducido: las transiciones de cámara se realizan de forma inmediata y se elimina el giro automático cinematográfico.

## Comprobar y compilar

```bash
npm run typecheck
npm run test
npm run build
npm run preview
```

`npm run build` comprueba TypeScript y genera `dist`. `npm run preview` sirve la compilación, normalmente en http://localhost:4173. La carpeta `dist` ya viene incluida en esta entrega y también puedes servirla con un servidor estático HTTP.

Las pruebas de escena usan el renderizador de pruebas de React Three Fiber, sin GPU. Las pruebas de interfaz instrumentan el conector de la escena para verificar los comandos que envían los controles; las mallas y la cámara se prueban por separado. El detalle de lo comprobado y sus límites está en `VERIFICACION.md`. El renderizado visual, los shaders en GPU, el rendimiento real y los gestos en un dispositivo físico requieren la comprobación en navegador descrita allí.

## Publicar en Vercel

1. Sube el contenido de esta carpeta a un repositorio de GitHub. No subas `node_modules`.
2. En Vercel, importa ese repositorio como proyecto.
3. Selecciona el framework **Vite**, `npm run build` como comando y `dist` como directorio de salida. Usa Node.js 24 si el panel permite elegirlo.
4. Publica el proyecto. `vercel.json` incluye la configuración y la ruta de respaldo de la aplicación.

También puedes ejecutar `npx vercel` desde esta carpeta y seguir las instrucciones de la CLI. Documentación oficial: https://vercel.com/docs/frameworks/frontend/vite

## Publicar en Netlify

**Desde un repositorio:** importa el repositorio en Netlify. `netlify.toml` configura el comando de compilación, el directorio `dist` y Node.js 24. Publica y abre la URL que te entregue la plataforma.

**Publicación manual:** ejecuta `npm run build` y carga la carpeta `dist` en el despliegue manual de Netlify. Para esta opción no se utiliza el código fuente ni hace falta compilar en Netlify. El archivo `_redirects` se copia dentro de `dist`.

Documentación oficial: https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/

No se necesitan claves de API, base de datos ni un servidor de backend: la simulación y los datos de referencia se ejecutan en el navegador. Este proyecto está entregado para ejecutarse localmente; no se publicó en una cuenta de hosting.
