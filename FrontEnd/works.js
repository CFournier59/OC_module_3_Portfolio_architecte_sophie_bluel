// definition des constantes
const gallery = document.querySelector(".gallery")
const buttonContainer = document.querySelector(".filter-button-container")

// demande des contenus works et gategories auprès de l'API
let reponse = await fetch("http://localhost:5678/api/works")
const works = await reponse.json()
reponse = await fetch("http://localhost:5678/api/categories")
const categories = await reponse.json()

//fonction d'affichage des travaux
function displayWorks(works){
    for(let i=0; i<works.length; i++){
        const workFigure = document.createElement("figure")
        const workImage = document.createElement("img")
        const workFigCaption = document.createElement("figcaption")
        workImage.src = works[i].imageUrl
        workImage.alt = works[i].title
        workFigCaption.innerText = works[i].title
        gallery.appendChild(workFigure)
        workFigure.appendChild(workImage)
        workFigure.appendChild(workFigCaption)
    }
}

//mise en place des boutons de filtres
//le premier bouton est statique et affiche tous les travaux
const allButton = document.getElementById("allWorks")
allButton.addEventListener("click", () =>{
    gallery.innerHTML = ""
    displayWorks(works)
})
// les autres sont génerés selon les catégories définies sur l'API
for(let i=0; i<categories.length; i++){
    const filterButton = document.createElement("button")
    filterButton.innerText = categories[i].name
    buttonContainer.appendChild(filterButton)
    filterButton.addEventListener("click", () => {
        const filteredWorks = works.filter((work) => work.categoryId === i+1)
        gallery.innerHTML = ""
        displayWorks(filteredWorks)

    })
}

//appel de la fonction d'affichage
displayWorks(works)