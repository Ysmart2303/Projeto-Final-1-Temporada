# 🚀 Guia de Deployment - SIGA MCVM

Este arquivo contém instruções para colocar seu projeto em produção.

---

## 📋 Antes de Fazer Deploy

### Checklist de Segurança

- [ ] `.env` não está commitado no Git
- [ ] `.gitignore` inclui `.env` e `node_modules/`
- [ ] Senhas de teste foram alteradas
- [ ] Banco de dados de produção está configurado
- [ ] CORS está restrito a domínios permitidos
- [ ] Validação de entrada está implementada
- [ ] HTTPS está habilitado

---

## 🖥️ Opção 1: Deploy em VPS/Servidor Próprio

### Pré-requisitos
- Servidor Linux (Ubuntu recomendado)
- Node.js 16+ instalado
- MySQL 8.0+ instalado
- Nginx ou Apache (para proxy reverso)
- SSL/TLS (Letsencrypt)

### Passos

#### 1. Clonar Repositório
```bash
cd /var/www
git clone seu-repositorio.git siga-mcvm
cd siga-mcvm
```

#### 2. Instalar Dependências
```bash
npm install --production
```

#### 3. Configurar .env de Produção
```bash
nano .env
```

```env
DB_HOST=localhost
DB_USER=siga_user
DB_PASSWORD=senha_muito_segura_aqui
DB_NAME=siga_mcvm_prod
DB_PORT=3306
PORT=3000
NODE_ENV=production
```

#### 4. Criar Banco de Dados
```bash
mysql -u root -p < backend/schema.sql
```

#### 5. Usar PM2 para Gerenciar Processo
```bash
npm install -g pm2
pm2 start backend/server.js --name "siga-mcvm"
pm2 startup
pm2 save
```

#### 6. Configurar Nginx como Proxy Reverso
```bash
sudo nano /etc/nginx/sites-available/siga-mcvm
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 7. Habilitar Certificado SSL
```bash
sudo certbot certonly --nginx -d seu-dominio.com
```

---

## ☁️ Opção 2: Deploy em Heroku

### Pré-requisitos
- Conta Heroku
- Heroku CLI instalado
- Aplicação Heroku criada

### Passos

#### 1. Criar arquivo `Procfile`
```
web: node backend/server.js
```

#### 2. Adicionar Scripts ao package.json
```json
"scripts": {
  "start": "node backend/server.js",
  "dev": "nodemon backend/server.js"
}
```

#### 3. Fazer Login no Heroku
```bash
heroku login
```

#### 4. Adicionar MySQL (ClearDB)
```bash
heroku addons:create cleardb:ignite
heroku config:get CLEARDB_DATABASE_URL
```

#### 5. Configurar Variáveis de Ambiente
```bash
heroku config:set DB_HOST=sua-host
heroku config:set DB_USER=seu-user
heroku config:set DB_PASSWORD=sua-senha
heroku config:set DB_NAME=siga_mcvm
heroku config:set NODE_ENV=production
```

#### 6. Fazer Deploy
```bash
git push heroku main
```

---

## 🐳 Opção 3: Deploy com Docker

### Dockerfile
```dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "backend/server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: root123
      DB_NAME: siga_mcvm
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: siga_mcvm
    volumes:
      - ./backend/schema.sql:/docker-entrypoint-initdb.d/schema.sql
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### Build e Run
```bash
docker-compose up --build
```

---

## 📊 Opção 4: Deploy em Render

### Passos Rápidos

1. Criar repositório no GitHub com o projeto
2. Conectar a conta Render
3. Criar novo serviço Web
4. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Adicionar variáveis de ambiente
6. Deploy automático ao fazer push

---

## 🔒 Segurança em Produção

### Essencial

```javascript
// Em server.js - Adicionar validação

// 1. Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de requisições
});
app.use('/api/', limiter);

// 2. Helmet para headers seguros
const helmet = require('helmet');
app.use(helmet());

// 3. CORS restritivo
app.use(cors({
  origin: 'https://seu-dominio.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 4. Validação de entrada
const { body, validationResult } = require('express-validator');
```

### Banco de Dados

```bash
# Criar usuário específico (não usar root)
CREATE USER 'siga_user'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON siga_mcvm.* TO 'siga_user'@'localhost';
FLUSH PRIVILEGES;
```

### Variáveis de Ambiente
- Nunca commitar `.env`
- Usar gerenciadores de secrets (AWS Secrets Manager, Hashicorp Vault)
- Rotacionar credenciais regularmente

---

## 📈 Monitoramento

### PM2 Monitoring
```bash
npm install -g pm2
pm2 plus  # Dashboard web
```

### Logs
```bash
pm2 logs siga-mcvm
pm2 save logs
```

### Health Check
```javascript
// Monitorar em: /api/health
app.get('/api/health', async (req, res) => {
  // Verifica conexão com BD
  // Retorna status do servidor
});
```

---

## 🔄 CI/CD com GitHub Actions

### `.github/workflows/deploy.yml`
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Heroku
        run: git push heroku main
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
```

---

## 📊 Performance

### Otimizações Recomendadas

1. **Caching**
```javascript
app.use(require('express-redis-cache')({
  host: 'localhost',
  port: 6379,
  auth_pass: 'seu_password'
}));
```

2. **Compressão**
```javascript
const compression = require('compression');
app.use(compression());
```

3. **Database Connection Pooling**
Já implementado em `db.js`

4. **CDN para Arquivos Estáticos**
Usar Cloudflare ou AWS CloudFront

---

## 📝 Checklist de Deploy

- [ ] Código testado localmente
- [ ] `.env` configurado para produção
- [ ] HTTPS ativado
- [ ] CORS restritivo
- [ ] Rate limiting ativado
- [ ] Logs configurados
- [ ] Backup automático do BD
- [ ] Monitoramento ativado
- [ ] SSL certificate atualizado
- [ ] Domínio apontando corretamente

---

## 🚨 Rollback

Se algo der errado:

### Git
```bash
git revert <commit-id>
git push heroku main
```

### Docker
```bash
docker-compose down
docker-compose up  # Com versão anterior
```

### PM2
```bash
pm2 restart siga-mcvm
pm2 revert
```

---

## 📞 Suporte

Para dúvidas de deployment:
- Heroku Docs: https://devcenter.heroku.com/
- Docker Docs: https://docs.docker.com/
- PM2 Docs: https://pm2.keymetrics.io/

---

**Sucesso no deployment! 🚀**
