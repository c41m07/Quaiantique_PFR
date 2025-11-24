// -----------------------------
// Script de la page de connexion
// -----------------------------
console.log("Sign-in script loaded");

// Récupération des éléments du formulaire (peuvent être absents selon la page)
const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSingin = document.getElementById("btnSignIn");
const signinForm = document.getElementById("FormSignIn");

// Ajout sécurisé de l'écouteur de clic sur le bouton de connexion
if (btnSingin) {
    btnSingin.addEventListener("click", checkCredentials);
}

// -----------------------------
// Vérification des identifiants (fonction de démonstration)
// -----------------------------

// Vérifie si les identifiants correspondent à un jeu de test.
// Remplacer par un appel API réel en production.
function checkCredentials() {
    let dataForm = new FormData(signinForm);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "username": dataForm.get("Email"),
        "password": dataForm.get("Password")
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/api/login", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // connexion pas OK
                if (mailInput) mailInput.classList.add("is-invalid");
                if (passwordInput) passwordInput.classList.add("is-invalid");
            }
        })
        .then(result => {
            if (result) {
                // placer un vrai token
                const token = result.apiToken;
                setToken(token);
                if (mailInput && mailInput.value === "admin@admin.fr") {
                    setCookie(roleCookieName, "admin", 7);
                    window.location.href = "/account";
                } else {
                    setCookie(roleCookieName, result.roles[0], 7);
                    window.location.href = "/account";
                }
            }
        })

        .catch(error => console.log('error', error));
}

// Appel d'API FUTURE ICI