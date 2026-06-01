const botaoBase = document.getElementById("btn-login");

// VARIÁVEIS GLOBAIS PARA RASTREAMENTO DE NAVEGAÇÃO
let cursoSelecionado = null;
let anoSelecionado = null;

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
        alert("Erro: Curso ou ano não selecionado.");
        return;
    }

    // Mapeamento de páginas por curso e ano
    const mapaPaginas = {
        "ds": {
            1: "/html/conteudos/conDS.html",
            2: "/html/conteudos/conDS.html",
            3: "/html/conteudos/conDS.html"
        },
        "qm": {
            1: "/html/conteudos/conQm.html",
            2: "/html/conteudos/conQm.html",
            3: "/html/conteudos/conQm.html"
        },
        "sec": {
            1: "/html/conteudos/conSec.html",
            2: "/html/conteudos/conSec.html",
            3: "/html/conteudos/conSec.html"
        },
        "log": {
            1: "/html/conteudos/conLogi.html",
            2: "/html/conteudos/conLogi.html",
            3: "/html/conteudos/conLogi.html"
        },
        "tex": {
            1: "/html/conteudos/conTex.html",
            2: "/html/conteudos/conTex.html",
            3: "/html/conteudos/conTex.html"
        }
    };

    // Buscar página correspondente
    if (mapaPaginas[cursoSelecionado] && mapaPaginas[cursoSelecionado][anoSelecionado]) {
        // Passar informações via URL (opcional)
        const url = mapaPaginas[cursoSelecionado][anoSelecionado] + 
                   `?curso=${cursoSelecionado}&ano=${anoSelecionado}&bimestre=${numeroBimestre}`;
        window.location.href = url;
    } else {
        alert("Página não configurada para esta combinação.");
    }
}

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