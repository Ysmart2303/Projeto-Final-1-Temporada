# 🎓 SIGA MCVM - Sistema Integrado de Gestão Acadêmica

Um sistema completo para gerenciar cursos, conteúdos, atividades e usuários de uma escola técnica.

## ✨ Características

- ✅ **Gerenciamento de Cursos** - Crie e gerencie múltiplos cursos
- 👥 **Controle de Usuários** - Alunos, professores e administradores
- 📚 **Biblioteca de Conteúdos** - Organize conteúdos por curso, ano e bimestre
- ✏️ **Atividades e Avaliações** - Crie atividades com prazos
- 💾 **Banco de Dados MySQL** - Armazenamento seguro e escalável
- 🔐 **Autenticação Segura** - Senhas criptografadas com SHA2
- 🌐 **API REST** - Backend completo com Express.js
- 📱 **Interface Responsiva** - Funciona em desktop e mobile

---

## 🚀 Quick Start

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Configurar Banco de Dados
- Edite o arquivo `.env` com suas credenciais MySQL
- Execute o arquivo `backend/schema.sql` no seu cliente MySQL

### 3️⃣ Iniciar o Servidor
```bash
npm run dev
```

### 4️⃣ Acessar o Projeto
- **Página Principal**: http://localhost:3000/html/index.html
- **Painel Admin**: http://localhost:3000/jl/pj/pj.html

---

## 📖 Documentação

- 📋 **[MYSQL_SETUP.md](./MYSQL_SETUP.md)** - Guia completo de configuração do MySQL
- 💡 **[EXEMPLOS-USO.md](./EXEMPLOS-USO.md)** - Exemplos de uso da API

---

## 🗂️ Estrutura do Projeto

```
Projeto-Final-1-Temporada/
├── backend/
│   ├── server.js          # 🖥️ Servidor Express com API
│   ├── db.js              # 🔗 Conexão com MySQL
│   └── schema.sql         # 🗄️ Script para criar BD
├── html/
│   ├── index.html         # 🏠 Página principal
│   ├── creditos.html      # 👥 Créditos
│   ├── conteudos/         # 📚 Páginas de conteúdo
│   └── model.html         # 🎨 Template
├── script/
│   ├── api.js             # 🔌 Cliente da API
│   ├── script.js          # 📜 Scripts gerais
│   └── carregarConteudos.js  # 📖 Carregar conteúdos do BD
├── jl/
│   ├── pc/                # 🎓 Painel de cursos
│   └── pj/                # 🔑 Painel administrativo
├── css/                   # 🎨 Estilos
├── img/                   # 🖼️ Imagens
├── package.json           # 📦 Dependências
├── .env                   # ⚙️ Configurações
├── .gitignore            # 🚫 Arquivos ignorados
├── README.md             # 📄 Este arquivo
└── MYSQL_SETUP.md        # 🗄️ Guia MySQL
```

---

## 🔌 Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Fazer login |
| POST | `/api/auth/cadastro` | Registrar novo usuário |

### Cursos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/cursos` | Listar cursos |
| POST | `/api/cursos` | Criar curso |

### Conteúdos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/conteudos/:curso/:ano/:bimestre` | Obter conteúdos |
| POST | `/api/conteudos` | Criar conteúdo |

### Atividades
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/atividades/:conteudo_id` | Listar atividades |
| POST | `/api/atividades` | Criar atividade |

### Saúde
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Verificar conexão com BD |

---

## 👤 Usuários Padrão (Teste)

| Usuário | Senha | Tipo |
|---------|-------|------|
| `admin` | `admin123` | Admin |
| `aluno1` | `senha123` | Aluno |
| `professor1` | `prof123` | Professor |

**Cursos Administrativos:**

| Usuário | Senha | Curso |
|---------|-------|-------|
| `ds` | `ds123` | Desenvolvimento de Sistemas |
| `qm` | `qm123` | Química |
| `sec` | `sec123` | Secretariado |
| `log` | `log123` | Logística |
| `tex` | `tex123` | Têxtil |

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Banco de Dados**: MySQL 8.0+
- **Segurança**: SHA2 (criptografia de senhas)
- **API**: REST com CORS

---

## 📦 Dependências Principais

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "body-parser": "^1.20.2",
  "nodemon": "^3.0.1"
}
```

---

## ⚙️ Configuração

### Arquivo `.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=siga_mcvm
DB_PORT=3306
PORT=3000
NODE_ENV=development
```

---

## 🚀 Comandos Disponíveis

```bash
# Instalar dependências
npm install

# Modo desenvolvimento (com hot-reload)
npm run dev

# Modo produção
npm start
```

---

## 🐛 Troubleshooting

### Erro: "Connect ECONNREFUSED"
- Verifique se MySQL está rodando
- Confirme as credenciais no `.env`

### Erro: "ER_NO_DB_ERROR"
- Execute o arquivo `backend/schema.sql`

### Erro: "CORS Error"
- Certifique-se que o servidor está em `http://localhost:3000`

---

## 📚 Aprender Mais

- [Documentação MySQL](https://dev.mysql.com/doc/)
- [Express.js Guia](https://expressjs.com/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação em `MYSQL_SETUP.md`
2. Consulte os exemplos em `EXEMPLOS-USO.md`
3. Abra o console do navegador (F12) para ver erros
4. Verifique os logs do servidor no terminal

---

## 📝 Licença

Este projeto é de uso educacional. © 2024 MCVM

---

**Desenvolvido com ❤️ para gerenciar educação!** 🎓
