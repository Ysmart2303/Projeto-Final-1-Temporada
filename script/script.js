function voltar(index) {

    const paginas = {
        home: "index.html",
        creditos: "creditos.html",
        login : "login.html",
        esCo : "escolhaCurso.html"
    };

    window.location.href = paginas[index];

}