const modal = document.querySelector(".modal")
const closeButton = document.getElementById("close-button")
//sous fonction de fermeture de la modale
function closeModalHandler(modal, closeButton){
    modal.classList.toggle("d-none")
    modal.removeAttribute("aria-modal")
    modal.setAttribute("aria-hidden", "true")
    modal.removeEventListener("click", closeModal)
    closeButton.removeEventListener("click", closeModal)
}
//fonction de fermeture de la modale
function closeModal(){
    closeModalHandler(modal, closeButton)
}
//fonction d'ouverture de la modale
export function openModal(modalLink){
    const modalWrapper = document.querySelector(".modal-wrapper")
    modal.classList.toggle("d-none")
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener( "click", closeModal) 
    closeButton.addEventListener("click", closeModal)
    modalWrapper.addEventListener("click", (event) =>{
        event.stopPropagation()
    }) 
}
//fonction d'affichage des travaux pour la modale
export function modalDisplayWorks(works){
    const modalGallery = document.querySelector(".modal-gallery")
    modalGallery.innerHTML = ""
    for(const work of works){
        const workElement = document.createElement("div")
        workElement.classList.add("modal-element")
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <button class="modal-button">
                <img src="./assets/icons/delete.svg" alt="bouton supprimer" class="modal-delete-icon">
            </button>`
        modalGallery.appendChild(workElement)   
    }
}
