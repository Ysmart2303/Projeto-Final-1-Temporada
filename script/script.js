const botaoBase = document.getElementById("btn-login");

function voltar(index) {

    const paginas = {
        home: "/html/index.html",
        creditos: "/html/creditos.html",
        login: "/html/login.html",

        esSeDS: "/html/escoSeries/escolhaSerieDS.html",

        conDS: "/html/conteudos/conDS.html",
        conQm: "/html/conteudos/conQm.html",
        conSec: "/html/conteudos/conSec.html",
        conLogi: "/html/conteudos/coLogi.html",
        conTex: "/html/conteudos/conTex.html"
    };

    window.location.href = paginas[index];
}

// function mostarTela (bimestres) 
// Base de tudo

function mostrarTela(telaId) {

    const telas = ["s1", "s2", "bimestre", "bimestre2", "bimestre3", "ConEAtiv"];

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
    let Subtitulo = document.getElementById("escolhaBB");

    if (telaId === "s1") {

        titulo.innerHTML = "Bem-vindo";
        Subtitulo.innerHTML = "Escolha o curso que deseja";

        botaoBase.textContent = "Login";
        botaoBase.onclick = () => voltar("login");

    } else if (telaId === "s2") {

        titulo.innerHTML = "Escolha a série que deseja";
        Subtitulo.innerHTML = "";


        botaoBase.textContent = "Voltar";
        botaoBase.onclick = () => mostrarTela("s1");
    }
}

// Falar o nome ao clicar no titulo

function falarnome() {
    alert("Sistema integrado de Gestão Adêmica");
}