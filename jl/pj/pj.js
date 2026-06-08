// Importar funções de API
import { fazerLoginAPI, verificarSaudeBD } from '/script/api.js';

let tentativas = 0;
const API_URL = 'http://localhost:3000/api';

// Verificar conexão ao carregar a página
window.addEventListener('DOMContentLoaded', async () => {
    const conectado = await verificarSaudeBD();
    if (!conectado) {
        document.getElementById('errologin').innerHTML = 
            '⚠️ Servidor não está acessível. Verifique se o backend está rodando em http://localhost:3000';
        document.getElementById('errologin').style.color = '#ff6b6b';
    }
});

/**
 * Fazer login do usuário com o backend
 */
async function fazerLogin() {
    try {
        let user = document.getElementById("userInput").value.trim();
        let senhaDigitada = document.getElementById("senhaInput").value.trim();

        if (!user || !senhaDigitada) {
            document.getElementById("errologin").innerText = "Preencha usuário e senha!";
            return;
        }

        document.getElementById("loginTela").style.display = "none";
        document.getElementById("carregando").style.display = "block";

        const resultado = await fazerLoginAPI(user, senhaDigitada);

        if (resultado.sucesso) {
            // Salvar dados do usuário
            localStorage.setItem("usuario_id", resultado.id);
            localStorage.setItem("usuario_nome", resultado.usuario);
            localStorage.setItem("usuario_tipo", resultado.tipo);

            console.log("✅ Login bem-sucedido:", resultado);

            setTimeout(() => {
                window.location.href = "../pc/painelCurso.html";
            }, 1500);
        }
    } catch (erro) {
        document.getElementById("loginTela").style.display = "block";
        document.getElementById("carregando").style.display = "none";
        
        tentativas++;
        document.getElementById("errologin").innerText = 
            "Senha ou Usuário Incorretos! Tente novamente. Suas tentativas: " + tentativas + "/3";

        if (tentativas >= 3) {
            document.getElementById("errologin").innerText =
                "Muitas tentativas. Recarregue a página.";
        }
    }
}
/**
 * Abrir painel de cadastro
 */
function cadastroCurso() {
    document.getElementById("painelCadastro").style.display = "block";
    document.getElementById("loginTela").style.display = "none";
}

/**
 * Criar novo curso no banco de dados
 */
async function criarCurso() {
    try {
        let nomeCurso = document.getElementById("cursoInput").value.trim();
        let usuario = document.getElementById("usuarioCurso").value.trim();
        let senha = document.getElementById("senhaCurso").value.trim();

        if (!nomeCurso || !usuario || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        if (senha.length < 4) {
            alert("A senha deve ter pelo menos 4 caracteres!");
            return;
        }

        const response = await fetch(API_URL + '/cursos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nomeCurso,
                usuario: usuario,
                senha: senha
            })
        });

        const resultado = await response.json();

        if (resultado.sucesso) {
            alert("✅ Curso criado com sucesso!");
            voltarLogin();
            // Limpar campos
            document.getElementById("cursoInput").value = "";
            document.getElementById("usuarioCurso").value = "";
            document.getElementById("senhaCurso").value = "";
        } else {
            alert("❌ Erro: " + resultado.mensagem);
        }
    } catch (erro) {
        console.error("Erro ao criar curso:", erro);
        alert("Erro ao criar curso: " + erro.message);
    }
}

/**
 * Remover curso
 */
async function removerCurso(cursoId) {
    if (!confirm("⚠️ Tem certeza que deseja remover este curso?")) {
        return;
    }

    try {
        const response = await fetch(API_URL + '/cursos/' + cursoId, {
            method: 'DELETE'
        });

        const resultado = await response.json();

        if (resultado.sucesso) {
            alert("✅ Curso removido com sucesso!");
            verCursos();
        } else {
            alert("❌ Erro: " + resultado.mensagem);
        }
    } catch (erro) {
        console.error("Erro ao remover curso:", erro);
        alert("Erro ao remover curso: " + erro.message);
    }
}

/**
 * Voltar para a tela de login
 */
function voltarLogin() {
    document.getElementById("painelCadastro").style.display = "none";
    document.getElementById("loginTela").style.display = "block";
}
/**
 * Listar cursos cadastrados
 */
async function verCursos() {
    try {
        const response = await fetch(API_URL + '/cursos');
        const resultado = await response.json();

        if (resultado.sucesso && resultado.cursos) {
            let lista = document.getElementById("listaCursos");

            if (!lista) {
                console.warn("Elemento 'listaCursos' não encontrado no HTML");
                return;
            }

            lista.innerHTML = "<h3>Cursos Cadastrados</h3>";

            resultado.cursos.forEach(curso => {
                lista.innerHTML += `
                    <div class="cursoCard" style="margin: 10px 0; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                        <h4>${curso.nome}</h4>
                        <p><strong>Usuário:</strong> ${curso.usuario}</p>
                        <button onclick="removerCurso(${curso.id})" style="background-color: #ff6b6b; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">
                            Remover
                        </button>
                    </div>
                `;
            });
        }
    } catch (erro) {
        console.error("Erro ao carregar cursos:", erro);
    }
}

export { fazerLogin, cadastroCurso, criarCurso, removerCurso, voltarLogin, verCursos };

                <p><strong>Curso:</strong> ${admin.nomeCurso}</p>


                <button onclick="removerCurso('${admin.usuario}')">
                    Remover
                </button>

            </div>
        `;
    });
}