const fs = require('fs');
const path = require('path');
const caminhoArquivo = path.resolve(__dirname, 'teste.txt');

function validateAccess(accessToken) {
    fetch("/salvar-dados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ entrada: valor })
    })
    .then(response => response.json())
    .then(data => console.log("Resposta do servidor:", data))
    .catch(error => console.error("Erro ao salvar:", error));
}

function accessValidation(){
    let accessToken = document.getElementById("login").value;
    console.log("Valor digitado: ", accessToken);

    if (accessToken.trim() === "") {
        alert("Insira o token para realizar o acesso.");
    } else {
        validateAccess(accessToken);
    }
}

  
