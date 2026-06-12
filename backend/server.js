const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Conexão com o banco
const db = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "escola"
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar:", err);
        return;
    }

    console.log("Conectado ao banco escola!");
});

// Rota para testar
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

// Listar administradores
app.get("/admins", (req, res) => {
    db.query(
        "SELECT id, usuario, nome, criado_em FROM admins",
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
});

// Login
app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;

    db.query(
        "SELECT * FROM admins WHERE usuario = ? AND senha = ?",
        [usuario, senha],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: "Usuário ou senha inválidos"
                });
            }

            res.json({
                sucesso: true,
                admin: {
                    id: result[0].id,
                    usuario: result[0].usuario,
                    nome: result[0].nome
                }
            });
        }
    );
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});