# VCOM — Landing Page

Landing page institucional da VCOM Marketing Inteligente.

Site estático (HTML, CSS e JavaScript puro), sem dependências nem etapa de build.

## Estrutura

- `index.html` — conteúdo da página
- `css/styles.css` — estilos e paleta de cores
- `js/main.js` — menu mobile, carrossel do portfólio e animações de entrada
- `assets/` — imagens do portfólio (WebP + JPEG em 800px e 1400px) e favicon

## Ver localmente

Abra o `index.html` no navegador, ou rode um servidor simples:

```sh
python3 -m http.server 8000
```

e acesse http://localhost:8000.

## Publicar

Por ser estático, funciona em qualquer hospedagem: GitHub Pages (Settings → Pages → branch `main`, pasta `/`), Netlify, Vercel ou Cloudflare Pages, sem configuração extra.
