// catalogo.js — render para impresión (muestra TODOS los productos)

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#productos');
  const spanAnio = document.querySelector('#anio');
  if (spanAnio) spanAnio.textContent = new Date().getFullYear();

  const COP = (v) => new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', maximumFractionDigits:0 }).format(Number(v)||0);

  const escapeHTML = (s) => String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  async function loadAll(){
    try{
      const r = await fetch('./products.json', { cache:'no-store' });
      if(!r.ok) throw new Error('HTTP '+r.status);
      const all = await r.json();
      if(!Array.isArray(all)) throw new Error('JSON inválido');

      grid.innerHTML = all.map(p => {
        const nombre = escapeHTML(p?.nombre ?? 'Producto');
        const categoria = escapeHTML(p?.categoria ?? '');
        const precio = COP(p?.precio);
        let imgHtml = '';
        if (typeof p?.img === 'string' && p.img.trim()) {
          if (/^</.test(p.img.trim())) imgHtml = p.img; else imgHtml = `<img src="${escapeHTML(p.img)}" alt="${nombre}">`;
        } else {
          imgHtml = '<div class="img placeholder" aria-hidden="true">Sin imagen</div>';
        }
        return `
          <article class="card">
            <div class="thumb">${imgHtml}</div>
            <h3 class="title">${nombre}</h3>
            <p class="category">${categoria}</p>
            <p class="price">${precio}</p>
          </article>
        `;
      }).join('');

    }catch(e){
      console.error(e);
      grid.innerHTML = '<p>Error cargando el catálogo.</p>';
    }
  }

  loadAll();
});
