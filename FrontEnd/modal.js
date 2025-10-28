const modal = document.querySelector(".modal")
const closeButtons = document.querySelectorAll(".close-button")
//fonction qui gère les listeners pour les tableaux d'éléments
function elementsListenerHandler(elements, action){
    for(const element of elements){
        switch(action){
            case "add-closeModal" :  
                element.addEventListener("click", closeModal)
                break
            case "remove-closeModal" :
                element.removeEventListener("click", closeModal)
                break
            case "stop-propagation" :
                element.addEventListener("click", (event) =>{
                    event.stopPropagation()
                })
            }
    }
}
//sous fonction de fermeture de la modale
function closeModalHandler(modal, closeButtons){
    modal.classList.toggle("d-none")
    modal.removeAttribute("aria-modal")
    modal.setAttribute("aria-hidden", "true")
    modal.removeEventListener("click", closeModal)
    elementsListenerHandler(closeButtons, "remove-closeModal")
}
//fonction de fermeture de la modale
function closeModal(){
    closeModalHandler(modal, closeButtons)
}
//fonction d'ouverture de la modale
export function openModal(modalLink){
    const modalWrappers = document.querySelectorAll(".modal-wrapper")
    modal.classList.toggle("d-none")
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener( "click", closeModal) 
    elementsListenerHandler(closeButtons, "add-closeModal")
    elementsListenerHandler(modalWrappers, "stop-propagation")  
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
