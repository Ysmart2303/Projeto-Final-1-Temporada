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

async function buscarRegistro(tipo, bimestre) {
    const params = new URLSearchParams({
        curso: cursoAtual.usuario,
        serie: serieAtual,
        bimestre,
        tipo
    });

    const resposta = await fetch(`${API_URL}/api/conteudos?${params.toString()}`);
    if (!resposta.ok) throw new Error("Erro ao buscar dados");
    return await resposta.json();
}

async function abrirConteudos(bimestre) {
    const area = document.getElementById("conteudoBi");
    area.innerHTML = "<p>Carregando...</p>";

    let dados = { assunto: "", link: "", texto: "" };
    try {
        dados = (await buscarRegistro("conteudo", bimestre)) || dados;
    } catch (err) {
        console.error(err);
        alert("Nao foi possivel carregar o conteudo salvo.");
    }

    area.innerHTML = `
        <div class="painelEdicao">
            <h2>Conteudos - Bimestre ${bimestre}</h2>
            <input type="text" id="assunto" placeholder="Assunto">
            <input type="url" id="linkAjuda" placeholder="Link de ajuda">
            <textarea id="textoConteudo" placeholder="Digite o conteudo..."></textarea>
            <div class="botoesEdicao">
                <button onclick="salvarConteudo(${bimestre})">Salvar</button>
                <button onclick="abrirMes(${bimestre})">Voltar</button>
            </div>
        </div>
    `;

    document.getElementById("assunto").value = dados.assunto || "";
    document.getElementById("linkAjuda").value = dados.link || "";
    document.getElementById("textoConteudo").value = dados.texto || "";
}

async function abrirAtividades(bimestre) {
    const area = document.getElementById("conteudoBi");
    area.innerHTML = "<p>Carregando...</p>";

    let dados = { assunto: "", link: "", texto: "" };
    try {
        dados = (await buscarRegistro("atividade", bimestre)) || dados;
    } catch (err) {
        console.error(err);
        alert("Nao foi possivel carregar a atividade salva.");
    }

    area.innerHTML = `
        <div class="painelEdicao">
            <h2>Atividades - Bimestre ${bimestre}</h2>
            <input type="text" id="assuntoAtividade" placeholder="Assunto">
            <input type="url" id="linkAtividade" placeholder="Link de ajuda">
            <textarea id="textoAtividade" placeholder="Digite a atividade..."></textarea>
            <div class="botoesEdicao">
                <button onclick="salvarAtividade(${bimestre})">Salvar</button>
                <button onclick="abrirMes(${bimestre})">Voltar</button>
            </div>
        </div>
    `;

    document.getElementById("assuntoAtividade").value = dados.assunto || "";
    document.getElementById("linkAtividade").value = dados.link || "";
    document.getElementById("textoAtividade").value = dados.texto || "";
}

async function salvarRegistro(tipo, bimestre, dados) {
    const resposta = await fetch(`${API_URL}/api/conteudos`, {
        method: "POST",
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

async function salvarConteudo(bimestre) {
    try {
        await salvarRegistro("conteudo", bimestre, {
            assunto: document.getElementById("assunto").value.trim(),
            link: normalizarLinkExterno(document.getElementById("linkAjuda").value),
            texto: document.getElementById("textoConteudo").value.trim()
        });
        alert("Conteudo salvo!");
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
}

async function salvarAtividade(bimestre) {
    try {
        await salvarRegistro("atividade", bimestre, {
            assunto: document.getElementById("assuntoAtividade").value.trim(),
            link: normalizarLinkExterno(document.getElementById("linkAtividade").value),
            texto: document.getElementById("textoAtividade").value.trim()
        });
        alert("Atividade salva!");
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
