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
const publicRoot = path.join(projectRoot, "public");

app.use(cors());
app.use(express.json());
app.use(express.static(publicRoot));
app.use("/img", express.static(path.join(projectRoot, "img")));
app.use("/jl", express.static(path.join(projectRoot, "jl")));

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

const camposConteudo = `
    id,
    curso_usuario,
    tipo,
    serie,
    bimestre,
    assunto,
    link,
    texto,
    criado_em,
    atualizado_em
`;

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
    res.sendFile(path.join(publicRoot, "html", "index.html"));
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
    const { id, curso, serie, bimestre, tipo } = req.query;

    if (id) {
        try {
            const [rows] = await pool.query(
                `SELECT ${camposConteudo}
                 FROM conteudos
                 WHERE id = ?
                 LIMIT 1`,
                [Number(id)]
            );

            return res.json(rows[0] || null);
        } catch (err) {
            return res.status(500).json({ mensagem: "Erro ao buscar conteudo.", erro: err.message });
        }
    }

    if (!curso || !serie || !bimestre || !tipo) {
        return res.status(400).json({ mensagem: "Informe curso, serie, bimestre e tipo." });
    }

    try {
        const [rows] = await pool.query(
            `SELECT ${camposConteudo}
             FROM conteudos
             WHERE curso_usuario = ? AND serie = ? AND bimestre = ? AND tipo = ?
             ORDER BY criado_em DESC, id DESC`,
            [String(curso).toUpperCase(), Number(serie), Number(bimestre), tipo]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar conteudo.", erro: err.message });
    }
});

app.get("/api/conteudos/curso/:curso", async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT ${camposConteudo}
             FROM conteudos
             WHERE curso_usuario = ?
             ORDER BY serie, bimestre, tipo, criado_em DESC, id DESC`,
            [String(req.params.curso).toUpperCase()]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao listar conteudos.", erro: err.message });
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
        const [result] = await pool.query(
            `INSERT INTO conteudos (curso_usuario, serie, bimestre, tipo, assunto, link, texto)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [String(curso).toUpperCase(), Number(serie), Number(bimestre), tipo, assunto, link, texto]
        );

        const [rows] = await pool.query(
            `SELECT ${camposConteudo}
             FROM conteudos
             WHERE id = ?
             LIMIT 1`,
            [result.insertId]
        );

        res.status(201).json({ sucesso: true, conteudo: rows[0] });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao salvar conteudo.", erro: err.message });
    }
});

app.put("/api/conteudos/:id", async (req, res) => {
    const { curso, serie, bimestre, tipo, assunto = "", link = "", texto = "" } = req.body;
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).json({ mensagem: "Informe o id do registro." });
    }

    if (!curso || !serie || !bimestre || !tipo) {
        return res.status(400).json({ mensagem: "Informe curso, serie, bimestre e tipo." });
    }

    if (!["conteudo", "atividade"].includes(tipo)) {
        return res.status(400).json({ mensagem: "Tipo invalido." });
    }

    try {
        const [result] = await pool.query(
            `UPDATE conteudos
             SET serie = ?,
                 bimestre = ?,
                 tipo = ?,
                 assunto = ?,
                 link = ?,
                 texto = ?,
                 atualizado_em = CURRENT_TIMESTAMP
             WHERE id = ? AND curso_usuario = ?`,
            [Number(serie), Number(bimestre), tipo, assunto, link, texto, id, String(curso).toUpperCase()]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Registro nao encontrado." });
        }

        const [rows] = await pool.query(
            `SELECT ${camposConteudo}
             FROM conteudos
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        res.json({ sucesso: true, conteudo: rows[0] });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao atualizar conteudo.", erro: err.message });
    }
});

app.delete("/api/conteudos/:id", async (req, res) => {
    const id = Number(req.params.id);
    const curso = req.query.curso ? String(req.query.curso).toUpperCase() : "";

    if (!id) {
        return res.status(400).json({ mensagem: "Informe o id do registro." });
    }

    try {
        const valores = curso ? [id, curso] : [id];
        const filtroCurso = curso ? " AND curso_usuario = ?" : "";
        const [result] = await pool.query(
            `DELETE FROM conteudos
             WHERE id = ?${filtroCurso}`,
            valores
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Registro nao encontrado." });
        }

        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao excluir conteudo.", erro: err.message });
    }
});

app.delete("/api/conteudos", async (req, res) => {
    res.status(400).json({ mensagem: "Informe o id do registro para excluir." });
});

app.get("/api/conteudos/publico", async (req, res) => {
    const { curso, serie, bimestre } = req.query;

    if (!curso || !serie || !bimestre) {
        return res.status(400).json({ mensagem: "Informe curso, serie e bimestre." });
    }

    try {
        const [rows] = await pool.query(
            `SELECT id, tipo, assunto, link, texto
             FROM conteudos
             WHERE curso_usuario = ? AND serie = ? AND bimestre = ?
             ORDER BY criado_em DESC, id DESC`,
            [String(curso).toUpperCase(), Number(serie), Number(bimestre)]
        );

        const conteudos = rows.filter((item) => item.tipo === "conteudo");
        const atividades = rows.filter((item) => item.tipo === "atividade");

        res.json({
            conteudos,
            atividades
        });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar conteudos publicos.", erro: err.message });
    }
});

const PORT = Number(process.env.PORT || 3000);

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);

    testarConexao().catch((err) => {
        console.error("Erro ao conectar no banco:", err.message);
        console.error("Confira se o MySQL esta rodando e se o schema foi criado.");
    });
});

module.exports = { app, pool, server };
