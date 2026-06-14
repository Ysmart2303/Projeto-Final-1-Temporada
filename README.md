# SIGA MCVM

Projeto web criado em 2026 para ser um **Sistema Integrado de Gestão Acadêmica (S.I.G.A.)** focado na navegação por cursos, séries e bimestres.

---

## Resumo do projeto
O SIGA MCVM é uma aplicação (front-end em páginas estáticas) que permite ao usuário:
- Selecionar um **curso** (DS, Química, Secretariado, Logística e Têxtil).
- Selecionar a **série** (1º, 2º e 3º ano).
- Navegar pelos **bimestres** (1º a 4º bimestre) direcionando para as páginas de conteúdo do curso.
- Usar um **tema Dark/Light**, controlado por CSS e persistido no navegador via `localStorage`.

---

## Linguagens e tecnologias usadas
### Front-end
- **HTML**: estrutura das telas e navegação.
- **CSS**: estilos do layout, cards (“quadros”), rodapé, e sistema de tema (variáveis CSS em `:root` e `html[data-theme="light"]`).
- **JavaScript** (no navegador): lógica de navegação (curso/série/bimestre), controle de telas com `hidden`, alternância do tema e comportamento da sidebar.

Principais arquivos do front-end:
- `html/index.html`
- `script/script.js`
- `css/style.css`
- `html/conteudos/*` (páginas de conteúdo por curso e bimestre)

### Backend (API) {Ainda fazendo}
- **Node.js** com **Express**
- **MySQL** via **mysql2**
- **CORS** para permitir chamadas da API
- **Docker Compose** para subir um MySQL local do projeto

Principais arquivos do backend:
- `backend/server.js`
- `backend/package.json`
- `docker-compose.yml`
- `database/schema.sql`

---

## Como rodar com banco local

1. Suba o MySQL local do projeto:

```bash
docker compose up -d
```

2. Inicie a API:

```bash
cd backend
npm install
npm start
```

3. Abra o site pelo servidor Node:

```text
http://localhost:3000
```

O banco usa estes dados padrao:

```text
host: 127.0.0.1
porta: 3307
usuario: root
senha: admin
banco: escola
```

Logins iniciais:

```text
DS / 123
QM / 456
LOG / 789
TEX / 101
SEC / 202
```

Se precisar recriar o banco do zero, rode:

```bash
docker compose down -v
docker compose up -d
```

---

## Funcionalidades (visão geral)
1. **Navegação por etapas**
   - Curso → Série → Bimestre.
   - O JavaScript mantém variáveis globais (`cursoSelecionado`, `anoSelecionado`, `bimestreSelecionado`) e monta a URL para carregar a página correta do conteúdo.

2. **Controle de telas**
   - As seções do `index.html` são alternadas adicionando/removendo a classe `hidden`.
   - A página também tenta ler parâmetros de URL (`curso`, `ano`, `bimestre`) para mostrar o trecho correto ao entrar em uma tela de conteúdo.

3. **Tema Dark/Light**
   - Alternância do tema via `document.documentElement.dataset.theme`.
   - Persistência no `localStorage`.
   - Botão fica na **sidebar** (overlay + aside) com abertura/fechamento por JS.

---

## Estrutura do repositório (principais pastas)
- `html/`: páginas do site.
  - `html/conteudos/`: páginas de conteúdos por curso (ex.: `conDS.html`, `conQm.html` etc.).
  - `html/creditos.html`: créditos.
- `css/`: estilos por página (ex.: `style.css`, além de arquivos específicos de login/conteúdo).
- `script/`: scripts do front-end (`script.js`).
- `backend/`: API em Node/Express com integração ao MySQL.
- `img/`: imagens e logotipos usados na interface.

---

## Observações

- A interface foi pensada para uso em navegador, com componentes reutilizados (cards/quadros) e experiência visual consistente via CSS.
