
const whatsFloat = document.getElementById('whatsFloat');
if (whatsFloat){
  whatsFloat.addEventListener('click', ()=>{
    const url = 'https://wa.me/573133067667?text=' + encodeURIComponent('Hola, vengo del sitio de Ancol One. Necesito ayuda.');
    window.open(url, '_blank');
  });
}
