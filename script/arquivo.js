// mostar

function mostrarTela(telaId) {

    const telas = ["s1", "bimestres"];

    telas.forEach(id => {

        const el = document.getElementById(id);

        if (el) {
            el.classList.add("hidden");
        }

    });

    const tela = document.getElementById(telaId);

    if (tela) {
        tela.classList.remove("hidden");
    }

    let titulo = document.getElementById("escolhaHH");

    if (titulo) {

        if (telaId === "bimestre") {
            titulo.innerHTML = "Escolha o bimestre";
        }

        if (telaId === "s1") {
            titulo.innerHTML = "Escolha a série que deseja";
        }

    }
}