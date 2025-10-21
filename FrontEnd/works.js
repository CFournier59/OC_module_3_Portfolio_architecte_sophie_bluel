// definition des constantes
const gallery = document.querySelector(".gallery")


// demande du contenu "works auprès de l'API"
const reponse = await fetch("http://localhost:5678/api/works")
const works = await reponse.json()


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

displayWorks(works)