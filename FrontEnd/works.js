import { modalHandler } from "./modal.js"
//fonction d'affichage des travaux
function displayWorks(works){
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""
    for(const work of works){
        const workFigure = document.createElement("figure")
        const workImage = document.createElement("img")
        const workFigCaption = document.createElement("figcaption")
        workImage.src = work.imageUrl
        workImage.alt = work.title
        workFigCaption.innerText = work.title
        gallery.appendChild(workFigure)
        workFigure.appendChild(workImage)
        workFigure.appendChild(workFigCaption)
    }
}
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
// fonction principale du script de la page index
async function mainWorks() {
    // demande des contenus works et gategories auprès de l'API
    let reponse = await fetch("http://localhost:5678/api/works")
    const works = await reponse.json()
    reponse = await fetch("http://localhost:5678/api/categories")
    const categories = await reponse.json()
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
    //appel de la modale
}
// pour finir, appel de la fonction principale
await mainWorks()