// Monta as partes repetidas das páginas (cabeçalho, contatos e rodapé) a partir
// dos modelos em _partes/. Cada página marca onde a parte entra:
//
//    <!-- parte:rodape -->
//    ...o script reescreve tudo o que estiver aqui...
//    <!-- /parte:rodape -->
//
// Uso:
//    node _ferramentas/montar.mjs             reescreve as páginas
//    node _ferramentas/montar.mjs --conferir  só avisa quais estão desatualizadas
//
// As pastas que começam com "_" não são publicadas pelo GitHub Pages.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

const menu = [
  { href: "index.html", texto: "Home" },
  { href: "curriculo.html", texto: "Currículo" },
  { href: "https://privado.mdrondado.workers.dev/entrar", texto: "Área restrita" },
];

// Páginas cujo cabeçalho tem a animação de entrada.
const paginasComAbertura = ["index.html"];

function montarMenu(pagina) {
  return menu
    .map(({ href, texto }) =>
      href === pagina
        ? `<a class="selected" href="${href}" aria-current="page">${texto}</a>`
        : `<a class="not-selected" href="${href}">${texto}</a>`
    )
    .join("\n");
}

function valoresDaPagina(pagina) {
  return {
    classe: paginasComAbertura.includes(pagina) ? "container-header hero-header" : "container-header",
    menu: montarMenu(pagina),
  };
}

// Troca {{nome}} pelo valor. Um valor de várias linhas recebe, em cada linha,
// o mesmo recuo que o {{nome}} tinha no modelo.
function preencher(modelo, valores) {
  return modelo.replace(/^([ \t]*)(.*?)\{\{(\w+)\}\}/gm, (trecho, recuo, antes, nome) => {
    if (!(nome in valores)) throw new Error(`modelo usa {{${nome}}}, que não tem valor`);
    return recuo + antes + valores[nome].split("\n").join("\n" + recuo);
  });
}

function lerModelo(nome) {
  return readFileSync(join(raiz, "_partes", nome + ".html"), "utf8").replace(/\r\n/g, "\n").trimEnd();
}

function montarPagina(pagina, texto) {
  const valores = valoresDaPagina(pagina);
  const marca = /^([ \t]*)<!-- parte:(\w+) -->\n[\s\S]*?^[ \t]*<!-- \/parte:\2 -->/gm;
  return texto.replace(marca, (trecho, recuo, nome) => {
    const corpo = preencher(lerModelo(nome), valores)
      .split("\n")
      .map((linha) => (linha ? recuo + linha : linha))
      .join("\n");
    return `${recuo}<!-- parte:${nome} -->\n${corpo}\n${recuo}<!-- /parte:${nome} -->`;
  });
}

const conferir = process.argv.includes("--conferir");
const desatualizadas = [];

for (const pagina of readdirSync(raiz).filter((nome) => nome.endsWith(".html"))) {
  const caminho = join(raiz, pagina);
  const atual = readFileSync(caminho, "utf8");
  // O Git no Windows pode entregar as páginas com CRLF: monta com LF e devolve
  // no formato em que estavam.
  const crlf = atual.includes("\r\n");
  let montada = montarPagina(pagina, atual.replace(/\r\n/g, "\n"));
  if (crlf) montada = montada.replace(/\n/g, "\r\n");
  if (montada === atual) continue;
  desatualizadas.push(pagina);
  if (!conferir) writeFileSync(caminho, montada);
}

if (conferir && desatualizadas.length) {
  console.error("Páginas desatualizadas: " + desatualizadas.join(", "));
  console.error("Rode: node _ferramentas/montar.mjs");
  process.exit(1);
}
console.log(desatualizadas.length ? "Atualizadas: " + desatualizadas.join(", ") : "Todas as páginas estão em dia.");
