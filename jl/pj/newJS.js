async function fazerLogin() {

    let user = document.getElementById("userInput").value.trim();
    let senhaDigitada = document.getElementById("senhaInput").value.trim();

    try {

        const resposta = await fetch(
            "http://localhost:3000/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario: user,
                    senha: senhaDigitada
                })
            }
        );

        const dados = await resposta.json();

        if (dados.sucesso) {

            localStorage.setItem(
                "adminLogado",
                JSON.stringify(dados.admin)
            );

            document.getElementById("loginTela").style.display = "none";
            document.getElementById("carregando").style.display = "block";

            setTimeout(() => {
                window.location.href =
                    "/jl/pc/painelCurso.html";
            }, 1500);

        } else {

            tentativas++;

            document.getElementById("errologin").innerText =
                "Senha ou usuário incorretos! Tentativas: "
                + tentativas + "/3";
        }

    } catch (erro) {

        console.error(erro);

        document.getElementById("errologin").innerText =
            "Erro ao conectar ao servidor.";
    }
}