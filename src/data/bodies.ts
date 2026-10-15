export type BodyId = 'sun' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';

export interface CelestialBody {
  id: BodyId; name: string; order: number; kind: string; color: string; texture: string;
  diameter: number; mass24: number; distanceMkm: number; temperatureC: number;
  solarDayHours: number; rotationHours: number; orbitalDays: number; gravity: number;
  moons: number | null; atmosphere: string; description: string; tagline: string;
  facts: string[]; lesson: string; source: string; moonSource?: string; moonNote?: string;
  radius: number; orbitRadius: number; eccentricity: number; inclination: number;
  tilt: number; phase: number; node: number;
}

export const DATA_DATE = '14 de octubre de 2026';
export const FACT_SHEET = 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/';
const texture = (name: string) => `/textures/${name}.webp`;

export const BODIES: CelestialBody[] = [
  {
    id: 'sun', name: 'Sol', order: 0, kind: 'Estrella · tipo G', color: '#ffb75e', texture: texture('sun'),
    diameter: 1392700, mass24: 1989000, distanceMkm: 0, temperatureC: 5500,
    solarDayHours: 609.12, rotationHours: 609.12, orbitalDays: 0, gravity: 274, moons: null,
    atmosphere: 'Principalmente hidrógeno y helio. Su atmósfera incluye la fotosfera, la cromosfera y la corona.',
    tagline: 'La estrella que hace posible todo.',
    description: 'En el centro de nuestro sistema, el Sol transforma hidrógeno en helio por fusión nuclear. Su luz y su gravedad conectan todos los mundos que estás explorando.',
    facts: ['La luz solar tarda unos 8 minutos y 20 segundos en llegar a la Tierra.', 'El Sol es plasma: su ecuador y sus polos rotan a velocidades distintas.', 'La corona solar es mucho más caliente que la superficie visible.'],
    lesson: 'La gravedad del Sol mantiene a los planetas en sus órbitas. La luz viaja rápido, pero incluso desde nuestra estrella necesita varios minutos para llegar hasta nosotros.',
    source: 'https://science.nasa.gov/sun/facts/',
    radius: 4.4, orbitRadius: 0, eccentricity: 0, inclination: 0, tilt: 7.25, phase: 0, node: 0,
  },
  {
    id: 'mercury', name: 'Mercurio', order: 1, kind: 'Planeta rocoso', color: '#aaa49c', texture: texture('mercury'),
    diameter: 4879, mass24: 0.330, distanceMkm: 57.9, temperatureC: 167,
    solarDayHours: 4222.6, rotationHours: 1407.6, orbitalDays: 88, gravity: 3.7, moons: 0,
    atmosphere: 'No tiene una atmósfera densa. Su tenue exosfera contiene oxígeno, sodio, hidrógeno, helio y potasio.',
    tagline: 'Pequeño mundo. Grandes extremos.',
    description: 'El planeta más cercano al Sol es un mundo rocoso cubierto de cráteres. Su tenue exosfera apenas retiene calor, por eso sus días y noches alcanzan temperaturas muy diferentes.',
    facts: ['Un día solar dura casi dos años de Mercurio.', 'Hay hielo de agua en cráteres polares que permanecen en sombra.', 'Aunque es el más cercano al Sol, no es el planeta más caliente.'],
    lesson: 'Rotación y día solar no son lo mismo. Mercurio gira sobre su eje en unos 59 días terrestres, pero el Sol vuelve al mismo lugar de su cielo después de unos 176 días.',
    source: 'https://science.nasa.gov/mercury/facts/',
    radius: 0.58, orbitRadius: 9, eccentricity: 0.206, inclination: 7, tilt: 0.034, phase: 1.6, node: 0.8,
  },
  {
    id: 'venus', name: 'Venus', order: 2, kind: 'Planeta rocoso', color: '#e3c084', texture: texture('venus_atmosphere'),
    diameter: 12104, mass24: 4.87, distanceMkm: 108.2, temperatureC: 464,
    solarDayHours: 2802, rotationHours: -5832.5, orbitalDays: 224.7, gravity: 8.9, moons: 0,
    atmosphere: 'Dióxido de carbono predominante y nitrógeno. Sus nubes contienen ácido sulfúrico.',
    tagline: 'Belleza envuelta en un calor extremo.',
    description: 'Bajo sus brillantes nubes, Venus esconde una superficie abrasadora. Una atmósfera muy densa de dióxido de carbono produce un intenso efecto invernadero.',
    facts: ['Es el planeta más caliente del sistema solar.', 'Su rotación es retrógrada: gira en sentido contrario al de la Tierra.', 'Una vuelta sobre su eje tarda más que su año.'],
    lesson: 'Estar más cerca del Sol no determina por sí solo la temperatura. La atmósfera de Venus atrapa energía y hace que su superficie sea más caliente que la de Mercurio.',
    source: 'https://science.nasa.gov/venus/venus-facts/',
    radius: 1.12, orbitRadius: 15, eccentricity: 0.007, inclination: 3.4, tilt: 177.4, phase: 3.5, node: 1.3,
  },
  {
    id: 'earth', name: 'Tierra', order: 3, kind: 'Planeta rocoso', color: '#7fb9d8', texture: texture('earth_daymap'),
    diameter: 12756, mass24: 5.97, distanceMkm: 149.6, temperatureC: 15,
    solarDayHours: 24, rotationHours: 23.9, orbitalDays: 365.2, gravity: 9.8, moons: 1,
    atmosphere: 'Aproximadamente 78 % nitrógeno, 21 % oxígeno y 1 % de otros gases, cerca de la superficie.',
    tagline: 'Nuestro pequeño punto azul.',
    description: 'Océanos, continentes y una delicada atmósfera. La Tierra es el único mundo donde hemos confirmado vida, y nuestro hogar en la inmensidad del universo.',
    facts: ['Los océanos cubren alrededor del 71 % de la superficie.', 'Su campo magnético ayuda a desviar partículas del viento solar.', 'La Luna contribuye a estabilizar la inclinación del eje terrestre.'],
    lesson: 'La inclinación de 23,4° del eje terrestre produce las estaciones. No se deben a que nuestro planeta esté mucho más cerca o más lejos del Sol.',
    source: 'https://science.nasa.gov/earth/facts/',
    radius: 1.2, orbitRadius: 22, eccentricity: 0.017, inclination: 0, tilt: 23.4, phase: 0.6, node: 0,
  },
  {
    id: 'mars', name: 'Marte', order: 4, kind: 'Planeta rocoso', color: '#d28460', texture: texture('mars'),
    diameter: 6792, mass24: 0.642, distanceMkm: 228, temperatureC: -65,
    solarDayHours: 24.7, rotationHours: 24.6, orbitalDays: 687, gravity: 3.7, moons: 2,
    atmosphere: 'Atmósfera muy tenue, principalmente dióxido de carbono, con nitrógeno y argón.',
    tagline: 'El próximo horizonte.',
    description: 'El óxido de hierro tiñe de rojo este mundo frío y desértico. Sus valles y minerales conservan pistas de un pasado en el que el agua líquida recorrió la superficie.',
    facts: ['El monte Olimpo es un gigantesco volcán marciano.', 'Sus dos lunas se llaman Fobos y Deimos.', 'Su día dura apenas un poco más que un día terrestre.'],
    lesson: 'Un día parecido al terrestre no implica un clima parecido. La atmósfera de Marte es muy tenue, y su superficie pierde calor con facilidad.',
    source: 'https://science.nasa.gov/mars/facts/',
    radius: 0.8, orbitRadius: 31, eccentricity: 0.094, inclination: 1.8, tilt: 25.2, phase: 5.5, node: 0.86,
  },
  {
    id: 'jupiter', name: 'Júpiter', order: 5, kind: 'Gigante gaseoso', color: '#d6b99a', texture: texture('jupiter'),
    diameter: 142984, mass24: 1898, distanceMkm: 778.5, temperatureC: -110,
    solarDayHours: 9.9, rotationHours: 9.9, orbitalDays: 4331, gravity: 23.1, moons: 115,
    moonSource: 'https://science.nasa.gov/jupiter/jupiter-moons/', moonNote: 'NASA · septiembre de 2026',
    atmosphere: 'Principalmente hidrógeno y helio; trazas de metano, amoníaco y vapor de agua.',
    tagline: 'El gigante de los mundos.',
    description: 'Júpiter domina el sistema planetario por su tamaño y masa. Sus bandas son corrientes de nubes, y la Gran Mancha Roja es una enorme tormenta que lleva siglos activa.',
    facts: ['Tiene más masa que todos los demás planetas juntos.', 'Ganímedes, una de sus lunas, es más grande que Mercurio.', 'Sus zonas claras y cinturones oscuros llevan vientos en direcciones opuestas.'],
    lesson: 'Júpiter no tiene una superficie sólida como la Tierra. La temperatura y gravedad de referencia de los gigantes se describen para niveles definidos de su atmósfera.',
    source: 'https://science.nasa.gov/jupiter/jupiter-facts/',
    radius: 3.7, orbitRadius: 56, eccentricity: 0.049, inclination: 1.3, tilt: 3.1, phase: 2.6, node: 1.75,
  },
  {
    id: 'saturn', name: 'Saturno', order: 6, kind: 'Gigante gaseoso', color: '#decea3', texture: texture('saturn'),
    diameter: 120536, mass24: 568, distanceMkm: 1432, temperatureC: -140,
    solarDayHours: 10.7, rotationHours: 10.7, orbitalDays: 10747, gravity: 9, moons: 293,
    moonSource: 'https://science.nasa.gov/saturn/moons/', moonNote: 'NASA · agosto de 2026',
    atmosphere: 'Principalmente hidrógeno y helio, con trazas de metano y amoníaco.',
    tagline: 'Una obra de arte en órbita.',
    description: 'Sus anillos están formados por incontables fragmentos de hielo y roca. Saturno es un gigante gaseoso de tonos suaves, rodeado por una extraordinaria familia de lunas.',
    facts: ['Su densidad media es menor que la del agua.', 'Titán tiene una atmósfera densa y lagos de metano y etano.', 'Encélado expulsa material de un océano oculto bajo el hielo.'],
    lesson: 'Los anillos no son un disco sólido: cada partícula orbita el planeta. La separación visible entre sus grandes regiones se conoce como división de Cassini.',
    source: 'https://science.nasa.gov/saturn/facts/',
    radius: 3.15, orbitRadius: 78, eccentricity: 0.052, inclination: 2.5, tilt: 26.7, phase: 4.2, node: 1.98,
  },
  {
    id: 'uranus', name: 'Urano', order: 7, kind: 'Gigante helado', color: '#a6d6d8', texture: texture('uranus'),
    diameter: 51118, mass24: 86.8, distanceMkm: 2867, temperatureC: -195,
    solarDayHours: 17.2, rotationHours: -17.2, orbitalDays: 30589, gravity: 8.7, moons: 29,
    moonSource: 'https://science.nasa.gov/uranus/moons/', moonNote: 'NASA · agosto de 2026',
    atmosphere: 'Principalmente hidrógeno y helio, con metano que absorbe parte de la luz roja.',
    tagline: 'El planeta que gira de costado.',
    description: 'Urano es un gigante helado de color azul verdoso. Su eje tiene una inclinación extrema: parece rodar alrededor del Sol en lugar de girar erguido.',
    facts: ['Su eje está inclinado unos 98°.', 'También posee un sistema de anillos, muy tenue.', 'Sus lunas tienen nombres de personajes de Shakespeare y Alexander Pope.'],
    lesson: 'La inclinación extrema hace que sus estaciones sean muy distintas de las terrestres. Cerca de un solsticio, uno de sus polos apunta hacia el Sol durante años.',
    source: 'https://science.nasa.gov/uranus/facts/',
    radius: 2.05, orbitRadius: 103, eccentricity: 0.047, inclination: 0.8, tilt: 97.8, phase: 1.2, node: 1.29,
  },
  {
    id: 'neptune', name: 'Neptuno', order: 8, kind: 'Gigante helado', color: '#6594d9', texture: texture('neptune'),
    diameter: 49528, mass24: 102, distanceMkm: 4515, temperatureC: -200,
    solarDayHours: 16.1, rotationHours: 16.1, orbitalDays: 59800, gravity: 11, moons: 16,
    moonSource: 'https://science.nasa.gov/neptune/moons/', moonNote: 'NASA · septiembre de 2026',
    atmosphere: 'Principalmente hidrógeno, helio y metano. El color de la textura está realzado.',
    tagline: 'Donde el viento desafía los límites.',
    description: 'En los límites del sistema planetario, Neptuno es un mundo frío y dinámico. Sus nubes y tormentas atraviesan una atmósfera agitada por vientos extraordinariamente rápidos.',
    facts: ['Fue localizado a partir de predicciones matemáticas antes de observarse con un telescopio.', 'Tritón, su mayor luna, orbita en sentido retrógrado.', 'Necesita unos 164 años terrestres para completar su órbita.'],
    lesson: 'Neptuno recibe muy poca luz solar, pero su atmósfera sigue siendo activa. Los gigantes helados tienen interiores diferentes de los gigantes gaseosos Júpiter y Saturno.',
    source: 'https://science.nasa.gov/neptune/neptune-facts/',
    radius: 2, orbitRadius: 127, eccentricity: 0.01, inclination: 1.8, tilt: 28.3, phase: 5.7, node: 2.3,
  },
  {
    id: 'pluto', name: 'Plutón', order: 9, kind: 'Planeta enano', color: '#c5ad94', texture: texture('pluto'),
    diameter: 2376, mass24: 0.013, distanceMkm: 5906.4, temperatureC: -225,
    solarDayHours: 153.3, rotationHours: -153.3, orbitalDays: 90560, gravity: 0.7, moons: 5,
    atmosphere: 'Muy tenue, principalmente nitrógeno, con metano y monóxido de carbono.',
    tagline: 'Un mundo más allá de los planetas.',
    description: 'Plutón es un planeta enano del cinturón de Kuiper. Sus montañas de hielo y llanuras de nitrógeno revelan un mundo más complejo de lo que su pequeño tamaño sugiere.',
    facts: ['La Unión Astronómica Internacional lo clasificó como planeta enano en 2006.', 'Su órbita es más excéntrica e inclinada que las de los ocho planetas.', 'New Horizons lo exploró durante su paso cercano en 2015.'],
    lesson: 'Un planeta enano orbita el Sol y tiene forma casi esférica, pero no ha despejado su vecindario orbital. Plutón pertenece a esta categoría.',
    source: 'https://science.nasa.gov/dwarf-planets/pluto/facts/',
    radius: 0.52, orbitRadius: 153, eccentricity: 0.244, inclination: 17.2, tilt: 119.5, phase: 3.3, node: 1.92,
  },
];

export const BODY_BY_ID = Object.fromEntries(BODIES.map(body => [body.id, body])) as Record<BodyId, CelestialBody>;
export const PLANETS = BODIES.filter(body => body.id !== 'sun');
export const getVisibleBodies = (showPluto: boolean) => BODIES.filter(body => showPluto || body.id !== 'pluto');
export const normalizeSearch = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const searchBodies = (query: string) => BODIES.filter(body => normalizeSearch(`${body.name} ${body.id} ${body.kind}`).includes(normalizeSearch(query)));
export const number = (value: number, digits = 0) => new Intl.NumberFormat('es-PE', {maximumFractionDigits: digits}).format(value);
export function massLabel(body: CelestialBody) {
  const exponent = Math.floor(Math.log10(body.mass24)) + 24;
  const mantissa = body.mass24 / 10 ** (exponent - 24);
  return `${number(mantissa, 3)} × 10^${exponent} kg`;
}
export const dayLabel = (hours: number) => hours >= 48 ? `${number(hours / 24, 2)} d terrestres` : `${number(hours, 1)} h`;
export const yearLabel = (days: number) => days === 0 ? 'No aplica' : days > 730 ? `${number(days / 365.25, 2)} años terrestres` : `${number(days, 1)} d terrestres`;
