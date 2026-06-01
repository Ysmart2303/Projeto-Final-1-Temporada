function voltar(index) {

    const paginas = {
        home: "/html/index.html",
        creditos: "/html/creditos.html",
        login: "/html/login.html",

        esSeDS: "/html/escoSeries/escolhaSerieDS.html",
        esSeLog: "/html/escoSeries/escolhaSerieLog.html",
        esSeQm: "/html/escoSeries/escolhaSerieQm.html",
        esSeSec: "/html/escoSeries/escolhaSerieSec.html",
        esSeTex: "/html/escoSeries/escolhaSerieTex.html",

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

    const telas = ["s1", "s2", "bimestre", "bimestre2", "bimestre3"];

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

    let titulo = document.getElementById("escolhaBB");
    let titulo2 = document.getElementById("escolhaHH");

    if (titulo && titulo2) {

        if (
        telaId === "bimestre" ||
        telaId === "bimestre2" ||
        telaId === "bimestre3"
        ) 
        { titulo2.innerHTML = "Escolha o bimestre"; }
        
        if (telaId === "s1") {

            titulo.innerHTML = "";
            titulo2.innerHTML = "";
            
        } else if (telaId === "s2") {
            
            titulo2.innerHTML = "Escolha a série que deseja";
            // titulo.style.classList.add("hidden");
        }

    }
}

function falarnome() {
    alert("Sistema integrado de Gestão Adêmica");
}