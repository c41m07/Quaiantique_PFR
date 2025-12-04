// Je prépare ici un rendu simple pour la galerie en injectant dynamiquement le HTML d'une carte image.
const galerieImage = document.getElementById("allimage");

// Récupérer les informations des images
let titre = "brunch";
let imageSource = "../image/galery/brunch.jpg";

let monImage = getImage(titre, imageSource);

galerieImage.innerHTML = monImage;

function getImage(titre, urlImage) {
    titre = sanitizeHtml(titre);
    urlImage = sanitizeHtml(urlImage);
    return `
    <div class="col p-3">
        <div class="image-card text-white">
            <img alt="galerie" class="w-100" src="${urlImage}" />
            <p class="titre-image">${titre}</p>
            <div class="action-image-buttons" data-show="admin">
                <button
                    class="btn btn-outline-light"
                    data-bs-target="#DeletePhotoModal"
                    data-bs-toggle="modal"
                    type="button"
                >
                    <i class="bi bi-trash"></i>
                </button>
                <button
                    class="btn btn-outline-light"
                    data-bs-target="#EditionPhotoModal"
                    data-bs-toggle="modal"
                    type="button"
                >
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button
                    class="btn btn-outline-light"
                    data-bs-target="#DeplacePhotoModal"
                    data-bs-toggle="modal"
                    type="button"
                >
                    <i class="bi bi-arrows-move"></i>
                </button>
            </div>
        </div>
    </div>
    `;
}