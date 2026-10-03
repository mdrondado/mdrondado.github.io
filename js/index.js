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

// Abas dos videos (Logistica, Dados, IA), no padrao de abas do WAI-ARIA:
// clique ou setas esquerda/direita, Home e End.
const abas = Array.from(document.querySelectorAll('.video-abas [role="tab"]'));

function mostrarAba(escolhida) {
  for (const aba of abas) {
    const ativa = aba === escolhida;
    const painel = document.getElementById(aba.getAttribute("aria-controls"));
    aba.setAttribute("aria-selected", ativa);
    aba.tabIndex = ativa ? 0 : -1;
    painel.hidden = !ativa;
    // um video tocando numa aba escondida continuaria com som: volta a miniatura
    if (!ativa) {
      for (const player of painel.querySelectorAll("iframe")) {
        player.replaceWith(miniaturas.get(player));
        miniaturas.delete(player);
      }
    }
  }
}

for (const aba of abas) {
  aba.addEventListener("click", () => mostrarAba(aba));
  aba.addEventListener("keydown", (evento) => {
    const atual = abas.indexOf(aba);
    const destino = {
      ArrowRight: abas[(atual + 1) % abas.length],
      ArrowLeft: abas[(atual - 1 + abas.length) % abas.length],
      Home: abas[0],
      End: abas[abas.length - 1],
    }[evento.key];
    if (!destino) return;
    evento.preventDefault();
    destino.focus();
    mostrarAba(destino);
  });
}
