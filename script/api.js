// Configuração da API
const API_URL = 'http://localhost:3000/api';

/**
 * Fazer uma chamada à API
 * @param {string} endpoint - O endpoint da API (ex: /auth/login)
 * @param {string} metodo - GET, POST, PUT, DELETE
 * @param {Object} dados - Dados a enviar (para POST/PUT)
 * @returns {Promise} Resposta da API
 */
async function chamarAPI(endpoint, metodo = 'GET', dados = null) {
  try {
    const opcoes = {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (dados && (metodo === 'POST' || metodo === 'PUT')) {
      opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(API_URL + endpoint, opcoes);
    const resultado = await resposta.json();

    if (!resposta.ok) {
      console.error('Erro na API:', resultado);
      throw new Error(resultado.mensagem || 'Erro na requisição');
    }

    return resultado;
  } catch (erro) {
    console.error('Erro ao chamar API:', erro);
    throw erro;
  }
}

// FUNÇÕES DE AUTENTICAÇÃO

/**
 * Fazer login do usuário
 */
async function fazerLoginAPI(usuario, senha) {
  try {
    const resultado = await chamarAPI('/auth/login', 'POST', {
      usuario,
      senha
    });

    if (resultado.sucesso) {
      // Armazenar dados do usuário no localStorage
      localStorage.setItem('usuario_id', resultado.id);
      localStorage.setItem('usuario_nome', resultado.usuario);
      localStorage.setItem('usuario_tipo', resultado.tipo);
      return resultado;
    }
  } catch (erro) {
    console.error('Erro no login:', erro);
    throw erro;
  }
}

/**
 * Fazer cadastro de novo usuário
 */
async function fazerCadastroAPI(usuario, senha) {
  try {
    const resultado = await chamarAPI('/auth/cadastro', 'POST', {
      usuario,
      senha,
      tipo: 'aluno'
    });
    return resultado;
  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    throw erro;
  }
}

/**
 * Fazer logout
 */
function fazerLogout() {
  localStorage.removeItem('usuario_id');
  localStorage.removeItem('usuario_nome');
  localStorage.removeItem('usuario_tipo');
  window.location.href = '/html/index.html';
}

/**
 * Verificar se usuário está logado
 */
function estaLogado() {
  return localStorage.getItem('usuario_id') !== null;
}

/**
 * Obter dados do usuário logado
 */
function obterUsuarioLogado() {
  return {
    id: localStorage.getItem('usuario_id'),
    nome: localStorage.getItem('usuario_nome'),
    tipo: localStorage.getItem('usuario_tipo')
  };
}

// FUNÇÕES DE CURSOS

/**
 * Obter lista de cursos
 */
async function obterCursos() {
  try {
    const resultado = await chamarAPI('/cursos', 'GET');
    return resultado.cursos || [];
  } catch (erro) {
    console.error('Erro ao obter cursos:', erro);
    return [];
  }
}

/**
 * Criar novo curso (apenas admin)
 */
async function criarCurso(nome, usuario, senha) {
  try {
    const resultado = await chamarAPI('/cursos', 'POST', {
      nome,
      usuario,
      senha
    });
    return resultado;
  } catch (erro) {
    console.error('Erro ao criar curso:', erro);
    throw erro;
  }
}

// FUNÇÕES DE CONTEÚDOS

/**
 * Obter conteúdos de um curso
 */
async function obterConteudos(curso, ano, bimestre) {
  try {
    const resultado = await chamarAPI(`/conteudos/${curso}/${ano}/${bimestre}`, 'GET');
    return resultado.conteudos || [];
  } catch (erro) {
    console.error('Erro ao obter conteúdos:', erro);
    return [];
  }
}

/**
 * Adicionar novo conteúdo
 */
async function adicionarConteudo(curso, ano, bimestre, titulo, descricao, tipo = 'conteudo') {
  try {
    const resultado = await chamarAPI('/conteudos', 'POST', {
      curso,
      ano,
      bimestre,
      titulo,
      descricao,
      tipo
    });
    return resultado;
  } catch (erro) {
    console.error('Erro ao adicionar conteúdo:', erro);
    throw erro;
  }
}

// FUNÇÕES DE ATIVIDADES

/**
 * Obter atividades de um conteúdo
 */
async function obterAtividades(conteudo_id) {
  try {
    const resultado = await chamarAPI(`/atividades/${conteudo_id}`, 'GET');
    return resultado.atividades || [];
  } catch (erro) {
    console.error('Erro ao obter atividades:', erro);
    return [];
  }
}

/**
 * Adicionar nova atividade
 */
async function adicionarAtividade(conteudo_id, titulo, descricao, prazo) {
  try {
    const resultado = await chamarAPI('/atividades', 'POST', {
      conteudo_id,
      titulo,
      descricao,
      prazo
    });
    return resultado;
  } catch (erro) {
    console.error('Erro ao adicionar atividade:', erro);
    throw erro;
  }
}

// VERIFICAÇÃO DE SAÚDE

/**
 * Verificar se o servidor está conectado
 */
async function verificarSaudeBD() {
  try {
    const resultado = await chamarAPI('/health', 'GET');
    console.log('✅ Servidor conectado:', resultado.mensagem);
    return resultado.sucesso;
  } catch (erro) {
    console.error('❌ Servidor não está acessível:', erro);
    return false;
  }
}

export {
  chamarAPI,
  fazerLoginAPI,
  fazerCadastroAPI,
  fazerLogout,
  estaLogado,
  obterUsuarioLogado,
  obterCursos,
  criarCurso,
  obterConteudos,
  adicionarConteudo,
  obterAtividades,
  adicionarAtividade,
  verificarSaudeBD
};
