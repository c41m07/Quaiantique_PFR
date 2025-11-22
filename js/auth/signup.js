// -----------------------------
// Script de la page d'inscription
// -----------------------------
// implémentation du js de signup

// Vérification des champs du formulaire
const inputName = document.getElementById("name");
const inputFistname = document.getElementById("firstname");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputConfirmPassword = document.getElementById("confirmPassword");

// Ajout sécurisé des événements keyup (vérifie l'existence avant d'attacher)
if (inputName) inputName.addEventListener("keyup", validateForm);
if (inputFistname) inputFistname.addEventListener("keyup", validateForm);
if (inputEmail) inputEmail.addEventListener("keyup", validateForm);
if (inputPassword) inputPassword.addEventListener("keyup", validateForm);
if (inputConfirmPassword)
  inputConfirmPassword.addEventListener("keyup", validateForm);

// -----------------------------
// Validation du formulaire
// -----------------------------

// Fonction principale de validation qui appelle les validateurs individuels
function validateForm() {
  if (inputName) validateRequired(inputName);
  if (inputFistname) validateRequired(inputFistname);
  if (inputEmail) validateEmail(inputEmail);
  if (inputPassword) validatePassword(inputPassword);
  if (inputConfirmPassword) checkPasswordMatch(inputConfirmPassword);
}

// -----------------------------
// Fonctions utilitaires de validation
// -----------------------------

// Vérifie qu'un champ requis n'est pas vide
function validateRequired(input) {
  if (input && input.value !== "") {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  } else if (input) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    return false;
  }
}

// Valide le format d'un email
function validateEmail(input) {
  if (!input) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mailUser = input.value;
  if (mailUser.match(emailRegex)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Valide la complexité du mot de passe
function validatePassword(input) {
  if (!input) return false;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  const password = input.value;
  if (password.match(passwordRegex)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Vérifie que le mot de passe et sa confirmation correspondent
function checkPasswordMatch(input) {
  if (!input) return false;
  const password = document.getElementById("password")
    ? document.getElementById("password").value
    : "";
  const confirmPassword = document.getElementById("confirmPassword")
    ? document.getElementById("confirmPassword").value
    : "";
  if (password === confirmPassword) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}
