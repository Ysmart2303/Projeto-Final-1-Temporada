let tentativas = 0;



function teste() {
    alert("funciona misera");
}

//#FUNÇÃO DE FAZER LOGIN CO NUMERO DE tentativas.
//senhas temporarias
let admins = [
{
    nomeCurso: "Desenvolvimento de Sistemas",
    nomeProfessor: "Léa",
    usuario: "DS",
    senha: "123",
    email: "ds@escola.com",
    pagina: "painelCurso.html"
},
{
    nomeCurso: "Química",
    nomeProfessor: "Professor Química",
    usuario: "QUIMICA",
    senha: "456",
    email: "quimica@escola.com",
    pagina: "painelCurso.html"
},

    {
    nomeCurso: "Logística",
    nomeProfessor: "Professor Logística",
    usuario: "LOG",
    senha: "789",
    email: "logistica@escola.com",
    pagina: "painelCurso.html"
},
{
    nomeCurso: "Têxtil",
    nomeProfessor: "Professor Têxtil",
    usuario: "TEXTIL",
    senha: "101",
    email: "textil@escola.com",
    pagina: "painelCurso.html"
}
];
let adminsSalvos = localStorage.getItem("admins");

if(adminsSalvos){

    admins = JSON.parse(adminsSalvos);
}
function fazerLogin(){
    alert("LOGIN NOVO");
    let user = document.getElementById("userInput").value.trim();
    let senhaDigitada = document.getElementById("senhaInput").value.trim();

    let admEncontrado = admins.find(admin =>
        admin.usuario === user && admin.senha === senhaDigitada
    );
    if(admEncontrado){
        
        console.log("ADM ENCONTRADO:");
console.log(admEncontrado);

localStorage.setItem(
    "cursoAtual",
    JSON.stringify(admEncontrado)
);

console.log("SALVO:");
console.log(
    localStorage.getItem("cursoAtual")
);
localStorage.setItem(
    "professorAtual",
    admEncontrado.nomeProfessor
);

localStorage.setItem(
    "emailAtual",
    admEncontrado.email
);
alert(
    localStorage.getItem("cursoAtual")
);

    document.getElementById("loginTela").style.display = "none";
    document.getElementById("carregando").style.display = "block";

    console.log(admEncontrado);


console.log(
    localStorage.getItem("cursoAtual")
);

    setTimeout(() => {

        window.location.href =
            "../pc/painelCurso.html";

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
function cadastroCurso(){

    document.getElementById("painelCadastro").style.display = "block";

    document.getElementById("loginTela").style.display = "none";
}


function criarCurso(){

    let nomeCurso =
        document.getElementById("cursoInput").value;

    let nomeProfessor =
    document.getElementById("nomeProfessor").value;

    let usuario =
        document.getElementById("usuarioCurso").value;

    let senha =
        document.getElementById("senhaCurso").value;

    let email =
        document.getElementById("emailCurso").value;

    if(
        !email.includes("@") ||
        !email.includes(".")
    ){
        alert("Digite um email válido!");
        return;
    }

    let novoCurso = {

    nomeCurso: nomeCurso,

    nomeProfessor: nomeProfessor,

    usuario: usuario,

    senha: senha,

    email: email,

    pagina: "painelCurso.html"
};
    let existe = admins.find(
    admin => admin.email === email
);

if(existe){

    alert("Este email já está cadastrado!");

    return;
}

    admins.push(novoCurso);
    localStorage.setItem(
    "admins",
    JSON.stringify(admins)
);

    alert("Curso criado com sucesso!");

    
}
function removerCurso(usuario){

    let confirmar = confirm(
`⚠️ ATENÇÃO

Você está prestes a excluir este curso.

Essa ação não poderá ser desfeita.

Deseja continuar?`
);

    if(!confirmar){
        return;
    }

    admins = admins.filter(
        admin => admin.usuario !== usuario
    );

    localStorage.setItem(
        "admins",
        JSON.stringify(admins)
    );

    verCursos();

    alert("Curso removido com sucesso!");
}
function voltarLogin(){

    document.getElementById("painelCadastro").style.display = "none";

    document.getElementById("loginTela").style.display = "block";
}
function atualizarCursos(){

    let area = document.getElementById("listaCursos");

    area.innerHTML = "";

    admins.forEach(admin => {

        area.innerHTML += `

        <div class="cardCurso">

            <h3>${admin.nomeCurso}</h3>

            <button onclick="removerCurso('${admin.usuario}')">
                Remover
            </button>

        </div>

        `;
    });
}

function verCursos(){

    let lista = document.getElementById("listaCursos");

    lista.innerHTML = "<h3>Cursos Cadastrados</h3>";

    admins.forEach(admin => {

        lista.innerHTML += `
            <div class="cursoCard">

                <p><strong>Curso:</strong> ${admin.nomeCurso}</p>


                <button onclick="removerCurso('${admin.usuario}')">
                    Remover
                </button>

            </div>
        `;
    });
}