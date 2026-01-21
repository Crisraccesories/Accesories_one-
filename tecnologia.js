
const grid = document.querySelector('#gridTec');
const inputQ = document.querySelector('#q');
const selCat = document.querySelector('#cat');
const selOrden = document.querySelector('#orden');
const spanAnio = document.querySelector('#anio');
spanAnio.textContent = new Date().getFullYear();

let DATA = [];
let CATS = new Set();

function formatearCOP(valor) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

function esTecnologia(c) {
  const no = ['BELLEZA','USO PERSONAL','TERMO','SOMBRILLA'];
  const up = (c||'').toUpperCase();
  return !no.some(n => up.includes(n));
}

async function cargar() {
  try {
    const res = await fetch('./products.json', { cache: 'no-store' });
    const all = await res.json();
    DATA = all.filter(p => esTecnologia(p.categoria));
    DATA.forEach(p => CATS.add(p.categoria));
    renderCategorias();
    render();
  } catch (e) {
    console.error(e);
    grid.innerHTML = '<p>Error cargando el catálogo.</p>';
  }
}

function renderCategorias() {
  const opts = ['<option value="">Todas las categorías</option>']
    .concat(
      Array.from(CATS).sort().map(c => `<option value="${c}">${c}</option>`)
    ).join('');
  selCat.innerHTML = opts;
}

function normalizar(t){ return (t||'').toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase(); }

function render() {
  const q = normalizar(inputQ.value);
  const cat = selCat.value;
  let items = DATA.filter(p => {
    const okQ = !q || normalizar(p.nombre).includes(q);
    const okC = !cat || p.categoria === cat;
    return okQ && okC;
  });

  switch(selOrden.value){
    case 'precio_asc': items.sort((a,b)=>a.precio-b.precio); break;
    case 'precio_desc': items.sort((a,b)=>b.precio-a.precio); break;
    case 'nombre_asc': items.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es')); break;
    default: break;
  }

  if (!items.length){ grid.innerHTML = '<p>No hay resultados para tu búsqueda.</p>'; return; }

  grid.innerHTML = items.map(p => {
    const msg = encodeURIComponent(`Hola, me interesa el producto: ${p.nombre} (${formatearCOP(p.precio)})`);
    const wa = `https://wa.me/57XXXXXXXXXX?text=${msg}`; // ← Reemplaza por tu número de WhatsApp
    return `
      <article class="card">
        <img src="${p.img}" alt="${p.nombre}" loading="lazy">
        <h3>${p.nombre}</h3>
        <p class="price">${formatearCOP(p.precio)}</p>
        <span class="chip">${p.categoria}</span>
        <div class="row">
          <a class="btn" href="${wa}" target="_blank" rel="noopener">Comprar por WhatsApp</a>
        </div>
      </article>`;
  }).join('');
}

[inputQ, selCat, selOrden].forEach(el => el && el.addEventListener('input', render));

cargar();
