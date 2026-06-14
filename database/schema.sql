CREATE DATABASE IF NOT EXISTS escola
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE escola;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(60) NOT NULL UNIQUE,
  senha VARCHAR(120) NOT NULL,
  nome VARCHAR(120) NOT NULL,
  nome_curso VARCHAR(120) NOT NULL,
  nome_professor VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  pagina VARCHAR(180) NOT NULL DEFAULT '/jl/pc/painelCurso.html',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SET @coluna_pagina_existe = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'admins'
    AND COLUMN_NAME = 'pagina'
);

SET @sql_adicionar_pagina = IF(
  @coluna_pagina_existe = 0,
  'ALTER TABLE admins ADD COLUMN pagina VARCHAR(180) NOT NULL DEFAULT ''/jl/pc/painelCurso.html''',
  'SELECT 1'
);

PREPARE stmt_adicionar_pagina FROM @sql_adicionar_pagina;
EXECUTE stmt_adicionar_pagina;
DEALLOCATE PREPARE stmt_adicionar_pagina;

CREATE TABLE IF NOT EXISTS conteudos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_usuario VARCHAR(60) NOT NULL,
  serie TINYINT NOT NULL,
  bimestre TINYINT NOT NULL,
  tipo ENUM('conteudo', 'atividade') NOT NULL,
  assunto VARCHAR(180) NOT NULL DEFAULT '',
  link VARCHAR(500) NOT NULL DEFAULT '',
  texto TEXT NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_conteudo (curso_usuario, serie, bimestre, tipo),
  CONSTRAINT fk_conteudos_admin
    FOREIGN KEY (curso_usuario)
    REFERENCES admins (usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO admins (usuario, senha, nome, nome_curso, nome_professor, email, pagina)
VALUES
  ('DS', '123', 'Lea', 'Desenvolvimento de Sistemas', 'Lea', 'ds@escola.com', '/jl/pc/painelCurso.html'),
  ('QM', '456', 'Professor Quimica', 'Quimica', 'Professor Quimica', 'quimica@escola.com', '/jl/pc/painelCurso.html'),
  ('LOG', '789', 'Professor Logistica', 'Logistica', 'Professor Logistica', 'logistica@escola.com', '/jl/pc/painelCurso.html'),
  ('TEX', '101', 'Professor Textil', 'Textil', 'Professor Textil', 'textil@escola.com', '/jl/pc/painelCurso.html'),
  ('SEC', '202', 'Professor Secretariado', 'Secretariado', 'Professor Secretariado', 'secretariado@escola.com', '/jl/pc/painelCurso.html')
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  nome_curso = VALUES(nome_curso),
  nome_professor = VALUES(nome_professor),
  email = VALUES(email),
  pagina = VALUES(pagina);
