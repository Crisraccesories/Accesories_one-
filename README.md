# Ancol One

Sitio estático moderno para **Accesorios y Tecnología — Ancol One** (HTML + Tailwind CDN + JS), con varias páginas, SEO on‑page, modo oscuro, catálogo básico y contacto.

## Páginas
- `/index.html` — Home
- `/productos.html` — Catálogo con filtros, buscador y CTA a WhatsApp
- `/servicios.html` — Servicios técnicos y planes
- `/nosotros.html` — Misión, visión, valores
- `/faq.html` — Preguntas frecuentes
- `/blog.html` — Noticias y tips (placeholder)
- `/contacto.html` — Formulario (Formspree) y WhatsApp
- `/politicas.html` — Privacidad y términos
- `/sitemap.xml` y `/robots.txt` — SEO técnico básico

## Configuración rápida
1. Reemplaza el número de WhatsApp en `js/main.js` y en los CTAs (`57XXXXXXXXXX`).
2. Crea un endpoint en Formspree y sustituye `action` en `contacto.html`.
3. Ajusta metadatos SEO en `<head>` (título, descripción y Open Graph).
4. Sube a **GitHub Pages**: Settings → Pages → Branch `main` → Folder `/`.

## SEO
Incluye metadatos, JSON‑LD (Organization/WebSite) y `sitemap.xml` + `robots.txt`. Actualiza el dominio en ambos.

## Licencia
Uso libre. Sin garantías.
