// mostar

function mostrarTela(telaId) {
  const telas = ["s1", "s2"];

  telas.forEach(id => {
    const el = document.getElementById(id);
    el.classList.add("hidden"); // esconde todas
  });

  document.getElementById(telaId).classList.remove("hidden"); // mostra só uma
}