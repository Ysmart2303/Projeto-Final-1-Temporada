console.log("Só Jesus na causa 1 aqui começa o script.js");

const botaoBase = document.getElementById("bnt-login");

// VARIÁVEIS GLOBAIS PARA RASTREAMENTO DE NAVEGAÇÃO
let cursoSelecionado = null;
let anoSelecionado = null;
let bimestreSelecionado = null;

// MAPEAMENTO DE CURSOS PARA SIGLA
const mapaCursos = {
    "ds": "DS",
    "qm": "Qm",
    "sec": "Sec",
    "log": "Logi",
    "tex": "Tex"
};

// FUNÇÃO PARA NAVEGAR PARA A PÁGINA DO BIMESTRE
function irParaBimestre(numeroBimestre) {
    if (!cursoSelecionado || !anoSelecionado) {
        alert("Erro: curso ou ano não selecionado.");
        return;
    }

    bimestreSelecionado = numeroBimestre;

    const paginaPorCurso = {
        ds: "conDS.html",
        qm: "conQm.html",
        sec: "conSec.html",
        log: "conLogi.html",
        tex: "conTex.html"
    };

    const arquivoCurso = paginaPorCurso[cursoSelecionado];
    if (arquivoCurso) {
        window.location.href = `/html/conteudos/${arquivoCurso}?curso=${cursoSelecionado}&ano=${anoSelecionado}&bimestre=${numeroBimestre}`;
    } else {
        alert("Página não configurada para esta combinação de curso, ano e bimestre.");
    }
}

function voltar(index) {

    const paginas = {
        home: "/html/index.html",
        creditos: "/html/creditos.html",
        login: "/html/login.html",
        esSe: "/html/index.html",
        esSeDS: "/html/index.html",

        conDS: "/html/conteudos/conDS.html",
        conQm: "/html/conteudos/conQm.html",
        conSec: "/html/conteudos/conSec.html",
        conLogi: "/html/conteudos/conLogi.html",
        conTex: "/html/conteudos/conTex.html"
    };

    if (paginas[index]) {
        window.location.href = paginas[index];
    } else {
        history.back();
    }
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
    } else if (telaId === "ConEAtiv") {

        titulo.innerHTML = "Conteúdos";

    } else if (telaId === "bimestre" || telaId === "bimestre2" || telaId === "bimestre3") {

        titulo.innerHTML = "Escolha o bimestre";
        Subtitulo.innerHTML = `${cursoSelecionado?.toUpperCase()} - ${anoSelecionado}º Ano`;

        botaoBase.textContent = "Voltar";
        botaoBase.onclick = () => mostrarTela("s2");
    }
}

// RASTREAR CURSO SELECIONADO - Adicione esta função
function selecionarCurso(nomeCurso) {
    cursoSelecionado = nomeCurso.toLowerCase();
    mostrarTela("s2");
}

// RASTREAR ANO SELECIONADO - Adicione esta função
function selecionarAno(numeroAno) {
    anoSelecionado = numeroAno;
    
    // Mostrar a seção de bimestres correspondente
    if (numeroAno === 1) {
        mostrarTela("bimestre");
    } else if (numeroAno === 2) {
        mostrarTela("bimestre2");
    } else if (numeroAno === 3) {
        mostrarTela("bimestre3");
    }
}

// Falar o nome ao clicar no titulo

function falarnome() {
    alert("Sistema integrado de Gestão Adêmica");
}

window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const curso = params.get("curso");
    const ano = params.get("ano");
    const bimestre = params.get("bimestre");

    if (curso && ano && bimestre) {
        const targetAnoId = `${ano}ano`;
        const targetBimestreId = `${curso.toUpperCase()}-${ano}-b${bimestre}`;
        const targetAnoSection = document.getElementById(targetAnoId);
        const targetBimestreSection = document.getElementById(targetBimestreId);

        if (targetAnoSection && targetBimestreSection) {
            document.querySelectorAll("section[id]").forEach(section => {
                const sectionId = section.id;
                if (sectionId === targetAnoId || sectionId === targetBimestreId) {
                    section.classList.remove("hidden");
                } else {
                    section.classList.add("hidden");
                }
            });
        }
    }

    mostrarTela("s1");
});


console.log("Só Jesus na causa 2 aqui termina o script.js");

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}