# mdrondado.github.io

Site pessoal de Maikom Rondado, publicado pelo GitHub Pages em
https://mdrondado.github.io/. É HTML, CSS e JavaScript puros, sem etapa de build.

A área restrita não fica aqui: é um Cloudflare Worker em outro repositório
(https://privado.mdrondado.workers.dev/entrar). `acesso.html` só redireciona
para lá quem ainda tiver o endereço antigo.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Página inicial: postagens e vídeos com filtro por tema |
| `curriculo.html` | Currículo |
| `cinfo.html` | Currículo em infográfico (embutido de um site no Netlify) |
| `entopics.html`, `mmetro.html`, `ottd.html`, `factorio.html` | Postagens |
| `css/styles.css` | Estilos de todas as páginas |
| `js/index.js` | Player do YouTube carregado só no clique e filtro dos vídeos |
| `images/og/` | Imagens de compartilhamento (1200×630), uma por página |
| `_partes/` | Modelos do cabeçalho, contatos e rodapé |
| `_ferramentas/montar.mjs` | Copia os modelos de `_partes/` para as páginas |

As pastas que começam com `_` não são publicadas.

## Cabeçalho, contatos e rodapé

Essas partes se repetem em todas as páginas e são editadas só em `_partes/`.
Cada página marca onde a parte entra:

```html
<!-- parte:rodape -->
...reescrito pelo script...
<!-- /parte:rodape -->
```

Depois de mudar um modelo (ou o menu, definido em `_ferramentas/montar.mjs`):

```sh
node _ferramentas/montar.mjs             # reescreve as páginas
node _ferramentas/montar.mjs --conferir  # só avisa quais estão desatualizadas
```

## Nova página

1. Copie uma postagem existente (por exemplo `ottd.html`) e troque o conteúdo,
   o `<title>`, a `description`, o `canonical` e as tags `og:`.
2. Crie a imagem de compartilhamento em `images/og/`.
3. Rode `node _ferramentas/montar.mjs` e adicione o card em `index.html`.
