
// Menú móvil
const btnMenu = document.getElementById('btnMenu');
const menuMovil = document.getElementById('menuMovil');
if (btnMenu && menuMovil) btnMenu.addEventListener('click', ()=> menuMovil.classList.toggle('hidden'));

// Año dinámico
const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

// Tema (dark/light) con localStorage
const btnTheme = document.getElementById('btnTheme');
const root = document.documentElement;
function applyTheme(theme){
  if(theme==='dark'){ root.classList.add('dark'); if(btnTheme) btnTheme.textContent='☀️'; }
  else{ root.classList.remove('dark'); if(btnTheme) btnTheme.textContent='🌙'; }
}
const saved = localStorage.getItem('theme');
applyTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'));
if(btnTheme){ btnTheme.addEventListener('click', ()=>{
  const isDark = root.classList.contains('dark');
  const next = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', next); applyTheme(next);
}); }

// Botón flotante WhatsApp
const whatsFloat = document.getElementById('whatsFloat');
if (whatsFloat){
  whatsFloat.addEventListener('click', ()=>{
    const url = 'https://wa.me/57XXXXXXXXXX?text=' + encodeURIComponent('Hola, vengo del sitio de Ancol One. Necesito ayuda.');
    window.open(url, '_blank');
  });
}

// Form feedback
const form = document.getElementById('formContacto');
const estado = document.getElementById('estadoForm');
if (form && estado){
  form.addEventListener('submit', ()=>{
    estado.textContent = 'Enviando…';
    estado.className = 'mt-3 text-sm text-ink-600';
  });
}
