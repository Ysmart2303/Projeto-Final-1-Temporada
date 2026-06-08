# 📖 Exemplos de Uso da API - SIGA MCVM

Este guia mostra como usar a API do backend do seu projeto SIGA MCVM.

---

## 🔐 Autenticação

### Login de Usuário

```javascript
// Importar a função
import { fazerLoginAPI } from '/script/api.js';

// Fazer login
async function testarLogin() {
    try {
        const resultado = await fazerLoginAPI('aluno1', 'senha123');
        console.log('Login bem-sucedido:', resultado);
        // Dados do usuário já estão salvos em localStorage
    } catch (erro) {
        console.error('Erro no login:', erro);
    }
}
```

### Verificar se está logado

```javascript
import { estaLogado, obterUsuarioLogado } from '/script/api.js';

if (estaLogado()) {
    const usuario = obterUsuarioLogado();
    console.log('Usuário logado:', usuario.nome);
} else {
    console.log('Não está logado');
}
```

### Fazer logout

```javascript
import { fazerLogout } from '/script/api.js';

function sair() {
    fazerLogout(); // Limpa dados e redireciona para index.html
}
```

---

## 📚 Cursos

### Obter lista de cursos

```javascript
import { obterCursos } from '/script/api.js';

async function listarCursos() {
    try {
        const cursos = await obterCursos();
        console.log('Cursos disponíveis:', cursos);
        
        // Atualizar UI
        cursos.forEach(curso => {
            console.log(`${curso.id}: ${curso.nome}`);
        });
    } catch (erro) {
        console.error('Erro:', erro);
    }
}
```

### Criar novo curso (Admin)

```javascript
import { criarCurso } from '/script/api.js';

async function novosCurso() {
    try {
        const resultado = await criarCurso(
            'Programação Web',
            'progweb',
            'senha123'
        );
        
        if (resultado.sucesso) {
            console.log('Curso criado com ID:', resultado.id);
        }
    } catch (erro) {
        console.error('Erro ao criar curso:', erro);
    }
}
```

---

## 📝 Conteúdos

### Carregar conteúdos de um curso

```javascript
import { obterConteudos } from '/script/api.js';

// Exemplo: Conteúdos de DS, 1º ano, 1º bimestre
async function carregarConteudosCurso() {
    try {
        const conteudos = await obterConteudos('ds', 1, 1);
        
        conteudos.forEach(conteudo => {
            console.log(`${conteudo.titulo} (${conteudo.tipo})`);
        });
    } catch (erro) {
        console.error('Erro:', erro);
    }
}
```

### Adicionar conteúdo

```javascript
import { adicionarConteudo } from '/script/api.js';

async function novoConteudo() {
    try {
        const resultado = await adicionarConteudo(
            'ds',           // curso
            1,              // ano
            1,              // bimestre
            'Arrays em JavaScript',  // titulo
            'Aprenda sobre arrays, métodos e iteração',  // descricao
            'conteudo'      // tipo: 'conteudo' ou 'atividade'
        );
        
        if (resultado.sucesso) {
            console.log('Conteúdo adicionado!');
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }
}
```

---

## ✅ Atividades

### Obter atividades de um conteúdo

```javascript
import { obterAtividades } from '/script/api.js';

async function listarAtividades() {
    try {
        // Obter atividades do conteúdo com ID 1
        const atividades = await obterAtividades(1);
        
        atividades.forEach(atividade => {
            console.log(`${atividade.titulo} - Prazo: ${atividade.prazo}`);
        });
    } catch (erro) {
        console.error('Erro:', erro);
    }
}
```

### Adicionar atividade

```javascript
import { adicionarAtividade } from '/script/api.js';

async function novaAtividade() {
    try {
        const resultado = await adicionarAtividade(
            1,                                  // conteudo_id
            'Exercício de Arrays',              // titulo
            'Faça 10 exercícios sobre arrays',  // descricao
            '2026-12-31 23:59:59'              // prazo
        );
        
        if (resultado.sucesso) {
            console.log('Atividade criada!');
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }
}
```

---

## 🔧 Função Genérica de API

Se precisar fazer requisições customizadas:

```javascript
import { chamarAPI } from '/script/api.js';

// GET
async function exemploGET() {
    const resultado = await chamarAPI('/cursos', 'GET');
    console.log(resultado);
}

// POST
async function exemploPOST() {
    const resultado = await chamarAPI('/conteudos', 'POST', {
        curso: 'ds',
        ano: 1,
        bimestre: 1,
        titulo: 'Novo Tópico',
        descricao: 'Descrição do tópico'
    });
    console.log(resultado);
}
```

---

## 💡 Exemplo Completo: Carregar e Exibir Conteúdo

```html
<!DOCTYPE html>
<html>
<head>
    <title>Conteúdos DS - 1º Ano</title>
</head>
<body>
    <div id="conteudos"></div>

    <script type="module">
        import { obterConteudos } from '/script/api.js';

        async function mostrarConteudos() {
            const conteudos = await obterConteudos('ds', 1, 1);
            const container = document.getElementById('conteudos');

            conteudos.forEach(con => {
                container.innerHTML += `
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                        <h3>${con.titulo}</h3>
                        <p>${con.descricao}</p>
                        <small>Tipo: ${con.tipo}</small>
                    </div>
                `;
            });
        }

        mostrarConteudos();
    </script>
</body>
</html>
```

---

## 🛠️ Tratamento de Erros

```javascript
import { chamarAPI } from '/script/api.js';

async function exemploComErro() {
    try {
        const resultado = await chamarAPI('/conteudos', 'GET');
        console.log('Sucesso:', resultado);
    } catch (erro) {
        console.error('❌ Erro da API:', erro.message);
        
        // Mostrar para o usuário
        alert('Erro: ' + erro.message);
    }
}
```

---

## 🔍 Verificar Conexão

```javascript
import { verificarSaudeBD } from '/script/api.js';

async function testarConexao() {
    const conectado = await verificarSaudeBD();
    
    if (conectado) {
        console.log('✅ Servidor respondendo normalmente');
    } else {
        console.log('❌ Servidor não está acessível');
    }
}
```

---

## 🧠 Dicas Importantes

1. **Sempre use try/catch** ao chamar a API
2. **Verifique se está logado** antes de operações sensíveis:
   ```javascript
   if (!estaLogado()) {
       window.location.href = '/jl/pj/pj.html';
   }
   ```

3. **Use `type="module"`** nas tags script para importar as funções
4. **Abra o console** (F12) para ver mensagens de erro
5. **Verifique o .env** se a conexão falhar

---

## 📱 Exemplo: Formulário de Login

```html
<form onsubmit="handleLogin(event)">
    <input type="text" id="usuario" placeholder="Usuário" required>
    <input type="password" id="senha" placeholder="Senha" required>
    <button type="submit">Entrar</button>
</form>

<script type="module">
    import { fazerLoginAPI } from '/script/api.js';

    window.handleLogin = async function(event) {
        event.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        try {
            const resultado = await fazerLoginAPI(usuario, senha);
            console.log('Login bem-sucedido!');
            // Redirecionar ou atualizar página
        } catch (erro) {
            alert('Erro: ' + erro.message);
        }
    }
</script>
```

---

Sucesso! 🎉 Agora você sabe como usar a API do seu projeto!
