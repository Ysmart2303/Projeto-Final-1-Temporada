function voltar(index) {

    const paginas = {
        home: "/html/index.html",
        creditos: "/html/creditos.html",
        login: "/html/login.html",
        esSe: "/html/escolhaSerie.html",

        conDS: "/html/conteudos/conDS.html",
        conQm: "/html/conteudos/conQm.html",
        conSec: "/html/conteudos/conSec.html",
        conLogi: "/html/conteudos/coLogi.html",
        conTex: "/html/conteudos/conTex.html"
    };

    window.location.href = paginas[index];
}

// function mostarTela (bimestres)

function mostrarTela(telaId) {

    const telas = ["s1", "bimestre", "bimestre2", "bimestre3"];

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

        } else if (telaId === "bimestre2") {
            titulo.innerHTML = "Escolha o bimestre";

        } else if (telaId === "bimestre3") {
            titulo.innerHTML = "Escolha o bimestre";
        }

        if (telaId === "s1") {
            titulo.innerHTML = "Escolha a série que deseja";
        }

    }
}