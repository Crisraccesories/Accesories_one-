
<script>
// ==========================
// CONFIG
// ==========================
const BASE  = '/Accesories-one';  // GitHub Pages, carpeta del repo
const LOTES = [
  '/prueba_lote/productos_prueba.json',
  '/lote_01/productos_lote_01.json'
];

const IMG_BASES = {
  'prueba_lote': `${BASE}/prueba_lote/images/`,
  'lote_01'    : `${BASE}/lote_01/images/`
};

// ==========================
// CARGA MULTILOTE
// ==========================
async function cargarProductos() {
  const fetchJson = (url) =>
    fetch(`${BASE}${url}`).then(r => {
      if (!r.ok) throw new Error(`No se pudo cargar: ${url} (${r.status})`);
      return r.json();
    });

  const listas = await Promise.all(LOTES.map(fetchJson));
  const all = [];

  for (let i = 0; i < LOTES.length; i++) {
    const folder  = LOTES[i].split('/')[1];              // 'prueba_lote' o 'lote_01'
    const imgBase = IMG_BASES[folder] || `${BASE}/prueba_lote/images/`;
    const items   = listas[i].map(p => ({ ...p, _imgBase: imgBase }));
    all.push(...items);
  }
  return all;
}

// ==========================
// RENDER
// ==========================
function renderProductos(items) {
  const grid = document.getElementById('gridProductos');
  if (!grid) return;

  grid.innerHTML = items.map(item => `
    <article class="product-card rounded-lg border border-ink-200 dark:border-ink-800 p-3 flex flex-col">
      <div class="aspect-[4/3] bg-white flex items-center justify-center overflow-hidden rounded">
        ${item._imgBase + item.imagen}
      </div>
      <h3 class="mt-3 font-semibold">${item.titulo || item.name || ''}</h3>
      <p class="mt-1 text-sm text-ink-600 dark:text-ink-300 line-clamp-2">
        ${item.descripcion || ''}
      </p>
      <div class="mt-3 text-xs uppercase tracking-wide text-ink-500">
        ${(item.categoria || item.cat || 'General')}
      </div>
    </article>
  `).join('');
}

// ==========================
// BÚSQUEDA / FILTROS (opcional)
// ==========================
// Si ya tenías buscador y chips, reactívalos aquí:
function wireUpFilters(data){
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
    renderProductos(view);
  };

  chips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      ch.classList.add('active');
      filtro = (ch.dataset.filter || 'all').toLowerCase();
      apply();
    });
  });

  if (input) {
    input.addEventListener('input', e=>{
      q = e.target.value;
      apply();
    });
  }

  apply();
}

// ==========================
// BOOT
// ==========================
cargarProductos()
  .then(items => {
    renderProductos(items);
    // Activa si tienes buscador/filtros en tu HTML:
    wireUpFilters(items);
  })
  .catch(err => console.error('[Catalog] Error:', err));
</script>
