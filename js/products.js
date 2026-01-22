
const DATA = [
  { id:'p1', name:'Audífonos Bluetooth ANC', price:229900, cat:'audio', img:'assets/images/prod-audio1.svg' },
  { id:'p2', name:'Parlante Portátil IPX7', price:189900, cat:'audio', img:'assets/images/prod-audio2.svg' },
  { id:'p3', name:'Mouse Gamer 7200 DPI', price:129900, cat:'gaming', img:'assets/images/prod-gaming1.svg' },
  { id:'p4', name:'Teclado Mecánico RGB', price:239900, cat:'gaming', img:'assets/images/prod-gaming2.svg' },
  { id:'p5', name:'Router Wi‑Fi 6 Dual Band', price:289900, cat:'redes', img:'assets/images/prod-red1.svg' },
  { id:'p6', name:'Extensor de Red Mesh', price:219900, cat:'redes', img:'assets/images/prod-red2.svg' },
  { id:'p7', name:'Cargador Rápido 30W', price:79900,  cat:'accesorios', img:'assets/images/prod-acc1.svg' },
  { id:'p8', name:'Cable USB‑C Trenzado', price:39900,  cat:'accesorios', img:'assets/images/prod-acc2.svg' }
];

function currency(v){ return new Intl.NumberFormat('es-CO', {style:'currency',currency:'COP', maximumFractionDigits:0}).format(v); }

function card(p){
  const msg = encodeURIComponent(`Hola, quiero el producto ${p.name} (${p.id}).`);
  return `
  <article class="card" data-cat="${p.cat}">
    <img src="${p.img}" alt="${p.name}" class="w-full aspect-[4/3] object-cover rounded-lg border border-ink-200 dark:border-ink-700"/>
    <h3 class="mt-3 font-semibold">${p.name}</h3>
    <p class="text-sm text-ink-500">${p.cat.toUpperCase()}</p>
    <p class="mt-1 text-lg font-bold">${currency(p.price)}</p>
    <div class="mt-3 flex gap-2">
      <a class="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-white text-sm hover:bg-brand-700" href="https://wa.me/57XXXXXXXXXX?text=${msg}" target="_blank" rel="noopener">Pedir por WhatsApp</a>
      <button class="inline-flex items-center justify-center rounded-lg border border-ink-300 dark:border-ink-700 px-4 py-2 text-sm hover:bg-ink-50 dark:hover:bg-ink-800" onclick="copyRef('${p.id}')">Copiar ref.</button>
    </div>
  </article>`;
}

function render(list){
  const grid = document.getElementById('gridProductos');
  if (!grid) return;
  grid.innerHTML = list.map(card).join('');
}

function filter(cat){
  if (cat==='all') return render(DATA);
  render(DATA.filter(p=>p.cat===cat));
}

function search(q){
  const s = (q||'').toLowerCase();
  const list = DATA.filter(p => p.name.toLowerCase().includes(s));
  render(list);
}

function copyRef(id){
  navigator.clipboard.writeText(id).then(()=> alert('Referencia copiada: '+id));
}

// Home destacados
(function(){
  const home = document.getElementById('destacados');
  if(home){ home.innerHTML = DATA.slice(0,4).map(card).join(''); }
})();

// Página productos
window.addEventListener('DOMContentLoaded', ()=>{
  const grid = document.getElementById('gridProductos');
  if(!grid) return;
  render(DATA);
  // Filtros
  document.querySelectorAll('.f-chip').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.f-chip').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      filter(b.dataset.filter);
    })
  });
  // Buscador
  const busc = document.getElementById('buscador');
  if (busc){ busc.addEventListener('input', ()=> search(busc.value)); }
});
