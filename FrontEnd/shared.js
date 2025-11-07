//fonction d'affichage des travaux
export function displayWorks(works){
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