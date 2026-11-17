// Ilustrações em SVG geradas no build: desenho em linha do hero, mapa da rede e ícones.

// ---------------------------------------------------------------- ícones ----
export const icon = {
  arrow: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  whatsapp: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.4 8.4 0 0 0-7.2 12.8L3.6 20.4l4.2-1.1A8.4 8.4 0 1 0 12 3.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8.5c-1.2 1.2-.6 3.200 1 4.800s3.600 2.200 4.800 1l-1.500-1.500-1 .5c-.8-.4-1.400-1-1.800-1.800l.5-1Z" fill="currentColor"/></svg>`,
  mail: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17zM3.5 7l8.500 6.500L20.500 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  instagram: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="16.6" cy="7.4" r="1" fill="currentColor"/></svg>`,
  menu: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  close: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

// Marca: um azulejo. Provisória, até o manual de marca da SKJR.
export const mark = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="2" fill="currentColor"/><path d="M0 16A16 16 0 0 0 16 0M32 16A16 16 0 0 0 16 32" fill="none" stroke="#fff" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="#fff"/></svg>`;

// ---------------------------------------------------- desenho em linha ----
// Belo Horizonte (Serra do Curral, Igrejinha da Pampulha, palmeiras e o
// Edifício Niemeyer da Praça da Liberdade) + Lille, Paris, Nice, Raleigh, Dubai.
export function skyline(label, cities) {
  let n = 0;
  // cada traço se desenha da esquerda para a direita
  // --d: atraso no desktop (da esquerda para a direita); --j: pequeno atraso
  // quando a cidade é desenhada ao aparecer na tela (celular); data-x: posição.
  const p = (d, x, cls = '') => {
    const k = n++ % 3;
    return `<path class="draw ${cls}" pathLength="1" data-x="${x}" style="--d:${(0.25 + (x / 1600) * 1.5 + k * 0.04).toFixed(2)}s;--j:${(k * 0.14).toFixed(2)}s" d="${d}"/>`;
  };
  const palm = (x, top, s = 1, trunk = true) => {
    const f = [
      'Q-18 -22 -40 -6', 'Q-12 -34 -32 -32', 'Q-2 -38 -6 -48',
      'Q12 -34 32 -32', 'Q18 -22 40 -6', 'Q-20 -2 -34 18', 'Q20 -2 34 18',
    ].map(q => {
      const m = q.match(/-?\d+/g).map(Number);
      return `M${x} ${top}Q${x + m[0] * s} ${top + m[1] * s} ${x + m[2] * s} ${top + m[3] * s}`;
    }).join('');
    return (trunk ? p(`M${x} 300V${top}`, x) : '') + p(f, x);
  };
  const hlines = (x1, x2, y1, y2, step) => {
    let d = '';
    for (let y = y1; y <= y2; y += step) d += `M${x1} ${y}H${x2}`;
    return d;
  };

  const art = [
    // Serra do Curral
    p('M0 236L46 212L92 178L128 160L168 168L214 128L262 148L304 116L352 140L402 130L452 164L498 154L556 192L610 216L668 198L720 224L800 244', 200, 'is-far'),
    // Igrejinha da Pampulha: abóbadas
    p('M150 300Q178 222 206 300Q268 40 330 300Q358 222 386 300Q414 222 442 300', 290, 'is-solid'),
    `<g clip-path="url(#vault)">${p(hlines(206, 330, 190, 290, 20) + 'M240 170V300M268 170V300M296 170V300', 268, 'is-fine')}</g>`,
    // marquise e campanário
    p('M438 284L486 262', 460),
    p('M486 300L478 152H510L502 300', 494, 'is-solid'),
    p('M480 176H508M482 200H506M494 152V128M486 137H502', 494, 'is-fine'),
    // Lagoa da Pampulha
    p('M120 316q10 -6 20 0t20 0t20 0t20 0M300 322q10 -6 20 0t20 0t20 0', 250, 'is-fine'),
    // palmeiras imperiais da Praça da Liberdade
    palm(572, 176), palm(616, 158), palm(660, 182),
    // Edifício Niemeyer
    p('M704 300V170Q704 150 724 150H776Q796 150 796 170V300', 750, 'is-solid'),
    p(hlines(704, 796, 166, 286, 12), 750, 'is-fine'),

    // Lille: beffroi e casas flamengas
    p('M902 300V152H926V300M906 152V118H922V152M904 118H924L914 82Z', 914, 'is-solid'),
    p('M914 82V66', 914, 'is-fine'),
    `<circle class="draw is-fine" pathLength="1" data-x="914" style="--d:1.12s;--j:.3s" cx="914" cy="172" r="6"/>`,
    p('M934 300V238h7v-9h7v-9h7v-9h7v9h7v9h7v9h7V300', 958, 'is-solid'),
    p('M983 300V248h6v-8h6v-8h6v-8h6v8h6v8h6v8h6V300', 1004, 'is-solid'),
    // Paris: torre Eiffel
    p('M1052 300Q1084 252 1089 130L1092 84L1095 130Q1100 252 1132 300', 1092),
    p('M1066 300Q1092 258 1118 300M1073 252H1111M1082 205H1102M1092 84V66', 1092, 'is-fine'),
    // Nice: colina, palmeira, sol e veleiro
    p('M1156 300Q1222 230 1296 300', 1226, 'is-far'),
    p('M1186 300Q1182 268 1188 240', 1186), palm(1188, 240, 0.62, false),
    `<circle class="draw is-fine" pathLength="1" data-x="1262" style="--d:1.42s;--j:.3s" cx="1262" cy="206" r="13"/>`,
    p('M1236 290H1270L1264 300H1242ZM1253 290V254M1253 258L1268 286H1253', 1253),
    p('M1278 314q8 -5 16 0t16 0', 1290, 'is-fine'),
    // Raleigh: centro e um carvalho (City of Oaks)
    p('M1312 300V248H1332V300', 1322, 'is-solid'),
    p('M1336 300V198L1351 174L1366 198V300', 1351, 'is-solid'),
    p('M1351 174V152M1346 208V292M1356 208V292', 1351, 'is-fine'),
    p('M1372 300V224H1402V300M1378 224V214H1396V224', 1387, 'is-solid'),
    p('M1430 300V270M1412 270C1398 268 1396 250 1408 246C1406 232 1422 224 1432 232C1442 224 1458 232 1454 246C1466 252 1462 270 1448 270Z', 1432),
    // Dubai: Burj Khalifa e Burj Al Arab
    p('M1486 300V236H1491V188H1495V144H1498V100H1501V56L1504 22L1507 56V100H1510V144H1513V188H1517V236H1522V300', 1504, 'is-solid'),
    p('M1548 300V194Q1598 222 1592 300', 1570, 'is-solid'),
    p('M1548 226H1574M1548 250H1586M1548 274H1591', 1570, 'is-fine'),
    // chão
    p('M0 300H1600', 0, 'is-ground'),
  ].join('');

  const names = [[470, cities[0]], [958, cities[1]], [1092, cities[2]], [1226, cities[3]], [1386, cities[4]], [1540, cities[5]]]
    .map(([x, c]) => `<text x="${x}" y="340" text-anchor="middle">${c}</text>`).join('');

  return `<svg class="skyline" viewBox="0 0 1600 360" role="img" aria-label="${label}">
<defs><clipPath id="vault"><path d="M206 300Q268 40 330 300Z"/></clipPath></defs>
<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${art}</g>
<g class="skyline__names">${names}</g></svg>`;
}

// ------------------------------------------------------------- mapa ----
// Continentes simplificados (lon, lat). Suficiente para um mapa pontilhado.
const LAND = [
  // América do Norte e Central
  [[-130,55],[-125,48],[-124,40],[-117,32.5],[-110,23],[-105,20],[-97,16],[-92,15],[-87,13],[-83,8.5],[-79.5,9],[-77,8],[-83,10],[-83.5,15],[-87,16],[-88,21],[-90,21],[-91,18.5],[-97,20],[-97.5,25],[-94,29.5],[-90,29.5],[-85,30],[-83,28],[-81.5,25.5],[-80,27],[-81,31],[-76,35],[-75.5,37.5],[-74,40.5],[-70,42],[-67,45],[-64,45],[-60,46],[-65,49],[-58,51.5],[-56,53],[-61,56.5],[-64.5,60],[-70,62],[-78,62],[-77,56],[-80,51.5],[-85,55.5],[-93,58.5],[-94,62],[-88,64],[-95,75],[-130,75]],
  // Groenlândia
  [[-45,60],[-52,65],[-55,70],[-60,76],[-20,76],[-22,70],[-33,67],[-41,63]],
  // América do Sul
  [[-77,8],[-72,12],[-68,11.5],[-62,10.5],[-57,6],[-51,4],[-50,0],[-44,-2.5],[-37,-5],[-35,-8],[-39,-15],[-41,-22],[-48,-25.5],[-48.5,-28],[-53,-34],[-58,-34.5],[-57,-38],[-62,-39],[-65,-41],[-65,-45],[-68,-50],[-69,-52.5],[-72,-53.5],[-75,-50],[-73,-42],[-73.5,-37],[-71.5,-30],[-70,-18],[-76,-14],[-81,-6],[-80,-2.5],[-80,1],[-77.5,4],[-77.5,7]],
  // África
  [[-6,35.8],[-10,31],[-17,21],[-17.5,14.7],[-15,11],[-11,7],[-8,4.5],[-4,5],[2,6.2],[5,4.3],[9,4],[9.5,1],[9,-1],[12,-5],[13.5,-9],[12,-17],[14.5,-22.5],[16.5,-28.5],[18.5,-34],[20,-34.8],[25.5,-34],[30.5,-30.5],[32.5,-26],[35.5,-23],[35,-20],[40.5,-15.5],[40,-10.5],[39,-6],[41.5,-2],[48,5],[51,11.8],[44,10.5],[43,12.5],[39.5,15.5],[37,21],[34,27.5],[32.5,30],[32,31.3],[25,31.7],[20,30.8],[15,32.3],[10,33.8],[10.5,37],[3,36.8],[-2,35.2]],
  // Madagascar
  [[49.3,-12],[50.3,-15.5],[47.5,-24.5],[45,-25.3],[43.5,-22],[44.5,-16]],
  // Europa e Ásia (até 84°E)
  [[-9,43],[-9.5,38.7],[-8.8,37],[-6,36.2],[-2,36.8],[0,38.7],[3,42],[4,43.4],[7.5,43.8],[9,44.3],[10.5,43],[12.5,41.5],[15.6,38],[16.5,38.5],[17,40.5],[18.5,40.2],[16,41.8],[13.5,43.6],[12.3,45.3],[13.7,45.6],[15,44.2],[19.3,41.8],[21,38.5],[22.7,36.5],[24,38],[23,40.3],[26,40.8],[26.3,40],[26.5,38.5],[27.5,37],[30.5,36.3],[36,36.5],[35.8,34.5],[35,32],[34.3,31.2],[35,28],[37.5,24],[39,21],[42.5,16.5],[43.5,12.7],[45,12.8],[52,16.5],[55,17.5],[58.5,20.5],[59.8,22.5],[56.5,24.5],[56.3,26.2],[54.5,24.3],[51.5,24.5],[51.5,26],[50,26.5],[48,29.5],[50,30],[51,28],[54,26.7],[56.5,27],[57.5,25.5],[61.5,25.2],[66.5,25.3],[68,23.7],[70,21],[72.7,21],[72.8,19],[74,14.5],[76.5,9],[77.5,8],[80,10],[80,15],[84,18.5],[84,75],[60,70],[44,67],[40,65.5],[33,69.5],[28,71],[22,70],[15,68],[12,65.5],[5,62],[5,58.5],[7.5,58],[11,59],[12.8,55.6],[14.5,56],[16.5,57],[18.5,60],[17.5,62],[21,64.5],[24,65.8],[25.5,65],[21.5,62.5],[21.5,60.5],[25,60],[30,60],[28,59.5],[23.5,59.3],[24,57.5],[21,57],[21,55],[19,54.4],[14,54],[11,54],[9.8,55],[10.5,57.5],[8.2,57],[8.5,55],[8.8,54],[7,53.5],[4.5,52.5],[3.5,51.3],[1.7,51],[1.5,50],[-1.5,49.7],[-1.5,48.6],[-4.7,48.4],[-2.5,47.3],[-1.2,46],[-1.5,43.5]],
  // mares interiores (furos): Negro e Cáspio
  [[28,41.5],[28.5,43.5],[30.5,46],[33.5,46],[37,45.2],[39,47],[41.5,42],[36,41.2],[31.5,41.2]],
  [[47.5,45],[51,46.8],[53,45],[52.5,41],[54,39],[53.8,37],[50,37.3],[49,40.5],[47.5,43]],
  // Ilhas Britânicas e Islândia
  [[-5.5,50],[1.3,51.2],[1.7,52.8],[0,53.5],[-1.5,55],[-2,57.5],[-3.5,58.6],[-5,58.5],[-6,56.5],[-5,54.8],[-3,54],[-4.5,53.2],[-5,51.8],[-3,51.4]],
  [[-6,52.2],[-10,51.8],[-10,54.2],[-8,55.3],[-6,55],[-6,53.5]],
  [[-24,65.5],[-22,64],[-18,63.4],[-14,64.5],[-14.5,66],[-18,66.5],[-22,66.3]],
  // Cuba e Hispaniola
  [[-85,22],[-80,23],[-74.5,20.2],[-77.5,19.8],[-82,22]],
  [[-74.3,19.8],[-70,19.8],[-68.5,18.5],[-71.5,17.8],[-74.3,18.5]],
];

const W = 1000, H = 600, LON0 = -128, LON1 = 84, LAT0 = -42, LAT1 = 68;
const px = lon => ((lon - LON0) / (LON1 - LON0)) * W;
const py = lat => ((LAT1 - lat) / (LAT1 - LAT0)) * H;

function inLand(lon, lat) {
  let inside = false;
  for (const poly of LAND) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

export function worldMap(antennas, lang, label) {
  // pontilhado
  const STEP = 11;
  let dots = '';
  for (let y = STEP / 2; y < H; y += STEP) {
    for (let x = STEP / 2; x < W; x += STEP) {
      const lon = LON0 + (x / W) * (LON1 - LON0), lat = LAT1 - (y / H) * (LAT1 - LAT0);
      if (inLand(lon, lat)) dots += `M${x} ${y}h0`;
    }
  }
  const home = antennas.find(a => a.home);
  const hx = px(home.lon), hy = py(home.lat);
  const arcs = antennas.filter(a => !a.home).map((a, i) => {
    const x = px(a.lon), y = py(a.lat);
    const mx = (hx + x) / 2, my = (hy + y) / 2;
    const len = Math.hypot(x - hx, y - hy);
    const cx = mx, cy = my - len * 0.24;            // arco curvado para cima
    const d = `M${hx.toFixed(1)} ${hy.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    return `<path class="map__arc" data-arc="${a.id}" pathLength="1" style="--d:${(0.15 * i).toFixed(2)}s" d="${d}"/>`
      + `<path class="map__comet" pathLength="1" style="--c:${(1.6 + 0.9 * i).toFixed(2)}s" d="${d}"/>`;
  }).join('');
  const pins = antennas.map(a => {
    const x = px(a.lon).toFixed(1), y = py(a.lat).toFixed(1);
    const [lx, ly, anchor] = a.label;
    return `<g class="map__pin${a.home ? ' is-home' : ''}" data-antenna="${a.id}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="${a.city[lang]}, ${a.country[lang]}">
<circle class="map__hit" r="16"/><g class="map__dot"><circle class="map__ring" r="10"/><circle class="map__core" r="${a.home ? 6 : 4.5}"/></g>
<text class="map__name" x="${lx}" y="${ly}" text-anchor="${anchor}">${a.city[lang]}</text></g>`;
  }).join('');
  return `<svg class="map" viewBox="0 0 ${W} ${H}" role="group" aria-label="${label}">
<path class="map__land" d="${dots}"/>${arcs}${pins}</svg>`;
}
