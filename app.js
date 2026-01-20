// Configuración
const BRAND = 'ACCESORIES_ONE';
const PHONE_INTL = '573133067667'; // Formato internacional (57 + número)
const WA_BASE = 'https://wa.me';

// Utilidades
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const fmtCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

// Datos de ejemplo (puedes editar libremente)
const PRODUCTS = [
  // Tecnología
  { id:'p1', name:'Audífonos Bluetooth ANC', price:199900, compareAt:249900, stock:12, category:'tecnologia',
    tags:['bt5.3','anc','usb-c'], img:'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop' },
  { id:'p2', name:'Smartwatch Deportivo IP68', price:299900, compareAt:0, stock:8, category:'relojeria',
    tags:['oxímetro','gps','notificaciones'], img:'https://images.unsplash.com/photo-1546864383-04ce211f77be?q=80&w=1000&auto=format&fit=crop' },
  { id:'p3', name:'Power Bank 20,000 mAh', price:149900, compareAt:189900, stock:20, category:'accesorios',
    tags:['pd-20w','usb-c','led'], img:'https://images.unsplash.com/photo-1609599006353-8c8c5d88dc83?q=80&w=1000&auto=format&fit=crop' },
  { id:'p4', name:'Teclado Mecánico RGB', price:259900, compareAt:329900, stock:5, category:'tecnologia',
    tags:['switch-red','rgb','hotswap'], img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop' },
  { id:'p5', name:'Reloj Clásico Acero Inox', price:349900, compareAt:0, stock:6, category:'relojeria',
    tags:['cuarzo','acero','resistente'], img:'https://images.unsplash.com/photo-1518544801976-3e5b66aab2d3?q=80&w=1000&auto=format&fit=crop' },
  { id:'p6', name:'Cargador Rápido 30W', price:89900, compareAt:109900, stock:0, category:'accesorios',
    tags:['pd','qc','usb-c'], img:'https://images.unsplash.com/photo-1609599006355-781a8e88dc83?q=80&w=1000&auto=format&fit=crop' }
];

// Estado
let state = {
  query: '',
  category: 'todos',
  sort: 'relevancia',
  cart: loadCart()
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('wa-link').href = `${WA_BASE}/${PHONE_INTL}`;
  bindMenu();
  bindFilters();
  bindCategoriesTiles();
  bindCartUI();
  renderGrid();
  updateCartBadge();
});

// Menú móvil
function bindMenu(){
  document.getElementById('hamburger')?.addEventListener('click', () => {
    const menu = document.getElementById('menu');
    const visible = getComputedStyle(menu).display !== 'none';
    menu.style.display = visible ? 'none' : 'flex';
  });
}

// Filtros y búsqueda
function bindFilters(){
  document.getElementById('search').addEventListener('input', (e)=>{
    state.query = e.target.value.trim().toLowerCase();
    renderGrid();
  });
  document.getElementById('category').addEventListener('change', (e)=>{
    state.category = e.target.value;
    renderGrid();
  });
  document.getElementById('sort').addEventListener('change', (e)=>{
    state.sort = e.target.value;
    renderGrid();
  });
}

// Tiles categorías
function bindCategoriesTiles(){
  $$('#categorias .tile').forEach(t=>{
    t.addEventListener('click', ()=>{
      document.getElementById('category').value = t.dataset.cat;
      state.category = t.dataset.cat;
      document.location.hash = '#catalogo';
      renderGrid();
    });
  });
}

// Render del catálogo
function renderGrid(){
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  let items = PRODUCTS.slice();

  // Filtrar
  if(state.category !== 'todos') items = items.filter(p => p.category === state.category);
  if(state.query) items = items.filter(p => (p.name + ' ' + p.tags.join(' ')).toLowerCase().includes(state.query));

  // Ordenar
  switch(state.sort){
    case 'precio-asc': items.sort((a,b)=>a.price-b.price); break;
    case 'precio-desc': items.sort((a,b)=>b.price-a.price); break;
    case 'nombre-asc': items.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case 'nombre-desc': items.sort((a,b)=>b.name.localeCompare(a.name)); break;
    default: break; // relevancia => sin cambios
  }

  grid.innerHTML = '';
  if(items.length === 0){
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  for(const p of items){
    grid.appendChild(productCard(p));
  }
}

function productCard(p){
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <h3>${p.name}</h3>
    <div class="badges">
      ${p.tags.map(t=>`<span class="badge-sm">${t}</span>`).join('')}
    </div>
    <div>
      <span class="price">${fmtCOP.format(p.price)}</span>
      ${p.compareAt > 0 ? `<span class="old">${fmtCOP.format(p.compareAt)}</span>` : ''}
    </div>
    <div class="${p.stock>0?'stock':'out'}">${p.stock>0? 'En stock':'Agotado'}</div>
    <div class="actions">
      <div class="qty">
        <button class="minus" aria-label="Disminuir">−</button>
        <span class="qval">1</span>
        <button class="plus" aria-label="Aumentar">+</button>
      </div>
      <button class="btn btn-primary add" ${p.stock<=0?'disabled':''}>Agregar</button>
    </div>
  `;

  const qval = el.querySelector('.qval');
  el.querySelector('.minus').addEventListener('click', ()=>{ qval.textContent = Math.max(1, (+qval.textContent)-1); });
  el.querySelector('.plus').addEventListener('click', ()=>{ qval.textContent = Math.min(99, (+qval.textContent)+1); });
  el.querySelector('.add').addEventListener('click', ()=>{
    addToCart(p.id, +qval.textContent);
  });

  return el;
}

/* ------------------ CARRITO ------------------ */
function bindCartUI(){
  document.getElementById('btn-cart').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  document.getElementById('backdrop').addEventListener('click', closeCart);
  document.getElementById('cart-clear').addEventListener('click', clearCart);
  updateCartUI();
}

function openCart(){
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('backdrop').hidden = false;
  document.getElementById('cart-drawer').setAttribute('aria-hidden','false');
}
function closeCart(){
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('backdrop').hidden = true;
  document.getElementById('cart-drawer').setAttribute('aria-hidden','true');
}

function loadCart(){
  try { return JSON.parse(localStorage.getItem('cart')||'{}'); } catch { return {}; }
}
function saveCart(){
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartBadge();
  updateCartUI();
}

function addToCart(id, qty){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const current = state.cart[id]?.qty || 0;
  const newQty = Math.min((p.stock||0), current + qty);
  state.cart[id] = { id, qty: newQty };
  saveCart();
  openCart();
}

function removeFromCart(id){
  delete state.cart[id];
  saveCart();
}
function updateQty(id, qty){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  state.cart[id].qty = Math.max(1, Math.min(p.stock, qty));
  saveCart();
}
function clearCart(){
  state.cart = {};
  saveCart();
}

function cartItemsDetailed(){
  return Object.values(state.cart).map(ci=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    return { ...ci, ...p, line: (p.price * ci.qty) };
  });
}

function updateCartBadge(){
  const totalUnits = Object.values(state.cart).reduce((a,c)=>a+c.qty,0);
  document.getElementById('cart-count').textContent = totalUnits;
}

function updateCartUI(){
  const items = cartItemsDetailed();
  const cont = document.getElementById('cart-items');
  cont.innerHTML = '';

  if(items.length===0){
    cont.innerHTML = `<p class="muted">Tu carrito está vacío.</p>`;
  } else {
    for(const it of items){
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${it.img}" alt="${it.name}">
        <div>
          <h4>${it.name}</h4>
          <div class="muted">${fmtCOP.format(it.price)} x ${it.qty}</div>
        </div>
        <div style="display:flex; gap:6px; align-items:center">
          <button class="icon-btn minus">−</button>
          <span>${it.qty}</span>
          <button class="icon-btn plus">+</button>
          <button class="icon-btn" title="Quitar">🗑️</button>
        </div>
      `;
      const [minus, qtySpan, plus, trash] = row.querySelectorAll('button, span');
      minus.addEventListener('click', ()=> updateQty(it.id, it.qty-1));
      plus.addEventListener('click', ()=> updateQty(it.id, it.qty+1));
      trash.addEventListener('click', ()=> removeFromCart(it.id));
      cont.appendChild(row);
    }
  }

  // Subtotal
  const subtotal = items.reduce((a,i)=>a+i.line,0);
  document.getElementById('cart-subtotal').textContent = fmtCOP.format(subtotal);

  // Checkout por WhatsApp
  const msg = encodeURIComponent(composeOrderMessage(items, subtotal));
  document.getElementById('cart-checkout').href = `${WA_BASE}/${PHONE_INTL}?text=${msg}`;
}

function composeOrderMessage(items, subtotal){
  if(items.length===0) return `Hola, me interesa hacer un pedido en ${BRAND}.`;
  const lines = items.map(i=>`• ${i.name} x${i.qty} — ${fmtCOP.format(i.line)}`);
  return `Hola, quiero finalizar mi compra en ${BRAND}:

${lines.join('
')}

Subtotal: ${fmtCOP.format(subtotal)}

Nombre y ciudad:`;
}

/* ------------------ FORM CONTACTO (demo) ------------------ */
document.getElementById('contact-form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const status = document.getElementById('form-status');
  status.textContent = 'Enviando...';
  setTimeout(()=>{
    status.textContent = '¡Gracias! Te responderemos pronto.';
    e.target.reset();
  }, 900);
});
