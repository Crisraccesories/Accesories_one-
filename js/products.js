
// ==========================
// CONFIG (GitHub Pages)
// ==========================
const BASE  = '/Accesories-one';
const LOTES = [
  '/prueba_lote/productos_prueba.json',
  '/lote_01/productos_lote_01.json'
];
const IMG_BASES = {
  'prueba_lote': `${BASE}/prueba_lote/images/`,
  'lote_01'    : `${BASE}/lote_01/images/`
};

// ==========================
// CARGA MULTILOTE (DOM-safe)
// ==========================
async function cargarProductosV2() {
  const fetchJson = (url) =>
    fetch(`${BASE}${url}`).then(r => {
      if (!r.ok) throw new Error(`No se pudo cargar: ${url} (${r.status})`);
      return r.json();
    });

  const listas = await Promise.all(LOTES.map(fetchJson));
  const all = [];
  for (let i = 0; i < LOTES.length; i++) {
    const folder  = LOTES[i].split('/')[1]; // 'prueba_lote' o 'lote_01'
    const imgBase = IMG_BASES[folder];
    const items   = listas[i].map(p => ({ ...p, _imgBase: imgBase }));
    all.push(...items);
  }
  return all;
}

// ==========================
// RENDER con createElement (imposible que se “escape” como texto)
// ==========================
function renderProductosV2(items) {
  const grid = document.getElementById('gridProductos');
  if (!grid) return;

  grid.innerHTML = '';

  items.forEach(item => {
    const art   = document.createElement('article');
    art.className = 'product-card rounded-lg border border-ink-200 dark:border-ink-800 p-3 flex flex-col';

    const picWrap = document.createElement('div');
    picWrap.className = 'aspect-[4/3] bg-white flex items-center justify-center overflow-hidden rounded';

    const img   = document.createElement('img');
    img.src     = (item._imgBase || '') + (item.imagen || '');
    img.alt     = item.titulo || '';
    img.className = 'w-full h-48 object-contain';
    img.loading = 'lazy';

    const h3    = document.createElement('h3');
    h3.className = 'mt-3 font-semibold';
    h3.textContent = item.titulo || '';

    const p     = document.createElement('p');
    p.className = 'mt-1 text-sm text-ink-600 dark:text-ink-300 line-clamp-2';
    p.textContent = item.descripcion || '';

    const cat   = document.createElement('div');
    cat.className = 'mt-3 text-xs uppercase tracking-wide text-ink-500';
    cat.textContent = item.categoria || 'General';

    picWrap.appendChild(img);
    art.appendChild(picWrap);
    art.appendChild(h3);
    art.appendChild(p);
    art.appendChild(cat);
    grid.appendChild(art);
  });
}

// ==========================
// FILTROS / BÚSQUEDA (V2)
// ==========================
function wireUpFiltersV2(data){
  const chips = document.querySelectorAll('.f-chip');
  const input = document.getElementById('buscador');

  let filtro = 'all';
  let q = '';

  const apply = ()=>{
    const qlc = q.trim().toLowerCase();
    const view = data.filter(p=>{
      const cat = (p.categoria || p.cat || '').toLowerCase();
      const byCat  = (filtro === 'all') || cat === filtro;
      const texto  = `${p.titulo || p.name || ''} ${p.descripcion || ''}`.toLowerCase();
      const byText = !qlc || texto.includes(qlc);
      return byCat && byText;
    });
    renderProductosV2(view);
  };

  chips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      ch.classList.add('active');
      filtro = (ch.dataset.filter || 'all').toLowerCase();
      apply();
    });
  });

  if (input) input.addEventListener('input', e=>{ q = e.target.value; apply(); });

  apply();
}

// ==========================
// BOOT
// ==========================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Catalog] multilote V2 DOM ON', new Date().toISOString());
  try {
    const items = await cargarProductosV2();
    console.log('[Catalog] items cargados:', items.length);
    renderProductosV2(items);
    wireUpFiltersV2(items);
  } catch (err) {
    console.error('[Catalog] Error V2 DOM:', err);
  }
});
