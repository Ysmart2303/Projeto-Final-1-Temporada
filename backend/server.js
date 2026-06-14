const fs = require("fs");
const path = require("path");
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        const separator = trimmed.indexOf("=");
        if (separator === -1) continue;

        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = value;
    }
}

loadEnvFile(path.join(__dirname, ".env"));
loadEnvFile(path.join(__dirname, "..", ".env"));

const app = express();
const projectRoot = path.join(__dirname, "..");

app.use(cors());
app.use(express.json());
app.use(express.static(projectRoot));

const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "2303",
    database: process.env.DB_NAME || "escola",
    waitForConnections: true,
    connectionLimit: 10
});

function adminPublico(admin) {
    return {
        id: admin.id,
        usuario: admin.usuario,
        nome: admin.nome,
        nomeCurso: admin.nome_curso,
        nomeProfessor: admin.nome_professor,
        email: admin.email,
        pagina: admin.pagina,
        criadoEm: admin.criado_em
    };
}

async function testarConexao() {
    const connection = await pool.getConnection();
    try {
        await connection.ping();
        console.log("Conectado ao banco escola!");
    } finally {
        connection.release();
    }
}

app.get("/", (req, res) => {
    res.sendFile(path.join(projectRoot, "html", "index.html"));
});

app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ ok: true, database: "online" });
    } catch (err) {
        res.status(500).json({ ok: false, database: "offline", erro: err.message });
    }
});

app.get(["/admins", "/api/admins", "/api/cursos"], async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, usuario, nome, nome_curso, nome_professor, email, pagina, criado_em
             FROM admins
             ORDER BY nome_curso`
        );
        res.json(rows.map(adminPublico));
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao listar cursos.", erro: err.message });
    }
});

app.post(["/login", "/api/login"], async (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: "Informe usuario e senha." });
    }

    try {
        const [rows] = await pool.query(
            `SELECT id, usuario, nome, nome_curso, nome_professor, email, pagina, criado_em
             FROM admins
             WHERE usuario = ? AND senha = ?
             LIMIT 1`,
            [usuario.trim(), senha.trim()]
        );

        if (rows.length === 0) {
            return res.status(401).json({ sucesso: false, mensagem: "Usuario ou senha invalidos." });
        }

        res.json({ sucesso: true, admin: adminPublico(rows[0]) });
    } catch (err) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao fazer login.", erro: err.message });
    }
});

app.post("/api/cursos", async (req, res) => {
    const { nomeCurso, nomeProfessor, usuario, senha, email } = req.body;

    if (!nomeCurso || !nomeProfessor || !usuario || !senha || !email) {
        return res.status(400).json({ mensagem: "Preencha todos os campos." });
    }

    if (!email.includes("@") || !email.includes(".")) {
        return res.status(400).json({ mensagem: "Digite um email valido." });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO admins (usuario, senha, nome, nome_curso, nome_professor, email, pagina)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                usuario.trim().toUpperCase(),
                senha.trim(),
                nomeProfessor.trim(),
                nomeCurso.trim(),
                nomeProfessor.trim(),
                email.trim(),
                "/jl/pc/painelCurso.html"
            ]
        );

        const [rows] = await pool.query(
            `SELECT id, usuario, nome, nome_curso, nome_professor, email, pagina, criado_em
             FROM admins
             WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json(adminPublico(rows[0]));
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensagem: "Usuario ou email ja cadastrado." });
        }
        res.status(500).json({ mensagem: "Erro ao cadastrar curso.", erro: err.message });
    }
});

app.delete("/api/cursos/:usuario", async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM admins WHERE usuario = ?", [req.params.usuario]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Curso nao encontrado." });
        }
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao remover curso.", erro: err.message });
    }
});

app.get("/api/conteudos", async (req, res) => {
    const { curso, serie, bimestre, tipo } = req.query;

    if (!curso || !serie || !bimestre || !tipo) {
        return res.status(400).json({ mensagem: "Informe curso, serie, bimestre e tipo." });
    }

    try {
        const [rows] = await pool.query(
            `SELECT curso_usuario, tipo, serie, bimestre, assunto, link, texto, atualizado_em
             FROM conteudos
             WHERE curso_usuario = ? AND serie = ? AND bimestre = ? AND tipo = ?
             LIMIT 1`,
            [String(curso).toUpperCase(), Number(serie), Number(bimestre), tipo]
        );

        res.json(rows[0] || null);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar conteudo.", erro: err.message });
    }
});

app.post("/api/conteudos", async (req, res) => {
    const { curso, serie, bimestre, tipo, assunto = "", link = "", texto = "" } = req.body;

    if (!curso || !serie || !bimestre || !tipo) {
        return res.status(400).json({ mensagem: "Informe curso, serie, bimestre e tipo." });
    }

    if (!["conteudo", "atividade"].includes(tipo)) {
        return res.status(400).json({ mensagem: "Tipo invalido." });
    }

    try {
        await pool.query(
            `INSERT INTO conteudos (curso_usuario, serie, bimestre, tipo, assunto, link, texto)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                assunto = VALUES(assunto),
                link = VALUES(link),
                texto = VALUES(texto),
                atualizado_em = CURRENT_TIMESTAMP`,
            [String(curso).toUpperCase(), Number(serie), Number(bimestre), tipo, assunto, link, texto]
        );

        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao salvar conteudo.", erro: err.message });
    }
});

app.get("/api/conteudos/publico", async (req, res) => {
    const { curso, serie, bimestre } = req.query;

    if (!curso || !serie || !bimestre) {
        return res.status(400).json({ mensagem: "Informe curso, serie e bimestre." });
    }

    try {
        const [rows] = await pool.query(
            `SELECT tipo, assunto, link, texto
             FROM conteudos
             WHERE curso_usuario = ? AND serie = ? AND bimestre = ?`,
            [String(curso).toUpperCase(), Number(serie), Number(bimestre)]
        );

        res.json({
            conteudo: rows.find((item) => item.tipo === "conteudo") || null,
            atividade: rows.find((item) => item.tipo === "atividade") || null
        });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar conteudos publicos.", erro: err.message });
    }
});

const PORT = Number(process.env.PORT || 3000);

testarConexao()
    .catch((err) => {
        console.error("Erro ao conectar no banco:", err.message);
        console.error("Confira se o MySQL esta rodando e se o schema foi criado.");
    })
    .finally(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    });
