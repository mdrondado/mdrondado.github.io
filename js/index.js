// Carrega o player do YouTube somente quando o visitante clica no play.
// Antes disso a pagina mostra apenas a miniatura (~13 KB por video, contra
// cerca de 1 MB do player).
const miniaturas = new Map(); // player -> botao que ele substituiu

document.addEventListener("click", function (evento) {
  const botao = evento.target.closest(".video-facade");
  if (!botao) return;

  const player = document.createElement("iframe");
  player.width = 310;
  player.height = 180;
  player.src = "https://www.youtube-nocookie.com/embed/" + botao.dataset.videoId + "?autoplay=1";
  player.title = botao.dataset.videoTitle;
  player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  player.allowFullscreen = true;
  player.frameBorder = "0";

  miniaturas.set(player, botao);
  botao.replaceWith(player);
  player.focus();
});

// Filtro dos videos: o tema escolhido nos botoes (ou Todos) combinado com o
// texto da busca, que procura no titulo, no canal e no nome do tema.
const botoesTema = Array.from(document.querySelectorAll(".video-temas > button"));
const busca = document.getElementById("busca-videos");
const cards = Array.from(document.querySelectorAll("#lista-videos > .video-card"));
const contagem = document.getElementById("contagem-videos");
const vazio = document.getElementById("videos-vazio");
let temaAtual = "logistica"; // o tema que a pagina abre filtrada; o botao dele vem marcado no HTML

// minusculas e sem acento, para "logistica" achar "Logística"
const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function filtrar() {
  const termos = normalizar(busca.value).split(/\s+/).filter(Boolean);
  let visiveis = 0;
  for (const card of cards) {
    const texto = normalizar(card.querySelector(".video-caption").textContent);
    const aparece = (temaAtual === "todos" || card.dataset.tema === temaAtual)
      && termos.every((termo) => texto.includes(termo));
    card.hidden = !aparece;
    if (aparece) visiveis++;
    // um video tocando num card escondido continuaria com som: volta a miniatura
    const player = card.querySelector("iframe");
    if (!aparece && player) {
      player.replaceWith(miniaturas.get(player));
      miniaturas.delete(player);
    }
  }
  contagem.textContent = visiveis === 1 ? "1 vídeo" : visiveis + " vídeos";
  vazio.hidden = visiveis > 0;
}

for (const botao of botoesTema) {
  botao.addEventListener("click", () => {
    temaAtual = botao.dataset.tema;
    for (const outro of botoesTema) outro.setAttribute("aria-pressed", outro === botao);
    filtrar();
  });
}
busca.addEventListener("input", filtrar);
filtrar();
