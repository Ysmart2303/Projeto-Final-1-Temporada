/**
 * Carregar conteúdos dinâmicamente do banco de dados
 * Use este script nas páginas de conteúdo (conDS.html, conQm.html, etc)
 */

const API_URL = 'http://localhost:3000/api';

/**
 * Extrair parâmetros da URL
 */
function obterParametrosURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        curso: params.get('curso'),
        ano: params.get('ano'),
        bimestre: params.get('bimestre')
    };
}

/**
 * Carregar conteúdos do banco de dados
 */
async function carregarConteudos() {
    try {
        const { curso, ano, bimestre } = obterParametrosURL();

        if (!curso || !ano || !bimestre) {
            console.warn('Parâmetros de URL faltando:', { curso, ano, bimestre });
            return;
        }

        const response = await fetch(`${API_URL}/conteudos/${curso}/${ano}/${bimestre}`);
        const resultado = await response.json();

        if (resultado.sucesso && resultado.conteudos) {
            preencherConteudos(resultado.conteudos, curso, ano, bimestre);
        }
    } catch (erro) {
        console.error('Erro ao carregar conteúdos:', erro);
    }
}

/**
 * Preencher os elementos HTML com conteúdos do banco
 */
function preencherConteudos(conteudos, curso, ano, bimestre) {
    conteudos.forEach(conteudo => {
        // Procurar por elemento com ID correspondente
        const elementoConteudo = document.getElementById(`conteudo${ano}-${bimestre}-${conteudo.id}`);
        const elementoAtividade = document.getElementById(`atividade${ano}-${bimestre}-${conteudo.id}`);

        if (elementoConteudo) {
            elementoConteudo.innerHTML = `
                <h3>${conteudo.titulo}</h3>
                <p>${conteudo.descricao || 'Sem descrição'}</p>
                ${conteudo.arquivo_url ? `<a href="${conteudo.arquivo_url}" target="_blank">📎 Arquivo</a>` : ''}
            `;
        }

        if (elementoAtividade && conteudo.tipo === 'atividade') {
            elementoAtividade.innerHTML = `
                <h3>${conteudo.titulo}</h3>
                <p>${conteudo.descricao || 'Sem descrição'}</p>
            `;
        }
    });
}

/**
 * Adicionar novo conteúdo
 */
async function adicionarNovoConteudo(titulo, descricao, tipo = 'conteudo') {
    try {
        const { curso, ano, bimestre } = obterParametrosURL();

        const response = await fetch(API_URL + '/conteudos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                curso,
                ano,
                bimestre,
                titulo,
                descricao,
                tipo
            })
        });

        const resultado = await response.json();

        if (resultado.sucesso) {
            console.log('✅ Conteúdo adicionado com sucesso!');
            carregarConteudos(); // Recarregar conteúdos
            return resultado;
        } else {
            throw new Error(resultado.mensagem);
        }
    } catch (erro) {
        console.error('Erro ao adicionar conteúdo:', erro);
        throw erro;
    }
}

/**
 * Carregar automaticamente ao abrir a página
 */
window.addEventListener('DOMContentLoaded', () => {
    console.log('Carregando conteúdos do banco de dados...');
    carregarConteudos();
});

export { carregarConteudos, adicionarNovoConteudo, obterParametrosURL };
