// app.js — index.html consume products.json (GitHub Pages seguro)

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#productos");
  const spanAnio = document.querySelector("#anio");

  if (spanAnio) spanAnio.textContent = new Date().getFullYear();
  if (!grid) {
    console.warn('No se encontró "#productos" en el DOM.');
    return;
  }

  // Formateador COP
  const COP = (v) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(v) || 0);

  // Excluye categorías no tech
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
      // Prefijo del repo en GitHub Pages (ruta ABSOLUTA)
      const BASE = "/Accesories_one-/";

      // Debug opcional
      console.log("APP iniciada en:", location.href);

      const r = await fetch(`${BASE}products.json`, { cache: "no-store" });
      console.log("Status JSON:", r.status);
      if (!r.ok) throw new Error(`HTTP ${r.status} al cargar products.json`);

      const all = await r.json();
      if (!Array.isArray(all)) throw new Error("El JSON no es un array.");

      const items = all.filter((p) => isTec(p?.categoria)).slice(0, 8);
      if (items.length === 0) {
        grid.innerHTML = "<p>No hay productos para mostrar.</p>";
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
              : `${BASE}catalogo.html`;

          let imgHtml = "";
          if (typeof p?.img === "string" && p.img.trim()) {
            if (/^</.test(p.img.trim())) {
              imgHtml = p.img; // ya viene como <img ...>
            } else {
              imgHtml = `<img src="${escapeHTML(p.img)}" alt="${nombre}" loading="lazy">`;
            }
          } else {
            imgHtml =
              '<div class="img placeholder" aria-hidden="true">Sin imagen</div>';
          }

          return `
            <article class="card">
              <a class="thumb" href="${detalleHref}" aria-label="Ver ${nombre}">
                ${imgHtml}
              </a>
              <h3 class="title">${nombre}</h3>
              <p class="category">${categoria}</p>
              <p class="price">${precio}</p>
              <p class="actions">
                <a class="btn primary" href="${detalleHref}">Ver más</a>
              </p>
            </article>
          `;
        })
        .join("");
    } catch (e) {
      console.error("Error cargando catálogo:", e);
      const msg =
        e?.message?.includes("HTTP 404")
          ? "Archivo products.json no encontrado."
          : "Error cargando el catálogo. Intenta más tarde.";
      grid.innerHTML = `<p>${msg}</p>`;
    }
  }

  loadIndex();
});
