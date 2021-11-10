console.log('Olá mundo, JavaScript!');

function alteraBotao () {
  document.getElementById('curriculo').textContent = 'Curriculum';
}


function alterarPagina(paginaAberta){
  if (paginaAberta == 'curriculo') {
    document.getElementById('tituloprofissi').textContent = 'Logistics, Transportation and Technology Professional';
  }
}

const nome = 'Gama Academy' ; 
console . log ( nome . padStart ( 13 ) ) ; 
console . log ( nome . padStart ( 2 ) ) ;