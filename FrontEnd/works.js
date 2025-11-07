import { displayWorks } from "./shared.js"
import { modalHandler } from "./modal.js"
// fonction qui assure la mise en page du mode édition
function editorMode(works, categories, token){
    //on cache les éléments suivants:
    document.getElementById("login-link").classList.add("d-none")
    document.querySelector(".filter-button-container").classList.add("d-none")
    //affichage du bandeau d'édition
    document.querySelector(".editor-banner").classList.remove("d-none")
    // gestion du logout
    const logOutLink = document.getElementById("logout-link")
    logOutLink.classList.remove("d-none")
    logOutLink.addEventListener("click", () =>{
        localStorage.removeItem("currentToken")
        location.reload()
    })
    //gestion du lien de la modale d'édition
    modalHandler(works, categories, token)
}
//fonction qui affiche les projets avec les filtres pour les visiteurs du site
function visitorMode(works, categories){
    //mise en place des boutons de filtres - premier bouton statique et le reste est dynamique
    const buttonContainer = document.querySelector(".filter-button-container")
    const allButton = document.getElementById("allWorks")
    allButton.addEventListener("click", () =>{
        displayWorks(works)
    })
    for(let i=0; i<categories.length; i++){
        const filterButton = document.createElement("button")
        filterButton.innerText = categories[i].name
        buttonContainer.appendChild(filterButton)
        filterButton.addEventListener("click", () => {
            const filteredWorks = works.filter((work) => work.categoryId === i+1)
            displayWorks(filteredWorks)
        })
    }
}
// fonction qui gère vérifie les champs du formulaire de contact
function checkContactFields(name, email, message){
    if(name === "" || email === ""|| message === ""){
        throw new Error("Un ou plusieurs champs sont vides, vérifez votre saisie")
    }
    const mailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+")
    if(mailRegExp.test(email) !== true){
        throw new Error("votre email n'est pas valide")
    }
}
// fonction qui gère le formulaire de contact
function contactFormHandler(){
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const message = document.getElementById("message")
    const errorMessage =  document.querySelector(".error-message")
    document.getElementById("contact-form").addEventListener("submit", (event) => {
        event.preventDefault()
        try{
            checkContactFields(name.value.trim(), email.value.trim(), message.value.trim())
            // en attendant d'avoir défini un environement de traitement des reqêtes client, affichage en tant qu'objet dans un console.log
            const projectRequest = {
                prName : name.value.trim(),
                prEmail : email.value.trim(),
                prMessage : message.value.trim()
            }
            if(!errorMessage.classList.contains("d-none")){
                errorMessage.classList.add("d-none")
            }
            name.value = ""
            email.value = ""
            message.value = ""
            console.log(projectRequest)
        }
        catch(error){
            errorMessage.innerText = error.message
            if(errorMessage.classList.contains("d-none")){
                errorMessage.classList.remove("d-none")
            }  
        }
    })
}
// fonction principale du script de la page index
async function mainWorks() {
    // demande des contenus works et gategories auprès de l'API
    let reponse = await fetch("http://localhost:5678/api/works")
    const works = await reponse.json()
    reponse = await fetch("http://localhost:5678/api/categories")
    const categories = await reponse.json()
    //gestion du formulaire de contat
    contactFormHandler()
    // vérification de présence d'un token pour choisir entre mode visiteur ou éditeur
    const token = JSON.parse(localStorage.getItem("currentToken"))
    if(token !== null){
        editorMode(works, categories, token)
    }
    else{
        visitorMode(works, categories)
    }
    //appel de la fonction d'affichage
    displayWorks(works)
}
// pour finir, appel de la fonction principale
await mainWorks()
