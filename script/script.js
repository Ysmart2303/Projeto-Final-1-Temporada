function voltar(index) {

    const paginas = {
        home: "index.html",
        creditos: "creditos.html",
    };

    window.location.href = paginas[index];

}