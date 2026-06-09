const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const banco = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "escola"
});

banco.connect((erro) => {
    if (erro) {
        console.log("Erro ao conectar");
        return;
    }

    console.log("MySQL conectado");
});

// Rota de login

app.post("/login", (req, res) => {

    const { usuario, senha } = req.body;

    const sql =
    "SELECT * FROM admins WHERE usuario = ? AND senha = ?";

    banco.query(sql, [usuario, senha], (erro, resultado) => {

        if (erro) {
            return res.status(500).json({ erro: erro });
        }

        if (resultado.length > 0) {
            res.json(resultado[0]);
        } else {
            res.status(401).json({
                mensagem: "Usuário ou senha inválidos"
            });
        }

    });

});

app.listen(3000, () => {
    console.log("Servidor rodando");
});