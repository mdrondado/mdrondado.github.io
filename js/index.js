console.log('Olá mundo, JavaScript!');

function alteraBotao () {
  document.getElementById('curriculo').textContent = 'Curriculum';
}


function alterarPagina(paginaAberta){
  if (paginaAberta == 'curriculo') {
    document.getElementById('tituloprofissi').textContent = 'Logistics, Transportation and Technology Professional';
  }
}
