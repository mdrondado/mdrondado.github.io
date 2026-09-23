// Carrega o player do YouTube somente quando o visitante clica no play.
// Antes disso a pagina mostra apenas a miniatura (~13 KB por video, contra
// cerca de 1 MB do player).
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

  botao.replaceWith(player);
  player.focus();
});
