import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import pool from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar variáveis de ambiente
dotenv.config();

// Configurar diretório
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../')));

// ROTAS DE AUTENTICAÇÃO

// Login de usuários
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ 
        sucesso: false, 
        mensagem: 'Usuário e senha são obrigatórios' 
      });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, usuario, tipo FROM usuarios WHERE usuario = ? AND senha = SHA2(?, 256)',
      [usuario, senha]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ 
        sucesso: false, 
        mensagem: 'Usuário ou senha incorretos' 
      });
    }

    const usuarioData = rows[0];
    res.json({ 
      sucesso: true,
      id: usuarioData.id,
      usuario: usuarioData.usuario,
      tipo: usuarioData.tipo,
      mensagem: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro no servidor' 
    });
  }
});

// Cadastrar novo usuário
app.post('/api/auth/cadastro', async (req, res) => {
  try {
    const { usuario, senha, tipo = 'aluno' } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ 
        sucesso: false, 
        mensagem: 'Usuário e senha são obrigatórios' 
      });
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.execute(
        'INSERT INTO usuarios (usuario, senha, tipo) VALUES (?, SHA2(?, 256), ?)',
        [usuario, senha, tipo]
      );
      connection.release();
      
      res.json({ 
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso'
      });
    } catch (error) {
      connection.release();
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          sucesso: false, 
          mensagem: 'Usuário já existe' 
        });
      }
      throw error;
    }

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro no servidor' 
    });
  }
});

// ROTAS DE CURSOS

// Obter todos os cursos
app.get('/api/cursos', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM cursos');
    connection.release();

    res.json({ 
      sucesso: true,
      cursos: rows
    });

  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao buscar cursos' 
    });
  }
});

// Criar novo curso (admin)
app.post('/api/cursos', async (req, res) => {
  try {
    const { nome, usuario, senha } = req.body;

    if (!nome || !usuario || !senha) {
      return res.status(400).json({ 
        sucesso: false, 
        mensagem: 'Nome, usuário e senha são obrigatórios' 
      });
    }

    const connection = await pool.getConnection();
    const result = await connection.execute(
      'INSERT INTO cursos (nome, usuario, senha) VALUES (?, ?, SHA2(?, 256))',
      [nome, usuario, senha]
    );
    connection.release();

    res.json({ 
      sucesso: true,
      id: result[0].insertId,
      mensagem: 'Curso criado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao criar curso' 
    });
  }
});

// ROTAS DE CONTEÚDOS

// Obter conteúdos por curso e bimestre
app.get('/api/conteudos/:curso/:ano/:bimestre', async (req, res) => {
  try {
    const { curso, ano, bimestre } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM conteudos WHERE curso = ? AND ano = ? AND bimestre = ?',
      [curso, ano, bimestre]
    );
    connection.release();

    res.json({ 
      sucesso: true,
      conteudos: rows
    });

  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao buscar conteúdos' 
    });
  }
});

// Adicionar conteúdo (admin/professor)
app.post('/api/conteudos', async (req, res) => {
  try {
    const { curso, ano, bimestre, titulo, descricao, tipo = 'conteudo' } = req.body;

    if (!curso || !ano || !bimestre || !titulo) {
      return res.status(400).json({ 
        sucesso: false, 
        mensagem: 'Campos obrigatórios faltando' 
      });
    }

    const connection = await pool.getConnection();
    const result = await connection.execute(
      'INSERT INTO conteudos (curso, ano, bimestre, titulo, descricao, tipo) VALUES (?, ?, ?, ?, ?, ?)',
      [curso, ano, bimestre, titulo, descricao, tipo]
    );
    connection.release();

    res.json({ 
      sucesso: true,
      id: result[0].insertId,
      mensagem: 'Conteúdo adicionado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao adicionar conteúdo:', error);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao adicionar conteúdo' 
    });
  }
});

// ROTAS DE ATIVIDADES

// Obter atividades por conteúdo
app.get('/api/atividades/:conteudo_id', async (req, res) => {
  try {
    const { conteudo_id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM atividades WHERE conteudo_id = ?',
      [conteudo_id]
    );
    connection.release();

    res.json({ 
      sucesso: true,
      atividades: rows
    });

  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao buscar atividades' 
    });
  }
});

// Adicionar atividade
app.post('/api/atividades', async (req, res) => {
  try {
    const { conteudo_id, titulo, descricao, prazo } = req.body;

    if (!conteudo_id || !titulo) {
      return res.status(400).json({ 
        sucesso: false, 
        mensagem: 'Conteúdo ID e título são obrigatórios' 
      });
    }

    const connection = await pool.getConnection();
    const result = await connection.execute(
      'INSERT INTO atividades (conteudo_id, titulo, descricao, prazo) VALUES (?, ?, ?, ?)',
      [conteudo_id, titulo, descricao, prazo]
    );
    connection.release();

    res.json({ 
      sucesso: true,
      id: result[0].insertId,
      mensagem: 'Atividade adicionada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao adicionar atividade:', error);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao adicionar atividade' 
    });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    
    res.json({ 
      sucesso: true,
      mensagem: 'Servidor conectado ao banco de dados'
    });
  } catch (error) {
    console.error('Erro na verificação de saúde:', error);
    res.status(500).json({ 
      sucesso: false,
      mensagem: 'Erro ao conectar ao banco de dados'
    });
  }
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ 
    sucesso: false,
    mensagem: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

export default app;
