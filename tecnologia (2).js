
const grid=document.querySelector('#gridTec');
const q=document.querySelector('#q');
const selCat=document.querySelector('#cat');
const selOrden=document.querySelector('#orden');
document.querySelector('#anio').textContent=new Date().getFullYear();
let DATA=[]; let CATS=new Set();
function COP(v){return new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(v);}
function isTec(c){return !['BELLEZA','USO PERSONAL','TERMO','SOMBRILLA'].some(n=> (c||'').toUpperCase().includes(n));}
async function load(){try{const r=await fetch('./products.json',{cache:'no-store'});const all=await r.json();DATA=all.filter(p=>isTec(p.categoria));DATA.forEach(p=>CATS.add(p.categoria));renderCats();render();}catch(e){grid.innerHTML='<p>Error cargando catálogo.</p>';}}
function renderCats(){selCat.innerHTML=['<option value="">Todas</option>'].concat([...CATS].sort().map(c=>`<option>${c}</option>`)).join('');}
function norm(t){return (t||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();}
function render(){const qq=norm(q.value);const cat=selCat.value;let items=DATA.filter(p=>(!qq||norm(p.nombre).includes(qq))&&(!cat||p.categoria===cat));
switch(selOrden.value){case'precio_asc':items.sort((a,b)=>a.precio-b.precio);break;case'precio_desc':items.sort((a,b)=>b.precio-a.precio);break;case'nombre_asc':items.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));}
if(!items.length){grid.innerHTML='<p>Sin resultados.</p>';return;}
grid.innerHTML=items.map(p=>{const wa=`https://wa.me/57XXXXXXXXXX?text=${encodeURIComponent('Hola, me interesa '+p.nombre+' ('+COP(p.precio)+')')}`;return `<article class="card"><img src="${p.img}" alt="${p.nombre}" loading="lazy"><h3>${p.nombre}</h3><p class="price">${COP(p.precio)}</p><span class="chip">${p.categoria}</span><div class="row"><a class="btn" href="${wa}" target="_blank">Comprar por WhatsApp</a></div></article>`}).join('');}
[q,selCat,selOrden].forEach(el=>el&&el.addEventListener('input',render));
load();
