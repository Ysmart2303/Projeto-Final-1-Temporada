#!/bin/bash
# 🧪 TESTES DE API - SIGA MCVM
# Execute estes comandos no terminal para testar a API
# Windows: Use PowerShell ou instale Git Bash
# Linux/Mac: Use Terminal normalmente

# ⚠️  CERTIFIQUE-SE QUE O SERVIDOR ESTÁ RODANDO PRIMEIRO!
# npm run dev

echo "════════════════════════════════════════════════════════════════"
echo "🧪 TESTES DE API - SIGA MCVM"
echo "════════════════════════════════════════════════════════════════"
echo ""

# 1️⃣  TESTE DE CONEXÃO COM BD
echo "1️⃣  Testando conexão com banco de dados..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET http://localhost:3000/api/health
echo ""
echo ""

# 2️⃣  LOGIN
echo "2️⃣  Testando login..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"admin123"}'
echo ""
echo ""

# 3️⃣  CADASTRO DE NOVO USUÁRIO
echo "3️⃣  Testando cadastro de novo usuário..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X POST http://localhost:3000/api/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{"usuario":"teste_user","senha":"teste123"}'
echo ""
echo ""

# 4️⃣  LISTAR CURSOS
echo "4️⃣  Listando todos os cursos..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET http://localhost:3000/api/cursos
echo ""
echo ""

# 5️⃣  CRIAR NOVO CURSO
echo "5️⃣  Criando novo curso..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X POST http://localhost:3000/api/cursos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Programação Web","usuario":"progweb","senha":"web123"}'
echo ""
echo ""

# 6️⃣  OBTER CONTEÚDOS
echo "6️⃣  Obtendo conteúdos de DS - Ano 1 - Bimestre 1..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET http://localhost:3000/api/conteudos/ds/1/1
echo ""
echo ""

# 7️⃣  CRIAR CONTEÚDO
echo "7️⃣  Criando novo conteúdo..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X POST http://localhost:3000/api/conteudos \
  -H "Content-Type: application/json" \
  -d '{
    "curso":"ds",
    "ano":1,
    "bimestre":1,
    "titulo":"Introdução a JavaScript",
    "descricao":"Aprenda os conceitos básicos de JavaScript",
    "tipo":"conteudo"
  }'
echo ""
echo ""

# 8️⃣  OBTER ATIVIDADES
echo "8️⃣  Obtendo atividades do conteúdo ID 1..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET http://localhost:3000/api/atividades/1
echo ""
echo ""

# 9️⃣  CRIAR ATIVIDADE
echo "9️⃣  Criando nova atividade..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X POST http://localhost:3000/api/atividades \
  -H "Content-Type: application/json" \
  -d '{
    "conteudo_id":1,
    "titulo":"Exercício 1: Variáveis",
    "descricao":"Crie 5 variáveis diferentes",
    "prazo":"2026-12-31 23:59:59"
  }'
echo ""
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "✅ TESTES CONCLUÍDOS!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "💡 DICA: Se receber erros, verifique:"
echo "  1. O servidor está rodando? (npm run dev)"
echo "  2. MySQL está online?"
echo "  3. Schema.sql foi executado?"
echo "  4. Variáveis de ambiente estão corretas? (cat .env)"
