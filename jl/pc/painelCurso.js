const API_URL = window.location.port === "3000" ? window.location.origin : "http://localhost:3000";
const cursoAtualTexto = localStorage.getItem("cursoAtual");

if (!cursoAtualTexto) {
    alert("Voce precisa fazer login primeiro.");
    window.location.href = "../pj/pj.html";
}

const cursoAtual = JSON.parse(cursoAtualTexto);

if (!cursoAtual) {
    alert("Dados do curso ausentes. Voltando ao login.");
    window.location.href = "../pj/pj.html";
}

const professorAtual = localStorage.getItem("professorAtual") || cursoAtual.nomeProfessor || "";
const emailAtual = localStorage.getItem("emailAtual") || cursoAtual.email || "";
const emailSalvo = localStorage.getItem("email_" + cursoAtual.usuario);

document.getElementById("tituloCurso").innerText = "Painel " + cursoAtual.nomeCurso;
document.getElementById("nomeProfessor").innerText = "Professor: " + professorAtual;
if (document.getElementById("emailProfessor")) {
    document.getElementById("emailProfessor").value = emailSalvo || emailAtual || "";
}

document.querySelector(".periodos1").style.display = "none";
document.getElementById("voltarSeries").style.display = "none";

let serieAtual = 0;
let registrosCadastrados = [];

function abrirSerie(numero) {
    serieAtual = numero;
    document.getElementById("serieAtual").style.display = "block";
    document.getElementById("serieAtual").innerText = numero + " Serie";
    document.getElementById("listaSe").style.display = "none";
    document.getElementById("voltarSeries").style.display = "block";
    document.querySelector(".periodos1").style.display = "block";
    localStorage.setItem("serieAtual_" + cursoAtual.usuario, numero);
}

function abrirMes(numero) {
    document.getElementById("serieAtual").innerText = `${serieAtual} Serie - Bimestre ${numero}`;
    document.getElementById("listaBi").style.display = "none";
    document.getElementById("voltarSeries").style.display = "none";

    const area = document.getElementById("conteudoBi");
    area.innerHTML = `
        <div class="opcoesBimestre">
            <div class="cardOpcao" onclick="abrirConteudos(${numero})">
                <h2>Conteudos</h2>
            </div>
            <div class="cardOpcao" onclick="abrirAtividades(${numero})">
                <h2>Atividades</h2>
            </div>
        </div>
        <button onclick="voltar()">Voltar</button>
    `;
}

function voltar() {
    document.getElementById("listaBi").style.display = "flex";
    document.getElementById("conteudoBi").innerHTML = "";
    document.getElementById("voltarSeries").style.display = "block";
    document.getElementById("serieAtual").innerText = serieAtual + " Serie";
}

function voltarSeries() {
    document.getElementById("listaSe").style.display = "flex";
    document.getElementById("voltarSeries").style.display = "none";
    document.querySelector(".periodos1").style.display = "none";
    document.getElementById("conteudoBi").innerHTML = "";
    document.getElementById("listaBi").style.display = "flex";
    serieAtual = 0;
    document.getElementById("serieAtual").style.display = "none";
}

function textoTipo(tipo) {
    return tipo === "conteudo" ? "Conteudo" : "Atividade";
}

function mostrarEditorRegistro(tipo, bimestre, dados) {
    const area = document.getElementById("conteudoBi");
    document.getElementById("listaSe").style.display = "none";
    document.getElementById("listaBi").style.display = "none";
    document.getElementById("voltarSeries").style.display = "none";
    document.querySelector(".periodos1").style.display = "block";
    document.getElementById("serieAtual").style.display = "block";
    document.getElementById("serieAtual").innerText = `${serieAtual} Serie - Bimestre ${bimestre}`;

    const ehConteudo = tipo === "conteudo";
    const assuntoId = ehConteudo ? "assunto" : "assuntoAtividade";
    const linkId = ehConteudo ? "linkAjuda" : "linkAtividade";
    const textoId = ehConteudo ? "textoConteudo" : "textoAtividade";
    const salvarFn = ehConteudo ? "salvarConteudo" : "salvarAtividade";
    const registroId = dados?.id ? Number(dados.id) : null;
    const tituloAcao = registroId ? "Editar" : "Novo";
    const textoBotao = registroId ? "Salvar alteracao" : "Cadastrar";

    area.innerHTML = `
        <div class="painelEdicao">
            <h2>${tituloAcao} ${textoTipo(tipo)} - ${serieAtual} Serie - Bimestre ${bimestre}</h2>
            <input type="text" id="${assuntoId}" placeholder="Assunto">
            <input type="url" id="${linkId}" placeholder="Link de ajuda">
            <textarea id="${textoId}" placeholder="Digite o texto..."></textarea>
            <div class="botoesEdicao">
                <button onclick="${salvarFn}(${bimestre}, ${registroId})">${textoBotao}</button>
                <button onclick="voltarParaGerenciamento()">Voltar para lista</button>
            </div>
        </div>
    `;

    document.getElementById(assuntoId).value = dados?.assunto || "";
    document.getElementById(linkId).value = dados?.link || "";
    document.getElementById(textoId).value = dados?.texto || "";
}

async function abrirConteudos(bimestre) {
    mostrarEditorRegistro("conteudo", bimestre, null);
}

async function abrirAtividades(bimestre) {
    mostrarEditorRegistro("atividade", bimestre, null);
}

async function salvarRegistro(tipo, bimestre, dados, id = null) {
    const url = id ? `${API_URL}/api/conteudos/${id}` : `${API_URL}/api/conteudos`;
    const resposta = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            curso: cursoAtual.usuario,
            serie: serieAtual,
            bimestre,
            tipo,
            ...dados
        })
    });

    const respostaJson = await resposta.json();
    if (!resposta.ok) throw new Error(respostaJson.mensagem || "Erro ao salvar");
}

function normalizarLinkExterno(link) {
    const linkLimpo = String(link || "").trim();
    if (!linkLimpo) return "";

    if (/^(https?:)?\/\//i.test(linkLimpo)) {
        return linkLimpo.startsWith("//") ? `https:${linkLimpo}` : linkLimpo;
    }

    return `https://${linkLimpo}`;
}

async function salvarConteudo(bimestre, id = null) {
    try {
        await salvarRegistro("conteudo", bimestre, {
            assunto: document.getElementById("assunto").value.trim(),
            link: normalizarLinkExterno(document.getElementById("linkAjuda").value),
            texto: document.getElementById("textoConteudo").value.trim()
        }, id);
        alert(id ? "Conteudo atualizado!" : "Conteudo salvo!");
        await voltarParaGerenciamento();
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
}

async function salvarAtividade(bimestre, id = null) {
    try {
        await salvarRegistro("atividade", bimestre, {
            assunto: document.getElementById("assuntoAtividade").value.trim(),
            link: normalizarLinkExterno(document.getElementById("linkAtividade").value),
            texto: document.getElementById("textoAtividade").value.trim()
        }, id);
        alert(id ? "Atividade atualizada!" : "Atividade salva!");
        await voltarParaGerenciamento();
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
}

async function voltarParaGerenciamento() {
    document.getElementById("conteudoBi").innerHTML = "";
    document.getElementById("listaBi").style.display = "flex";
    document.getElementById("listaSe").style.display = "flex";
    document.querySelector(".periodos1").style.display = "none";
    document.getElementById("voltarSeries").style.display = "none";
    document.getElementById("serieAtual").style.display = "none";
    serieAtual = 0;
    await listarRegistros();
}

async function listarRegistros() {
    const lista = document.getElementById("listaRegistros");
    if (!lista) return;

    lista.innerHTML = "<p>Carregando registros...</p>";

    try {
        const resposta = await fetch(`${API_URL}/api/conteudos/curso/${encodeURIComponent(cursoAtual.usuario)}`);
        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro ao carregar registros.");
        }

        registrosCadastrados = dados;

        if (dados.length === 0) {
            lista.innerHTML = "<p>Nenhum conteudo ou atividade cadastrado ainda.</p>";
            return;
        }

        lista.innerHTML = dados.map((registro, index) => `
            <article class="registroCard">
                <div class="registroInfo">
                    <span>${textoTipo(registro.tipo)}</span>
                    <h3>${registro.assunto || "Sem assunto"}</h3>
                    <p>${registro.serie} Serie - Bimestre ${registro.bimestre}</p>
                    <p>${registro.texto || "Sem texto cadastrado."}</p>
                    ${registro.link ? `<a href="${registro.link}" target="_blank" rel="noopener noreferrer">Abrir link</a>` : ""}
                </div>
                <div class="registroAcoes">
                    <button type="button" onclick="editarRegistro(${index})">Editar</button>
                    <button type="button" class="botaoExcluir" onclick="excluirRegistro(${index})">Excluir</button>
                </div>
            </article>
        `).join("");
    } catch (err) {
        lista.innerHTML = "<p>Nao foi possivel carregar os registros.</p>";
        console.error(err);
    }
}

function editarRegistro(index) {
    const registro = registrosCadastrados[index];
    if (!registro) return;

    serieAtual = Number(registro.serie);
    mostrarEditorRegistro(registro.tipo, Number(registro.bimestre), registro);
}

async function excluirRegistro(index) {
    const registro = registrosCadastrados[index];
    if (!registro) return;
    if (!registro.id) {
        alert("Registro sem id. Atualize a lista e tente novamente.");
        return;
    }

    const confirmar = confirm(
        `Excluir ${textoTipo(registro.tipo).toLowerCase()} "${registro.assunto || "sem assunto"}"?`
    );
    if (!confirmar) return;

    const params = new URLSearchParams({ curso: cursoAtual.usuario });

    try {
        const resposta = await fetch(`${API_URL}/api/conteudos/${registro.id}?${params.toString()}`, {
            method: "DELETE"
        });
        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro ao excluir registro.");
        }

        alert("Registro excluido!");
        await listarRegistros();
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
}

function salvarEmail() {
    const email = document.getElementById("emailProfessor").value.trim();
    localStorage.setItem("email_" + cursoAtual.usuario, email);
    localStorage.setItem("emailAtual", email);
    alert("Email salvo neste navegador!");
}

listarRegistros();
