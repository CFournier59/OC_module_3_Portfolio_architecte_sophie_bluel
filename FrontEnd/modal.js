import { displayWorks } from "./shared.js"
const modal = document.querySelector(".modal")
const modalWrappers = document.querySelectorAll(".modal-wrapper")
const closeButtons = document.querySelectorAll(".close-button")
let readyToSubmit = false
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
                break
            case "swap-wrapper" :
                element.classList.toggle("d-none")
        }
    }
}
// fonction qui met en place les boutons de permutation d'affichage de la modale
function swapWrapper(modalWrappers){
    const swapButtons = document.querySelectorAll(".swap-button")
    for(const button of swapButtons){
        button.addEventListener("click", (event) =>{
            elementsListenerHandler(modalWrappers, "swap-wrapper")
        })
    }
}
//sous fonction de fermeture de la modale
function closeModalHandler(modal, closeButtons, modalWrappers){
    modal.classList.toggle("d-none")
    modal.removeAttribute("aria-modal")
    modal.setAttribute("aria-hidden", "true")
    modal.removeEventListener("click", closeModal)
    elementsListenerHandler(closeButtons, "remove-closeModal")
    modalWrappers[0].setAttribute("class", "modal-wrapper")
    modalWrappers[1].setAttribute("class", "modal-wrapper d-none")
}
//fonction de fermeture de la modale
function closeModal(){
    closeModalHandler(modal, closeButtons, modalWrappers)
}
//fonction d'ouverture de la modale
function openModal(modalWrappers){
    modal.classList.toggle("d-none")
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener( "click", closeModal) 
    elementsListenerHandler(closeButtons, "add-closeModal")
    elementsListenerHandler(modalWrappers, "stop-propagation")  
}
//fonction d'affichage des travaux pour la modale
function modalDisplayWorks(works){
    const modalGallery = document.querySelector(".modal-gallery")
    modalGallery.innerHTML = ""
    for(const work of works){
        const workElement = document.createElement("div")
        workElement.classList.add("modal-element")
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <button class="modal-button delete-button" id="${work.id}">
                <img src="./assets/icons/delete.svg" alt="bouton supprimer" class="modal-delete-icon">
            </button>`
        modalGallery.appendChild(workElement)   
    }
}
//fonction de mise à jour de la gallerie modale après suppression ou ajout de projet
async function resetGallery(token){
    const reponse = await fetch("http://localhost:5678/api/works")
    const works = await reponse.json()
    modalDisplayWorks(works)
    setWorkDeletion(token)
    displayWorks(works)
}
// fonction qui prend en charge la suppression du projet quand on clique sur son icône "poubelle"
async function setWorkDeletion(token){
    const deleteButtons = document.querySelectorAll(".delete-button")
    for(const button of deleteButtons){
        button.addEventListener("click", async () =>{
            let reponse = await fetch(`http://localhost:5678/api/works/${button.id}`, {
                method: "DELETE",
                headers: {"Authorization": `Bearer ${token.token}`}
            })
            resetGallery(token)   
        })
    }
}
// fonction qui prend en charge le chargement d'image du formulaire
function setUploadField(uploadField){
    uploadField.value = ""
    uploadField.onchange = (event) => {
        if(event.target.files[0].size >4194304){
            alert("cette image est trop volumineuse!")
            event.target.value = ""
        }
        else{
            const imageFieldSet = document.querySelector(".add-photo-fieldset")
            const uploadedImage = URL.createObjectURL(event.target.files[0])
            imageFieldSet.innerHTML =  `<img src="${uploadedImage}" height="169">` 
            return uploadedImage  
        }  
    }
}
//fonction qui gère la liste de catégories du formulaire
function setCategorySelection(categorySelector, categories){
    for(const category of categories){
        const categoryOption = document.createElement("option")
        categoryOption.value = category.id
        categoryOption.innerText = category.name
        categorySelector.appendChild(categoryOption)
    }
}
//fonction qui vérifie si le formulaire est prêt à l'envoi
function formCompletionListeners(uploadField, titleField, categorySelector ){
    titleField.value = ""
    const submitWorkButton = document.getElementById("submit-work-button")
    const formFields = [uploadField, titleField, categorySelector]
    for(const field of formFields){
        field.addEventListener("change", (event) =>{
            if((uploadField.value && titleField.value.trim() && categorySelector.value) !== ""){
                submitWorkButton.removeAttribute("style")
                readyToSubmit = true
            }
            else{
                if(!submitWorkButton.style.backgroundColor){
                    submitWorkButton.setAttribute("style", "background-color: #a7a7a7;")
                }
                readyToSubmit = false
            }
        })
    }
}
// fonction principale du formulaire de création de projet
function setAddWorkForm(categories, token) {
    readyToSubmit = false
    const addWorkForm = document.getElementById("add-work-form")
    let uploadField = document.getElementById("file-input")
    const titleField = document.getElementById("title-input")
    const categorySelector = document.querySelector("select")
    setUploadField(uploadField)
    setCategorySelection(categorySelector, categories)
    formCompletionListeners( uploadField, titleField, categorySelector, readyToSubmit)
    addWorkForm.addEventListener("submit", async (event) =>{
        event.preventDefault()
        if(readyToSubmit){
            const formData = new FormData()
            formData.append("image", uploadField.files[0])
            formData.append("title", titleField.value)
            formData.append("category", parseInt(categorySelector.value))
            const reponse = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {"Authorization": `Bearer ${token.token}`},
                body: formData
            })
            if(reponse.ok){
                document.getElementById("submit-work-button").setAttribute("style", "background-color: #a7a7a7;")
                readyToSubmit = false
                document.querySelector(".add-photo-fieldset").innerHTML = `
                    <img src="assets/icons/img-placeholder.svg" alt="aucune image importée"><br>
				    <input type="file" accept="image/png, image/jpeg, image/jpg" class="d-none" name="file-input" id="file-input">
				    <label for="file-input" class="file-label">+ Ajouter photo</label>
				    <p class="file-specification">jpg, png : 4mo max</p>`
                uploadField = document.getElementById("file-input")
                setUploadField(uploadField)
                titleField.value = ""
                categorySelector.value = ""  
                elementsListenerHandler(modalWrappers, "swap-wrapper")
                resetGallery(token)
            }
        }
    })
}
// fonction principale de la modale
export function modalHandler(works, categories, token){
    const modalLink = document.querySelector(".modal-link-container")
    modalLink.classList.remove("d-none")
    modalLink.addEventListener("click", () => {
        openModal(modalWrappers)    
    })
    modalDisplayWorks(works)
    swapWrapper(modalWrappers)
    setWorkDeletion(token)
    setAddWorkForm(categories, token)
}

