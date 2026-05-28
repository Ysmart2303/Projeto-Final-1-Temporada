const Bds = document.getElementById("ds");
const Bqm = document.getElementById("qm");
const Bsec = document.getElementById("sec");
const Blog = document.getElementById("log");
const Btex = document.getElementById("tex");

// carregar pontos salvos

let pontos =
    JSON.parse(localStorage.getItem("pontos")) || [];

// função para voltar páginas

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

// adicionar pontos

function adicionarPonto(curso) {

    pontos.push(curso);

    localStorage.setItem(
        "pontos",
        JSON.stringify(pontos)
    );
}

// remover pontos

function removerPontos() {

    pontos = [];

    localStorage.removeItem("pontos");
}

// mostrar pontos

function mos() {
    alert(pontos);
}

// eventos dos botões

Bds.addEventListener("click", () => {
    adicionarPonto("ds");
});

Bqm.addEventListener("click", () => {
    adicionarPonto("qm");
});

Bsec.addEventListener("click", () => {
    adicionarPonto("sec");
});

Blog.addEventListener("click", () => {
    adicionarPonto("log");
});

Btex.addEventListener("click", () => {
    adicionarPonto("tex");
});

// páginas que resetam os pontos

const paginasReset = [
    "login.html",
    "creditos.html",
    "index.html"
];

const paginaAtual = window.location.pathname;

// verificar página atual

if (
    paginasReset.some(pagina =>
        paginaAtual.includes(pagina)
    )
) {
    removerPontos();
}