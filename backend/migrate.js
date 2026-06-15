const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

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

async function main() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 3307),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "admin",
        database: process.env.DB_NAME || "escola"
    });

    try {
        try {
            await db.query(
                "ALTER TABLE admins ADD COLUMN pagina VARCHAR(180) NOT NULL DEFAULT '/jl/pc/painelCurso.html'"
            );
            console.log("Coluna pagina adicionada.");
        } catch (err) {
            if (err.code === "ER_DUP_FIELDNAME") {
                console.log("Coluna pagina ja existia.");
            } else {
                throw err;
            }
        }

        const [indicesBusca] = await db.query(
            `SELECT INDEX_NAME
             FROM INFORMATION_SCHEMA.STATISTICS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = 'conteudos'
               AND INDEX_NAME = 'idx_conteudos_busca'
             LIMIT 1`
        );

        if (indicesBusca.length === 0) {
            await db.query(
                "ALTER TABLE conteudos ADD INDEX idx_conteudos_busca (curso_usuario, serie, bimestre, tipo)"
            );
            console.log("Indice idx_conteudos_busca criado.");
        } else {
            console.log("Indice idx_conteudos_busca ja existia.");
        }

        const [indicesUnicos] = await db.query(
            `SELECT INDEX_NAME
             FROM INFORMATION_SCHEMA.STATISTICS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = 'conteudos'
               AND INDEX_NAME = 'uq_conteudo'
             LIMIT 1`
        );

        if (indicesUnicos.length > 0) {
            await db.query("ALTER TABLE conteudos DROP INDEX uq_conteudo");
            console.log("Indice unico uq_conteudo removido.");
        } else {
            console.log("Indice unico uq_conteudo nao existe.");
        }
    } finally {
        await db.end();
    }
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
