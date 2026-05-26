function voltar(index) {

    const paginas = {
        home: "index.html",
        creditos: "creditos.html",
        login : "login.html",
        
    };

    window.location.href = paginas[index];

}