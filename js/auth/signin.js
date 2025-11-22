// -----------------------------
// Script de la page de connexion
// -----------------------------
console.log("Sign-in script loaded");

// Récupération des éléments du formulaire (peuvent être absents selon la page)
const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSingin = document.getElementById("btnSignIn");

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
  // Appel d'API FUTURE ICI
  if (
    mailInput &&
    passwordInput &&
    mailInput.value == "test@mail.fr" &&
    passwordInput.value == "123"
  ) {
    // placer un vrai token
    const token = "ceci_est_un_token_de_connexion_test_valide";
    setToken(token);
    setCookie(roleCookieName, ["admin"], 7);
    window.location.href = "/";
  } else if (
    mailInput &&
    passwordInput &&
    mailInput.value == "test2@mail.fr" &&
    passwordInput.value == "1234"
  ) {
    // placer un vrai token
    const token = "ceci_est_un_token_de_connexion_test_valide_client";
    setToken(token);
    setCookie(roleCookieName, "client", 7);
    window.location.href = "/";
  } else {
    // connexion pas OK
    if (mailInput) mailInput.classList.add("is-invalid");
    if (passwordInput) passwordInput.classList.add("is-invalid");
    return false;
  }
}
