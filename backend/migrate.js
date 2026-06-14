const mysql = require("mysql2/promise");

async function main() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "2303",
        database: process.env.DB_NAME || "escola"
    });

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
    } finally {
        await db.end();
    }
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
