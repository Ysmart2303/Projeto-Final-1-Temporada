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


const API_URL = window.location.port === "3000" ? window.location.origin : "http://localhost:3000";
let tentativas = 0;
let admins = [];

function mostrarErro(mensagem) {
    const area = document.getElementById("errologin");
    if (area) area.innerText = mensagem;
}

function cursoParaStorage(admin) {
    return {
        id: admin.id,
        nomeCurso: admin.nomeCurso,
        nomeProfessor: admin.nomeProfessor,
        usuario: admin.usuario,
        email: admin.email,
        pagina: admin.pagina || "/jl/pc/painelCurso.html"
    };
}

function teste() {
    alert("funciona");
}

async function fazerLogin() {
    if (tentativas >= 3) {
        mostrarErro("Muitas tentativas. Recarregue a pagina.");
        return;
    }

    const user = document.getElementById("userInput").value.trim();
    const senhaDigitada = document.getElementById("senhaInput").value.trim();

    if (!user || !senhaDigitada) {
        mostrarErro("Digite usuario e senha.");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: user.toUpperCase(), senha: senhaDigitada })
        });

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {
            tentativas++;
            mostrarErro(`Senha ou usuario incorretos! Tentativas: ${tentativas}/3`);
            return;
        }

        const cursoAtual = cursoParaStorage(dados.admin);
        localStorage.setItem("cursoAtual", JSON.stringify(cursoAtual));
        localStorage.setItem("professorAtual", cursoAtual.nomeProfessor);
        localStorage.setItem("emailAtual", cursoAtual.email);

        document.getElementById("loginTela").style.display = "none";
        document.getElementById("carregando").style.display = "block";

        setTimeout(() => {
            window.location.href = cursoAtual.pagina;
        }, 800);
    } catch (err) {
        mostrarErro("Nao foi possivel conectar ao servidor. Inicie o backend.");
        console.error(err);
    }
}

function cadastroCurso() {
    document.getElementById("painelCadastro").style.display = "block";
    document.getElementById("loginTela").style.display = "none";
}

async function criarCurso() {
    const nomeCurso = document.getElementById("cursoInput").value.trim();
    const nomeProfessor = document.getElementById("nomeProfessor").value.trim();
    const usuario = document.getElementById("usuarioCurso").value.trim();
    const senha = document.getElementById("senhaCurso").value.trim();
    const email = document.getElementById("emailCurso").value.trim();

    if (!nomeCurso || !nomeProfessor || !usuario || !senha || !email) {
        alert("Preencha todos os campos!");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Digite um email valido!");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/api/cursos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomeCurso, nomeProfessor, usuario, senha, email })
        });

        const dados = await resposta.json();
        if (!resposta.ok) {
            alert(dados.mensagem || "Erro ao cadastrar curso.");
            return;
        }

        alert("Curso criado com sucesso!");
        await verCursos();
    } catch (err) {
        alert("Nao foi possivel conectar ao servidor.");
        console.error(err);
    }
}

async function removerCurso(usuario) {
    const confirmar = confirm(
        "ATENCAO\n\nVoce esta prestes a excluir este curso.\nEssa acao nao podera ser desfeita.\n\nDeseja continuar?"
    );

    if (!confirmar) return;

    try {
        const resposta = await fetch(`${API_URL}/api/cursos/${encodeURIComponent(usuario)}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            const dados = await resposta.json();
            alert(dados.mensagem || "Erro ao remover curso.");
            return;
        }

        await verCursos();
        alert("Curso removido com sucesso!");
    } catch (err) {
        alert("Nao foi possivel conectar ao servidor.");
        console.error(err);
    }
}

function voltarLogin() {
    document.getElementById("painelCadastro").style.display = "none";
    document.getElementById("loginTela").style.display = "block";
}

async function carregarCursos() {
    const resposta = await fetch(`${API_URL}/api/cursos`);
    if (!resposta.ok) throw new Error("Erro ao carregar cursos");
    admins = await resposta.json();
    return admins;
}

async function atualizarCursos() {
    await verCursos();
}

async function verCursos() {
    const lista = document.getElementById("listaCursos");
    lista.innerHTML = "<h3>Cursos Cadastrados</h3>";

    try {
        await carregarCursos();

        admins.forEach((admin) => {
            lista.innerHTML += `
                <div class="cursoCard">
                    <p><strong>Curso:</strong> ${admin.nomeCurso}</p>
                    <p><strong>Usuario:</strong> ${admin.usuario}</p>
                    <button onclick="removerCurso('${admin.usuario}')">
                        Remover
                    </button>
                </div>
            `;
        });
    } catch (err) {
        lista.innerHTML += "<p>Nao foi possivel carregar os cursos. Inicie o backend.</p>";
        console.error(err);
    }
}
