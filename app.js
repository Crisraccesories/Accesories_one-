
// app.js — catálago básico en index.html

const seccionProductos = document.querySelector("#productos");
const btnCTA = document.querySelector("#ífonos TWS I12", precio: 30000, img: "https://picsum.photos/seed/i12/600/500" },const btnCTA = document.querySelector("#ctaVerProductos");
  { id: 2, nombre: "AirDots Pro", precio: 45000, img: "https://picsum.photos/seed/airdots/600/500" },
  { id: 3, nombre: "Smart Band 7", precio: 35000, img: "https://picsum.photos/seed/band7/600/500" },
  { id: 4, nombre: "Reloj X22 Pro Max", precio: 110000, img: "https://picsum.photos/seed/x22/600/500" },
  { id: 5, nombre: "Parlante GO3", precio: 35000, img: "https://picsum.photos/seed/go3/600/500" },
  { id: 6, nombre: "Cargador 20W", precio: 50000, img: "https://picsum.photos/seed/20w/600/500" },
];

function COP(v){ return new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(v); }

function renderProductos() {
  if (!seccionProductos) return;
  seccionProductos.innerHTML = productos.map(p => `
    <article class="card">
      <img src="${p.img}" altnombre}</h3>
      <p class="price">${COP(p.precio)}</p>
      <a class="btn" href="tecnologia.html"cle>
  `).join("");
}

btnCTA?.addEventListener("click", () => {
  document.querySelector("#productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

renderProductos();
const spanAnio = document.querySelector("#anio");
if (spanAnio) spanAnio.textContent = new Date().getFullYear();

const productos = [

