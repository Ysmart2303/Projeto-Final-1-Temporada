let tentativas = 0;



function teste() {
    alert("funciona misera");
}

//#FUNÇÃO DE FAZER LOGIN CO NUMERO DE tentativas.
//senhas temporarias
let admins = [
    {
        usuario: "DS",
        senha: "123",
        pagina: "DS.html"
    },
    {
        usuario: "QUIMICA",
        senha: "456",
        pagina: "quimica.html"
    },
    {
        usuario: "LOG",
        senha: "789",
        pagina: "logistica.html"
    },
    {
        usuario: "TEXTIL",
        senha: "101",
        pagina: "textil.html"
    }
];
function fazerLogin(){
    let user = document.getElementById("userInput").value.trim();
    let senhaDigitada = document.getElementById("senhaInput").value.trim();

    let admEncontrado = admins.find(admin =>
        admin.usuario === user && admin.senha === senhaDigitada
    );
    if(admEncontrado){

        document.getElementById("loginTela").style.display = "none";
        document.getElementById("carregando").style.display = "block";

        setTimeout(() => {
            window.location.href = admEncontrado.pagina;
        }, 1500);
    }else{
        tentativas++;
        document.getElementById("errologin").innerText = "Senha ou Usuario Incorretos! Tente novamente. Suas tentativas: " + tentativas + "/3"
    }
    if(tentativas >= 3){
        document.getElementById("errologin").innerText =
        "Muitas tentativas. Recarregue a página.";
        return;
    }
}

//CARREGAR PAINEL DS