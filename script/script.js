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
            // titulo.style.marginBottom = "20%";
            
        } else if (telaId === "bimestre2") {
            titulo.innerHTML = "Escolha o bimestre";
            // titulo.style.marginBottom = "200px";
            
        } else if (telaId === "bimestre3") {
            titulo.innerHTML = "Escolha o bimestre";
            // titulo.style.marginBottom = "200px";
        }
        
        if (telaId === "s1") {
            titulo.innerHTML = "Escolha a série que deseja";
            titulo.style.marginBottom = "0px";
        }

    }
}

function falarnome() {
    alert("Sistema integrado de Gestão Adêmica");
}