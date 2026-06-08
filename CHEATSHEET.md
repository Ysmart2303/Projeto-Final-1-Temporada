╔════════════════════════════════════════════════════════════════════════╗
║                    📚 SIGA MCVM - CHEATSHEET RÁPIDO                    ║
║                         Referência Rápida de URLs                      ║
╚════════════════════════════════════════════════════════════════════════╝


🌐 URLS PRINCIPAIS
════════════════════════════════════════════════════════════════════════

Frontend:
  📍 http://localhost:3000/html/index.html
     └─ Página principal para alunos

  📍 http://localhost:3000/jl/pj/pj.html
     └─ Painel administrativo

  📍 http://localhost:3000/api-tester.html
     └─ Testador visual de API


API REST:
  📍 http://localhost:3000/api/health
     └─ Verificar conexão com BD

  📍 http://localhost:3000/api/cursos
     └─ Listar cursos


════════════════════════════════════════════════════════════════════════

⌨️  COMANDOS IMPORTANTES
════════════════════════════════════════════════════════════════════════

Instalar Dependências:
  $ npm install

Iniciar em Desenvolvimento (com hot-reload):
  $ npm run dev

Iniciar em Produção:
  $ npm start

Conectar ao MySQL (terminal):
  $ mysql -u root -p

Executar schema.sql:
  $ mysql -u root -p < backend/schema.sql

Testar API (curl):
  $ curl http://localhost:3000/api/health


════════════════════════════════════════════════════════════════════════

📁 DOCUMENTOS IMPORTANTES
════════════════════════════════════════════════════════════════════════

Para Começar:
  📄 QUICKSTART.txt ................. Início em 2 minutos
  📄 CHECKLIST.md .................. Passo a passo

Configuração:
  📄 MYSQL_SETUP.md ................ Guia MySQL detalhado
  📄 .env .......................... Credenciais (NÃO COMMITAR!)

Desenvolvimento:
  📄 EXEMPLOS-USO.md ............... Exemplos de código
  📄 api-tester.html ............... Tester visual
  📄 TESTES-API.sh ................. Testes via curl

Referência:
  📄 README.md ..................... Visão geral
  📄 ESTRUTURA.txt ................. Mapa do projeto
  📄 SUMARIO-FINAL.md .............. O que foi feito

Produção:
  📄 DEPLOYMENT.md ................. Deploy em produção


════════════════════════════════════════════════════════════════════════

🔐 CREDENCIAIS DE TESTE
════════════════════════════════════════════════════════════════════════

Usuários:
  👤 admin / admin123
  👤 aluno1 / senha123
  👤 professor1 / prof123

Cursos (Admin):
  🎓 ds / ds123 (Desenvolvimento de Sistemas)
  🎓 qm / qm123 (Química)
  🎓 sec / sec123 (Secretariado)
  🎓 log / log123 (Logística)
  🎓 tex / tex123 (Têxtil)


════════════════════════════════════════════════════════════════════════

📡 ENDPOINTS DA API
════════════════════════════════════════════════════════════════════════

Autenticação:
  POST /api/auth/login
    Input: { usuario: "admin", senha: "admin123" }

  POST /api/auth/cadastro
    Input: { usuario: "novo", senha: "123456" }

Cursos:
  GET /api/cursos
    Retorna: [{ id, nome, usuario, ... }]

  POST /api/cursos
    Input: { nome: "...", usuario: "...", senha: "..." }

Conteúdos:
  GET /api/conteudos/ds/1/1
    ├─ ds = curso
    ├─ 1 = ano
    └─ 1 = bimestre

  POST /api/conteudos
    Input: { curso, ano, bimestre, titulo, descricao }

Atividades:
  GET /api/atividades/1
    └─ 1 = conteudo_id

  POST /api/atividades
    Input: { conteudo_id, titulo, descricao, prazo }

Saúde:
  GET /api/health
    Retorna: { sucesso: true, mensagem: "..." }


════════════════════════════════════════════════════════════════════════

🔧 ARQUIVOS DE CONFIGURAÇÃO
════════════════════════════════════════════════════════════════════════

.env (Variáveis de Ambiente):
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=sua_senha
  DB_NAME=siga_mcvm
  PORT=3000

package.json (Dependências):
  - express 4.18.2
  - mysql2 3.6.0
  - cors 2.8.5
  - dotenv 16.3.1
  - body-parser 1.20.2
  - nodemon 3.0.1


════════════════════════════════════════════════════════════════════════

🧪 TESTES RÁPIDOS
════════════════════════════════════════════════════════════════════════

No Navegador:
  1. Abrir: http://localhost:3000/api-tester.html
  2. Clicar em "Verificar Conexão com BD"
  3. Fazer login com admin/admin123
  4. Listar cursos

Via curl (terminal):
  $ curl http://localhost:3000/api/health
  
  $ curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"usuario":"admin","senha":"admin123"}'

Via JavaScript (console F12):
  import { verificarSaudeBD } from '/script/api.js';
  await verificarSaudeBD();


════════════════════════════════════════════════════════════════════════

🔍 VERIFICAÇÃO DE STATUS
════════════════════════════════════════════════════════════════════════

✅ Servidor rodando:
  http://localhost:3000/api/health retorna sucesso

✅ Banco conectado:
  Mensagem "Servidor conectado ao banco de dados"

✅ Rotas funcionando:
  Tester em http://localhost:3000/api-tester.html

✅ Frontend funcionando:
  http://localhost:3000/html/index.html carrega


════════════════════════════════════════════════════════════════════════

💾 ARQUIVOS CRIADOS
════════════════════════════════════════════════════════════════════════

Backend (4):
  ✅ backend/server.js
  ✅ backend/db.js
  ✅ backend/schema.sql
  ✅ package.json

Frontend (3):
  ✅ script/api.js
  ✅ script/carregarConteudos.js
  ✅ jl/pj/pj.html (atualizado)

Configuração (2):
  ✅ .env
  ✅ .gitignore (atualizado)

Documentação (10):
  ✅ README.md
  ✅ MYSQL_SETUP.md
  ✅ EXEMPLOS-USO.md
  ✅ CHECKLIST.md
  ✅ RESUMO-SETUP.md
  ✅ DEPLOYMENT.md
  ✅ QUICKSTART.txt
  ✅ ESTRUTURA.txt
  ✅ SUMARIO-FINAL.md
  ✅ CHEATSHEET.md (este arquivo)

Testes (2):
  ✅ TESTES-API.sh
  ✅ api-tester.html


════════════════════════════════════════════════════════════════════════

🚀 CHECKLIST DE SETUP (5 min)
════════════════════════════════════════════════════════════════════════

  [ ] npm install
  [ ] Editar .env com senha MySQL
  [ ] Executar backend/schema.sql
  [ ] npm run dev
  [ ] Abrir http://localhost:3000/api/health


════════════════════════════════════════════════════════════════════════

📞 FLUXOGRAMA DE TROUBLESHOOTING
════════════════════════════════════════════════════════════════════════

Erro ao conectar MySQL?
  → Verificar se MySQL está rodando
  → Verificar credenciais em .env
  → Executar schema.sql novamente

Erro "Module not found"?
  → Executar: npm install

Erro CORS?
  → Verificar PORT=3000 em .env
  → Reiniciar servidor (Ctrl+C, npm run dev)

Página não carrega?
  → Verificar se server está rodando
  → Verificar console (F12)
  → Verificar caminhos dos arquivos


════════════════════════════════════════════════════════════════════════

🎯 ATALHOS ÚTEIS
════════════════════════════════════════════════════════════════════════

Abrir Console de Dev:     F12 ou Ctrl+Shift+I
Parar Servidor:            Ctrl+C (no terminal)
Iniciar Servidor:          npm run dev
Limpar Terminal:           clear (Mac/Linux) ou cls (Windows)
Ver IP Local:              ipconfig getifaddr en0 (Mac)
Testar API:                http://localhost:3000/api-tester.html


════════════════════════════════════════════════════════════════════════

📚 ORDEM RECOMENDADA DE LEITURA
════════════════════════════════════════════════════════════════════════

1º QUICKSTART.txt (5 min)
2º MYSQL_SETUP.md (15 min)
3º CHECKLIST.md (10 min)
4º EXEMPLOS-USO.md (20 min)
5º DEPLOYMENT.md (se for usar produção)


════════════════════════════════════════════════════════════════════════

✨ VOCÊ ESTÁ PRONTO! 🚀

Comece agora: npm install && npm run dev

════════════════════════════════════════════════════════════════════════
