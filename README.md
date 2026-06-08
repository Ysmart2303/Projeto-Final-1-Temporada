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

## 🗂️ Estrutura do Projeto

```
Projeto-Final-1-Temporada/
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

## 📝 Licença

Este projeto é de uso educacional. © 2024 MCVM

---

**Desenvolvido com ❤️ para gerenciar educação!** 🎓
