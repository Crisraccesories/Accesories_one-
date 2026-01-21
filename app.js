// app.js — index.html consume products.json

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#productos");
  const spanAnio = document.querySelector("#anio");

  if (spanAnio) spanAnio.textContent = new Date().getFullYear();
  if (!grid) {
    console.warn('No se encontró el contenedor "#productos" en el DOM.');
    return;
  }

  const COP = (v) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(v) || 0);

  const isTec = (c) =>
    !["BELLEZA", "USO PERSONAL", "TERMO", "SOMBRILLA"].some((n) =>
      String(c || "").toUpperCase().includes(n)
    );

  const escapeHTML = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  async function loadIndex() {
    try {
      const r = await fetch("./products.json", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status} al cargar products.json`);

      const all = await r.json();
      if (!Array.isArray(all)) throw new Error("El JSON no es un array.");

      const items = all.filter((p) => isTec(p?.categoria)).slice(0, 8);

      if (items.length === 0) {
        grid.innerHTML = '<p>No hay productos para mostrar.</p>';
        return;
      }

      grid.innerHTML = items
        .map((p) => {
          const nombre = escapeHTML(p?.nombre ?? "Producto");
          const categoria = escapeHTML(p?.categoria ?? "");
          const precio = COP(p?.precio);

          const detalleHref =
            typeof p?.url === "string" && p.url.trim()
              ? p.url
              : "tecnologia.html";

          let imgHtml = "";
          if (typeof p?.img === "string" && p.img.trim()) {
            if (/^</.test(p.img.trim())) {
              imgHtml = p.img; // ya viene como <img ...>
            } else {
              const imgUrl = escapeHTML(p.img);
              imgHtml = `${imgUrl}`;
            }
          } else {
            imgHtml =
              '<div class="img placeholder" aria-hidden="true">Sin imagen</div>';
          }

          return `
            <article class="card">
              ${detalleHref}
                ${imgHtml}
              </a>
              <h3 class="title">${nombre}</h3>
              <p class="category">${categoria}</p>
              <p class="price">${precio}</p>
              <p class="actions">
                ${detalleHref}Ver más</a>
              </p>
            </article>
          `;
        })
        .join("");
    } catch (e) {
      console.error("Error cargando catálogo:", e);
      grid.innerHTML = '<p>Error cargando el catálogo. Intenta más tarde.</p>';
    }
  }

  loadIndex();
});
