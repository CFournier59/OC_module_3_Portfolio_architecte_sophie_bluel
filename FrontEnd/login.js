// définition des constantes 
const loginForm = document.querySelector("form")

//fonction d'affichage d'une erreur
function displayErrorMessage(message){
    let errorElement = document.getElementById("errorElement")
    if(!errorElement){  
        errorElement = document.createElement("p")
        errorElement.id = "errorElement"
        errorElement.style = ("color: red")  
        loginForm.appendChild(errorElement)
    }
    errorElement.innerText = message
}

//écoute de l'évènement "submit"
loginForm.addEventListener ("submit", async (event) => {
    event.preventDefault()
    // construction de la requête POST
    const payload = {
        email: event.target.querySelector("input[type=email]").value,
        password: event.target.querySelector("input[type=password]").value.trim()
    }
    //envoi de la requête de connexion
    try{
        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        })
        switch(reponse.status){
            case 404: 
                throw new Error("utilisateur non reconnu, vérifiez l'addresse email")
                break
            case 401:
                throw new Error("accès refusé. mot de passe incorrect")
                break
            default:
                const token = await reponse.json()
                localStorage.setItem("currentToken", JSON.stringify(token))   
                location.href = "index.html"
        }
    }catch(error){
        displayErrorMessage(error.message)
    }
})


