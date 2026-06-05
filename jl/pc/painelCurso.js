// painelCurso.js - organizado e com pequenas notas

// Carrega dados do curso do localStorage
const cursoAtualTexto = localStorage.getItem("cursoAtual");

if (!cursoAtualTexto) {
  alert("Você precisa fazer login primeiro.");
  window.location.href = "../pj/pj.html";
}

console.log("CURSO ATUAL:", cursoAtualTexto);

const cursoAtual = JSON.parse(cursoAtualTexto);
console.log(cursoAtual);

if (!cursoAtual) {
  alert("Dados do curso ausentes. Voltando ao login.");
  window.location.href = "../pj/pj.html";
}

const professorAtual = localStorage.getItem("professorAtual");
const emailAtual = localStorage.getItem("emailAtual");
const emailSalvo = localStorage.getItem("email_" + cursoAtual.usuario);

// Preenche campos iniciais
document.getElementById("tituloCurso").innerText = "Painel " + cursoAtual.nomeCurso;
document.getElementById("nomeProfessor").innerText = "Professor: " + professorAtual;
if (document.getElementById("emailProfessor")) {
  document.getElementById("emailProfessor").value = emailSalvo || emailAtual || "";
}

// Estado inicial da UI
document.querySelector(".periodos1").style.display = "none";
document.getElementById("voltarSeries").style.display = "none";

let serieAtual = 0;

// Abre uma série
function abrirSerie(numero) {
  serieAtual = numero;
  document.getElementById("serieAtual").style.display = "block";
  document.getElementById("serieAtual").innerText = numero + "° Série";
  document.getElementById("listaSe").style.display = "none";
  document.getElementById("voltarSeries").style.display = "block";
  document.querySelector(".periodos1").style.display = "block";
  localStorage.setItem("serieAtual_" + cursoAtual.usuario, numero);
}

// Abre um bimestre
function abrirMes(numero) {
  document.getElementById("serieAtual").innerText = serieAtual + "° Série • Bimestre " + numero;
  document.getElementById("listaBi").style.display = "none";
  document.getElementById("voltarSeries").style.display = "none";

  const area = document.getElementById("conteudoBi");
  area.innerHTML = `
    <div class="opcoesBimestre">
      <div class="cardOpcao" onclick="abrirConteudos(${numero})">
        <h2>Conteúdos</h2>
      </div>
      <div class="cardOpcao" onclick="abrirAtividades(${numero})">
        <h2>Atividades</h2>
      </div>
    </div>
    <button onclick="voltar()">Voltar</button>
  `;
}

// Volta para a lista de bimestres
function voltar() {
  document.getElementById("listaBi").style.display = "flex";
  document.getElementById("conteudoBi").innerHTML = "";
  document.getElementById("voltarSeries").style.display = "block";
  document.getElementById("serieAtual").innerText = serieAtual + "° Série";
}

// Volta para seleção de séries
function voltarSeries() {
  document.getElementById("listaSe").style.display = "flex";
  document.getElementById("voltarSeries").style.display = "none";
  document.querySelector(".periodos1").style.display = "none";
  document.getElementById("conteudoBi").innerHTML = "";
  document.getElementById("listaBi").style.display = "flex";
  serieAtual = 0;
  document.getElementById("serieAtual").style.display = "none";
}

// Abre painel de edição de conteúdos
function abrirConteudos(bimestre) {
  const area = document.getElementById("conteudoBi");
  const chave = `${cursoAtual.usuario}_conteudo_${serieAtual}_${bimestre}`;
  const dadosSalvos = localStorage.getItem(chave);
  const dados = dadosSalvos ? JSON.parse(dadosSalvos) : { assunto: "", link: "", conteudo: "" };

  area.innerHTML = `
    <div class="painelEdicao">
      <h2>Conteúdos - Bimestre ${bimestre}</h2>
      <input type="text" id="assunto" placeholder="Assunto">
      <input type="url" id="linkAjuda" placeholder="Link de ajuda">
      <textarea id="textoConteudo" placeholder="Digite o conteúdo..."></textarea>
      <div class="botoesEdicao">
        <button onclick="salvarConteudo(${bimestre})">Salvar</button>
        <button onclick="abrirMes(${bimestre})">Voltar</button>
      </div>
    </div>
  `;

  document.getElementById("assunto").value = dados.assunto;
  document.getElementById("linkAjuda").value = dados.link;
  document.getElementById("textoConteudo").value = dados.conteudo;
}

// Abre painel de atividades
function abrirAtividades(bimestre) {
  const area = document.getElementById("conteudoBi");
  const chave = `${cursoAtual.usuario}_atividade_${serieAtual}_${bimestre}`;
  const dadosSalvos = localStorage.getItem(chave);
  const dados = dadosSalvos ? JSON.parse(dadosSalvos) : { assunto: "", link: "", atividade: "" };

  area.innerHTML = `
    <div class="painelEdicao">
      <h2>Atividades - Bimestre ${bimestre}</h2>
      <input type="text" id="assuntoAtividade" placeholder="Assunto">
      <input type="url" id="linkAtividade" placeholder="Link de ajuda">
      <textarea id="textoAtividade" placeholder="Digite a atividade..."></textarea>
      <div class="botoesEdicao">
        <button onclick="salvarAtividade(${bimestre})">Salvar</button>
        <button onclick="abrirMes(${bimestre})">Voltar</button>
      </div>
    </div>
  `;

  document.getElementById("assuntoAtividade").value = dados.assunto;
  document.getElementById("linkAtividade").value = dados.link;
  document.getElementById("textoAtividade").value = dados.atividade;
}

// Salva conteúdo no localStorage
function salvarConteudo(bimestre) {
  const assunto = document.getElementById("assunto").value;
  const link = document.getElementById("linkAjuda").value;
  const conteudo = document.getElementById("textoConteudo").value;

  const dados = { assunto, link, conteudo };
  const chave = `${cursoAtual.usuario}_conteudo_${serieAtual}_${bimestre}`;
  localStorage.setItem(chave, JSON.stringify(dados));
  alert("Conteúdo salvo!");
}

// Salva atividade no localStorage
function salvarAtividade(bimestre) {
  const assunto = document.getElementById("assuntoAtividade").value;
  const link = document.getElementById("linkAtividade").value;
  const atividade = document.getElementById("textoAtividade").value;

  const dados = { assunto, link, atividade };
  const chave = `${cursoAtual.usuario}_atividade_${serieAtual}_${bimestre}`;
  localStorage.setItem(chave, JSON.stringify(dados));
  alert("Atividade salva!");
}

// Salva email do professor
function salvarEmail() {
  const email = document.getElementById("emailProfessor").value;
  localStorage.setItem("email_" + cursoAtual.usuario, email);
  alert("Email salvo!");
}