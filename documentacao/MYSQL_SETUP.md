# Configuração do MySQL - SIGA MCVM

## 📋 Pré-requisitos

- **MySQL 8.0+** instalado em seu computador
- **Node.js 16+** instalado
- **npm** ou **yarn**

---

## 🚀 Passo 1: Instalar Dependências Node.js

Na raiz do projeto, execute:

```bash
npm install
```

Isso vai instalar:
- `express` - Framework web
- `mysql2` - Driver MySQL
- `cors` - Permitir requisições do frontend
- `dotenv` - Variáveis de ambiente
- `body-parser` - Parser de JSON
- `nodemon` - Auto-reload em desenvolvimento

---

## 🗄️ Passo 2: Criar Banco de Dados MySQL

### Opção A: Usando MySQL Workbench ou phpMyAdmin

1. Abra seu cliente MySQL
2. Copie todo o conteúdo do arquivo **`backend/schema.sql`**
3. Cole em uma nova query
4. Execute (Ctrl+Shift+Enter ou ⌘+Shift+Enter)

### Opção B: Usando Terminal/Prompt

```bash
# Conectar ao MySQL
mysql -u root -p

# Colar todo o conteúdo do arquivo backend/schema.sql
```

---

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

Edite o arquivo **`.env`** na raiz do projeto:

```env
# Configuração do Banco de Dados MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=siga_mcvm
DB_PORT=3306

# Configuração do Servidor
PORT=3000
NODE_ENV=development
```

**Substitua `sua_senha_aqui` pela senha do seu MySQL!**

---

## 🔓 Dados de Acesso Padrão (Após Executar schema.sql)

### Usuários de Teste:

| Usuário | Senha | Tipo |
|---------|-------|------|
| `admin` | `admin123` | Admin |
| `aluno1` | `senha123` | Aluno |
| `professor1` | `prof123` | Professor |

### Cursos Administrativos:

| Usuário | Senha | Curso |
|---------|-------|-------|
| `ds` | `ds123` | Desenvolvimento de Sistemas |
| `qm` | `qm123` | Química |
| `sec` | `sec123` | Secretariado |
| `log` | `log123` | Logística |
| `tex` | `tex123` | Têxtil |

---

## 🖥️ Passo 4: Iniciar o Servidor

### Modo Desenvolvimento (Com Auto-reload):

```bash
npm run dev
```

### Modo Produção:

```bash
npm start
```

O servidor iniciará em: **http://localhost:3000**

---

## ✅ Verificar Conexão

1. Abra no navegador: `http://localhost:3000/api/health`
2. Você deve ver:
```json
{
  "sucesso": true,
  "mensagem": "Servidor conectado ao banco de dados"
}
```

Se receber erro, verifique:
- O MySQL está rodando?
- As credenciais no `.env` estão corretas?
- O banco de dados foi criado?

---

## 🌐 Acessar a Aplicação

1. Abra o navegador em: **`http://localhost:3000/html/index.html`**
2. Para acessar o painel administrativo: **`http://localhost:3000/jl/pj/pj.html`**

---

## 🔌 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/cadastro` - Registrar novo usuário

### Cursos
- `GET /api/cursos` - Listar todos os cursos
- `POST /api/cursos` - Criar novo curso

### Conteúdos
- `GET /api/conteudos/:curso/:ano/:bimestre` - Obter conteúdos
- `POST /api/conteudos` - Adicionar conteúdo

### Atividades
- `GET /api/atividades/:conteudo_id` - Listar atividades
- `POST /api/atividades` - Criar atividade

### Saúde
- `GET /api/health` - Verificar conexão com BD

---

## 🐛 Troubleshooting

### Erro: "Connect ECONNREFUSED 127.0.0.1:3306"
- MySQL não está rodando
- Verifique as credenciais no `.env`

### Erro: "ER_NO_DB_ERROR"
- O banco de dados não existe
- Execute o `schema.sql`

### Erro: "CORS error"
- Verifique se o servidor está rodando em `http://localhost:3000`

### Erro: "Module not found"
- Execute `npm install` novamente

---

## 📚 Estrutura do Projeto

```
Projeto-Final-1-Temporada/
├── backend/
│   ├── server.js          # Servidor Express com API
│   ├── db.js              # Configuração do MySQL
│   └── schema.sql         # Script para criar BD
├── html/
│   ├── index.html         # Página principal
│   ├── conteudos/         # Conteúdos por curso
│   └── ...
├── script/
│   ├── api.js             # Funções para chamar API
│   ├── script.js          # Scripts gerais
│   └── ...
├── jl/
│   └── pj/                # Painel administrativo
│       ├── pj.html
│       ├── pj.js
│       └── pj.css
├── css/                   # Estilos
├── package.json           # Dependências Node.js
├── .env                   # Variáveis de ambiente
└── README.md

```

---

## 🎉 Sucesso!

Seu projeto está pronto para usar com MySQL! 🚀

Dúvidas? Verifique o console do servidor para mensagens de erro detalhadas.
