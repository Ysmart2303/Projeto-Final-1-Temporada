const botaoBase = document.getElementById("bnt-login");
const API_URL = window.location.port === "3000" ? window.location.origin : "http://localhost:3000";

let cursoSelecionado = null;
let anoSelecionado = null;
let bimestreSelecionado = null;

const mapaCursos = {
    ds: "DS",
    qm: "QM",
    sec: "SEC",
    log: "LOG",
    tex: "TEX"
};

const codigoBancoPorCurso = {
    ds: "DS",
    qm: "QM",
    sec: "SEC",
    log: "LOG",
    tex: "TEX"
};

function irParaBimestre(numeroBimestre) {
    if (!cursoSelecionado || !anoSelecionado) {
        alert("Erro: curso ou ano nao selecionado.");
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
        alert("Pagina nao configurada para esta combinacao de curso, ano e bimestre.");
    }
}

function voltar(index) {
    const paginas = {
        home: "/html/index.html",
        creditos: "/html/creditos.html",
        login: "/jl/pj/pj.html",
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

function mostrarTela(telaId) {
    const telas = ["s1", "s2", "bimestre", "bimestre2", "bimestre3", "ConEAtiv"];

    telas.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });

    const tela = document.getElementById(telaId);
    if (tela) tela.classList.remove("hidden");

    const titulo = document.getElementById("escolhaHH");
    const subtitulo = document.getElementById("escolhaBB");

    if (telaId === "s1") {
        if (!titulo || !subtitulo || !botaoBase) return;
        titulo.innerHTML = "Bem-vindo";
        subtitulo.innerHTML = "Escolha o curso que deseja";
        botaoBase.textContent = "Login";
        botaoBase.onclick = () => voltar("login");
    } else if (telaId === "s2") {
        if (!titulo || !subtitulo || !botaoBase) return;
        titulo.innerHTML = "Escolha a serie que deseja";
        subtitulo.innerHTML = "";
        botaoBase.textContent = "Voltar";
        botaoBase.onclick = () => mostrarTela("s1");
    } else if (telaId === "ConEAtiv") {
        if (titulo) titulo.innerHTML = "Conteudos";
    } else if (telaId === "bimestre" || telaId === "bimestre2" || telaId === "bimestre3") {
        if (!titulo || !subtitulo || !botaoBase) return;
        titulo.innerHTML = "Escolha o bimestre";
        subtitulo.innerHTML = `${cursoSelecionado?.toUpperCase()} - ${anoSelecionado} Ano`;
        botaoBase.textContent = "Voltar";
        botaoBase.onclick = () => mostrarTela("s2");
    }
}

function selecionarCurso(nomeCurso) {
    cursoSelecionado = nomeCurso.toLowerCase();
    mostrarTela("s2");
}

function selecionarAno(numeroAno) {
    anoSelecionado = numeroAno;

    if (numeroAno === 1) {
        mostrarTela("bimestre");
    } else if (numeroAno === 2) {
        mostrarTela("bimestre2");
    } else if (numeroAno === 3) {
        mostrarTela("bimestre3");
    }
}

function falarnome() {
    alert("Sistema Integrado de Gestao Academica");
}

function montarCardPublico(dados, vazio) {
    if (!dados) return vazio;

    const linkExterno = normalizarLinkExterno(dados.link);
    const link = dados.link
        ? `<a href="${linkExterno}" target="_blank" rel="noopener noreferrer">Abrir link</a>`
        : "";

    return `
        <article class="conteudoPublico">
            <h2>${dados.assunto || "Sem assunto"}</h2>
            <p>${dados.texto || "Sem texto cadastrado."}</p>
            ${link}
        </article>
    `;
}

function normalizarLinkExterno(link) {
    const linkLimpo = String(link || "").trim();
    if (!linkLimpo) return "";

    if (/^(https?:)?\/\//i.test(linkLimpo)) {
        return linkLimpo.startsWith("//") ? `https:${linkLimpo}` : linkLimpo;
    }

    return `https://${linkLimpo}`;
}

async function carregarConteudosPublicos(curso, ano, bimestre, targetAnoSection) {
    const codigoCurso = codigoBancoPorCurso[curso.toLowerCase()] || curso.toUpperCase();
    const params = new URLSearchParams({
        curso: codigoCurso,
        serie: ano,
        bimestre
    });

    // Importante: as páginas con*.html têm ids diferentes para cada curso.
    // Então buscamos o bimestre dentro do bloco do ano selecionado, pelo padrão do id real.
    const prefixo = (targetAnoSection && targetAnoSection.querySelector('section[id]'))
        ? (targetAnoSection.querySelector('section[id]').id.split('-')[0] || "")
        : "";

    const targetBimestreSection = prefixo
        ? targetAnoSection.querySelector(`section[id^="${prefixo}-${ano}-b${bimestre}"]`)
        : targetAnoSection.querySelector(`section[id$="-b${bimestre}"]`);

    try {
        const resposta = await fetch(`${API_URL}/api/conteudos/publico?${params.toString()}`);
        if (!resposta.ok) throw new Error("Erro ao buscar conteudos");

        const dados = await resposta.json();

        // Se não achou o bimestre por algum motivo, não quebra a página.
        if (!targetBimestreSection) return;

        const quadroConteudos = targetBimestreSection.querySelector(".quadroConteudos");
        const quadroAtividades = targetBimestreSection.querySelector(".quadroAtividades");

        const listaConteudos = Array.isArray(dados.conteudos) ? dados.conteudos : [];
        const listaAtividades = Array.isArray(dados.atividades) ? dados.atividades : [];

        // CONTEÚDOS: cria 1 quadrado por item (quando existir)
        if (quadroConteudos && listaConteudos.length) {
            const placeholder = Array.from(quadroConteudos.children).find(
                (el) => el && el.textContent && el.textContent.trim().toLowerCase() === "null"
            );
            if (placeholder) placeholder.remove();

            listaConteudos.forEach((item) => {
                const novoId = `conteudo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                const div = document.createElement("div");
                div.id = novoId;
                div.innerHTML = montarCardPublico(item, "Nenhum conteudo cadastrado.");
                quadroConteudos.appendChild(div);
            });
        }

        // ATIVIDADES: cria 1 quadrado por item (quando existir)
        if (quadroAtividades && listaAtividades.length) {
            const placeholder = Array.from(quadroAtividades.children).find(
                (el) => el && el.textContent && el.textContent.trim().toLowerCase() === "null"
            );
            if (placeholder) placeholder.remove();

            listaAtividades.forEach((item) => {
                const novoId = `atividade-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                const div = document.createElement("div");
                div.id = novoId;
                div.innerHTML = montarCardPublico(item, "Nenhuma atividade cadastrada.");
                quadroAtividades.appendChild(div);
            });
        }
    } catch (err) {
        console.error(err);
        if (!targetBimestreSection) return;

        const conteudo = targetBimestreSection.querySelector(".quadroConteudos > div");
        const atividade = targetBimestreSection.querySelector(".quadroAtividades > div");
        if (conteudo) conteudo.innerHTML = "Nao foi possivel carregar o conteudo.";
        if (atividade) atividade.innerHTML = "Nao foi possivel carregar a atividade.";
    }
}

window.toggleDarkMode = function toggleDarkMode() {
    const currentTheme = document.documentElement.dataset.theme || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    try {
        localStorage.setItem("theme", nextTheme);
    } catch (e) {
        // Ignora navegadores sem localStorage.
    }

    const botao = document.getElementById("bnt-toggle");
    if (botao) botao.textContent = nextTheme === "dark" ? "Dark" : "Light";
};

window.abrirSidebar = function abrirSidebar(event) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();

    const overlay = document.getElementById("sidebar-overlay");
    const sidebar = document.getElementById("sidebar");

    if (overlay) overlay.classList.remove("hidden");
    if (sidebar) {
        sidebar.classList.remove("hidden");
        sidebar.setAttribute("aria-hidden", "false");
    }
};

window.fecharSidebar = function fecharSidebar() {
    const overlay = document.getElementById("sidebar-overlay");
    const sidebar = document.getElementById("sidebar");

    if (overlay) overlay.classList.add("hidden");
    if (sidebar) {
        sidebar.classList.add("hidden");
        sidebar.setAttribute("aria-hidden", "true");
    }
};

window.addEventListener("DOMContentLoaded", () => {
    const botaoTema = document.getElementById("bnt-toggle");
    if (botaoTema) botaoTema.onclick = () => window.toggleDarkMode();

    try {
        const savedTheme = localStorage.getItem("theme");
        const initialTheme = savedTheme === "light" ? "light" : "dark";
        document.documentElement.dataset.theme = initialTheme;

        const botao = document.getElementById("bnt-toggle");
        if (botao) botao.textContent = initialTheme === "dark" ? "Dark" : "Light";
    } catch (e) {
        // Ignora navegadores sem localStorage.
    }

    const params = new URLSearchParams(window.location.search);
    const curso = params.get("curso");
    const ano = params.get("ano");
    const bimestre = params.get("bimestre");

    if (curso && ano && bimestre) {
        const targetAnoId = `${ano}ano`;
        const siglaVisual = mapaCursos[curso.toLowerCase()] || curso.toUpperCase();
        const targetBimestreId = `${siglaVisual}-${ano}-b${bimestre}`;
        const targetAnoSection = document.getElementById(targetAnoId);
        const targetBimestreSection = document.getElementById(targetBimestreId);

        if (targetAnoSection && targetBimestreSection) {
            document.querySelectorAll("section[id]").forEach((section) => {
                const sectionId = section.id;
                if (sectionId === targetAnoId || sectionId === targetBimestreId) {
                    section.classList.remove("hidden");
                } else {
                    section.classList.add("hidden");
                }
            });

            carregarConteudosPublicos(curso, ano, bimestre, targetAnoSection);
        }
    }

    if (document.getElementById("s1")) {
        mostrarTela("s1");
    }
});
