# ✅ Checklist de Configuração - SIGA MCVM

Use este guia para configurar seu projeto com MySQL passo a passo.

---

## 📋 Checklist de Instalação

### ✅ Pré-Requisitos
- [ ] Node.js 16+ instalado
- [ ] MySQL 8.0+ instalado
- [ ] npm instalado
- [ ] Cliente MySQL (MySQL Workbench, phpMyAdmin ou terminal)

### ✅ Passo 1: Dependências Node.js
```bash
npm install
```
- [ ] Comando executado sem erros
- [ ] Pasta `node_modules` criada
- [ ] `package-lock.json` gerado

### ✅ Passo 2: Configurar `.env`
- [ ] Arquivo `.env` localizado na raiz do projeto
- [ ] `DB_HOST` configurado (padrão: localhost)
- [ ] `DB_USER` configurado (padrão: root)
- [ ] `DB_PASSWORD` preenchido com sua senha MySQL
- [ ] `DB_NAME` é `siga_mcvm`
- [ ] `PORT` é `3000`

**Arquivo `.env` esperado:**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=siga_mcvm
DB_PORT=3306
PORT=3000
NODE_ENV=development
```

### ✅ Passo 3: Criar Banco de Dados MySQL
- [ ] Abrir cliente MySQL (Workbench, phpMyAdmin ou terminal)
- [ ] Conectar com user `root` e a senha configurada
- [ ] Copiar conteúdo de `backend/schema.sql`
- [ ] Executar o script SQL completo
- [ ] Verificar se banco `siga_mcvm` foi criado
- [ ] Verificar se tabelas foram criadas:
  - [ ] `usuarios`
  - [ ] `cursos`
  - [ ] `conteudos`
  - [ ] `atividades`
  - [ ] `submissoes`

**Verificação:**
```sql
USE siga_mcvm;
SHOW TABLES;
-- Deve listar as 5 tabelas
```

### ✅ Passo 4: Iniciar o Servidor
```bash
npm run dev
```
- [ ] Servidor iniciado sem erros
- [ ] Mensagem apareceu: "✅ Servidor rodando em http://localhost:3000"
- [ ] Sem mensagens de erro no console

### ✅ Passo 5: Verificar Conexão com BD
- [ ] Abrir navegador em: `http://localhost:3000/api/health`
- [ ] Resposta esperada:
```json
{
  "sucesso": true,
  "mensagem": "Servidor conectado ao banco de dados"
}
```

### ✅ Passo 6: Acessar Aplicação
- [ ] Página principal: http://localhost:3000/html/index.html
  - Deve mostrar tela de seleção de cursos
- [ ] Painel admin: http://localhost:3000/jl/pj/pj.html
  - Deve mostrar tela de login

### ✅ Passo 7: Testar Login
- [ ] Abrir painel admin
- [ ] Usar credenciais padrão:
  - **Usuário:** `admin`
  - **Senha:** `admin123`
- [ ] [ ] Login bem-sucedido

### ✅ Passo 8: Testar API com Testador
- [ ] Abrir em navegador: http://localhost:3000/api-tester.html
- [ ] [ ] Testar "Verificar Conexão com BD"
- [ ] [ ] Testar "Fazer Login"
- [ ] [ ] Testar "Listar Cursos"
- [ ] [ ] Testar "Obter Conteúdos"

---

## 🔧 Verificação de Dependências

Execute para verificar se tudo está instalado:

```bash
node --version          # Deve ser v16 ou superior
npm --version           # Deve ser v7 ou superior
mysql --version         # Deve ser v8 ou superior
```

---

## 🐛 Troubleshooting Durante a Configuração

### Problema: "npm: command not found"
**Solução:** Node.js não está instalado. Baixe em https://nodejs.org

### Problema: "Connect ECONNREFUSED 127.0.0.1:3306"
**Solução:**
1. Certifique-se que MySQL está rodando
2. Verifique credenciais no `.env`
3. Teste conexão: `mysql -u root -p`

### Problema: "ER_NO_DB_ERROR"
**Solução:**
1. Verifique se schema.sql foi executado
2. Execute novamente: copie todo conteúdo de `backend/schema.sql`
3. Cole em um cliente MySQL e execute

### Problema: "CORS error in browser"
**Solução:**
1. Verifique se servidor está em http://localhost:3000
2. Verifique se arquivo `.env` tem PORT=3000
3. Reinicie o servidor (Ctrl+C e `npm run dev`)

### Problema: Arquivos não carregam (404)
**Solução:**
1. Verifique caminho dos arquivos HTML
2. Use caminhos absolutos começando com `/`
3. Exemplo: `/html/index.html` (não `html/index.html`)

---

## 📊 Verificação de Arquivos Criados

Após completar a configuração, você deve ter estes arquivos:

### Backend
- [ ] `backend/server.js` - Servidor Express
- [ ] `backend/db.js` - Conexão MySQL
- [ ] `backend/schema.sql` - Script do banco

### Configuração
- [ ] `package.json` - Dependências
- [ ] `.env` - Variáveis de ambiente
- [ ] `.gitignore` - Arquivos ignorados

### Frontend
- [ ] `script/api.js` - Cliente da API
- [ ] `script/carregarConteudos.js` - Carregar conteúdos
- [ ] `jl/pj/pj.html` - Painel admin
- [ ] `jl/pj/pj.js` - Scripts do painel

### Documentação
- [ ] `README.md` - Guia principal
- [ ] `MYSQL_SETUP.md` - Guia MySQL
- [ ] `EXEMPLOS-USO.md` - Exemplos de uso
- [ ] `CHECKLIST.md` - Este arquivo
- [ ] `api-tester.html` - Testador de API

---

## 🚀 Após Configuração

### Próximos Passos
1. [ ] Explore o painel administrativo
2. [ ] Crie novos cursos
3. [ ] Adicione conteúdos e atividades
4. [ ] Crie novos usuários
5. [ ] Teste a navegação de alunos

### Manutenção Regular
- [ ] Faça backup do banco de dados
- [ ] Monitore o arquivo `.env` (não comita no Git!)
- [ ] Atualize dependências periodicamente
- [ ] Verifique logs do servidor

---

## 📱 Testadores Recomendados

Para testar a API sem usar o frontend:

### Opção 1: Usando o arquivo `api-tester.html`
```
http://localhost:3000/api-tester.html
```
Interface web interativa para testar todos os endpoints.

### Opção 2: Usando Postman
1. Baixe em https://www.postman.com
2. Importe requisições manualmente
3. Teste cada endpoint

### Opção 3: Usando curl (terminal)
```bash
# Testar conexão
curl http://localhost:3000/api/health

# Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"admin123"}'

# Listar cursos
curl http://localhost:3000/api/cursos
```

---

## 🎯 Objetivos de Aprendizado

Após concluir esta configuração, você aprenderá:

- ✅ Como conectar Node.js a MySQL
- ✅ Como criar uma API REST
- ✅ Como usar fetch() para chamar APIs
- ✅ Como gerenciar dados em um banco relacional
- ✅ Como proteger senhas (criptografia)
- ✅ Como organizar um projeto full-stack

---

## 📞 Precisa de Ajuda?

1. **Erro específico?** Procure no console do navegador (F12)
2. **Dúvida sobre configuração?** Veja `MYSQL_SETUP.md`
3. **Como usar a API?** Veja `EXEMPLOS-USO.md`
4. **Testar endpoints?** Use `api-tester.html`

---

## ✨ Sucesso!

Se você completou todos os itens deste checklist, seu projeto está pronto para usar! 🎉

**Próximo passo:** Comece a desenvolver suas funcionalidades personalizadas!

---

**Data de conclusão:** ____/____ / ________

**Observações:** 
```
_____________________________________________________________________________

_____________________________________________________________________________

_____________________________________________________________________________
```
