-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS siga_mcvm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE siga_mcvm;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('aluno', 'professor', 'admin') DEFAULT 'aluno',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  usuario VARCHAR(100) UNIQUE,
  senha VARCHAR(255),
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de conteúdos
CREATE TABLE IF NOT EXISTS conteudos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso VARCHAR(50) NOT NULL,
  ano INT NOT NULL,
  bimestre INT NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  tipo ENUM('conteudo', 'atividade') DEFAULT 'conteudo',
  arquivo_url VARCHAR(500),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_curso_ano_bim (curso, ano, bimestre)
);

-- Tabela de atividades
CREATE TABLE IF NOT EXISTS atividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conteudo_id INT NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  prazo DATETIME,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE,
  INDEX idx_conteudo (conteudo_id)
);

-- Tabela de submissões de atividades
CREATE TABLE IF NOT EXISTS submissoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  atividade_id INT NOT NULL,
  usuario_id INT NOT NULL,
  arquivo_url VARCHAR(500),
  nota DECIMAL(5, 2),
  comentarios TEXT,
  submetido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  avaliado_em TIMESTAMP NULL,
  FOREIGN KEY (atividade_id) REFERENCES atividades(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_atividade (atividade_id),
  INDEX idx_usuario (usuario_id)
);

-- Inserir usuários de exemplo
INSERT INTO usuarios (usuario, senha, tipo) VALUES 
('admin', SHA2('admin123', 256), 'admin'),
('aluno1', SHA2('senha123', 256), 'aluno'),
('professor1', SHA2('prof123', 256), 'professor');

-- Inserir cursos
INSERT INTO cursos (nome, usuario, senha, descricao) VALUES 
('Desenvolvimento de Sistemas', 'ds', SHA2('ds123', 256), 'Curso de DS'),
('Química', 'qm', SHA2('qm123', 256), 'Curso de Química'),
('Secretariado', 'sec', SHA2('sec123', 256), 'Curso de Secretariado'),
('Logística', 'log', SHA2('log123', 256), 'Curso de Logística'),
('Têxtil', 'tex', SHA2('tex123', 256), 'Curso de Têxtil');

-- Inserir conteúdos de exemplo
INSERT INTO conteudos (curso, ano, bimestre, titulo, descricao, tipo) VALUES 
('ds', 1, 1, 'Introdução à Programação', 'Conceitos básicos de programação', 'conteudo'),
('ds', 1, 1, 'Primeira Atividade de DS', 'Atividade sobre variáveis', 'atividade'),
('qm', 1, 1, 'Tabela Periódica', 'Estudos dos elementos químicos', 'conteudo');
