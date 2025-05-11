

function validateAccess(accessToken) {
    fetch("http://localhost:3000/validate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ login: accessToken })
    })
    .then(response => response.json())
    .then(data => {
      let resultado = document.getElementById("resultado");
      resultado.textContent = data.mensagem || data.erro;
      resultado.style.color = data.erro ? "red" : "green";

      // Se o token for válido, redireciona para index.html
      if (data.mensagem === "Token válido!") {
          window.location.href = "index.html";
      }
    })
    .catch(error => console.error("Erro ao salvar:", error));
}

function accessValidation(){
    let accessToken = document.getElementById("login").value;
    console.log("Valor digitado: ", accessToken);

    if (accessToken.trim() === "") {
        alert("Insira o token para realizar o acesso.");
    } else {
      // #########################
      //validateAccess(accessToken);
      if(accessToken === "3333" || "6060" || "3030"){
        alert("Token correto! Boa champ!");
        window.location.href = "telaPedidos.html";
      } else {
        alert("Token incorreto!");
      }
    }
}

