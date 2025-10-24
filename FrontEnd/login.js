//fonction d'affichage d'une erreur
function displayErrorMessage(){
    let errorElement = document.querySelector(".error-message")
    errorElement.classList.remove("d-none")
}
// fonction principale de la page login
async function mainLogin(){
    //écoute de l'évènement "submit"
    document.querySelector("form").addEventListener ("submit", async (event) => {
        event.preventDefault()
        // construction de la requête POST
        const payload = {
            email: event.target.querySelector("input[type=email]").value.trim(),
            password: event.target.querySelector("input[type=password]").value.trim()
        }
        //envoi de la requête de connexion
        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        })
        // si identifiants ok, capture du token et redirection
        if(reponse.ok){
            const token = await reponse.json()
            localStorage.setItem("currentToken", JSON.stringify(token))  
            location.href = "index.html" 
        }  
        else{
            displayErrorMessage()
        }    
    })
}
//appel de la fonction principale de la page
await mainLogin()


