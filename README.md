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

## ⚙️ Configuração

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
