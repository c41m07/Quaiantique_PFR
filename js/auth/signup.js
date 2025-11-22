// -----------------------------
// Script de la page d'inscription
// -----------------------------
// implémentation du js de signup

// Vérification des champs du formulaire
const btn_validate = document.getElementById("btn_validate_signup");
const nameEl = document.getElementById("name");
const firstnameEl = document.getElementById("firstname");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const confirmEl = document.getElementById("confirmPassword");
const formEl = document.getElementById("FormSignup");

// -----------------------------
// Validation du formulaire
// -----------------------------

// Fonction principale de validation qui appelle les validateurs individuels
function validateForm() {
    let valid = true;

    // On récupère le résultat de chaque validateur et on l'agrège
    const nameValid = nameEl ? validateRequired(nameEl) : true;
    valid = valid && nameValid;

    const firstnameValid = firstnameEl ? validateRequired(firstnameEl) : true;
    valid = valid && firstnameValid;

    const emailValid = emailEl ? validateEmail(emailEl) : true;
    valid = valid && emailValid;

    const passwordValid = passwordEl ? validatePassword(passwordEl) : true;
    valid = valid && passwordValid;

    const confirmValid = confirmEl ? checkPasswordMatch(confirmEl) : true;
    valid = valid && confirmValid;

    // Mise à jour de l'état du bouton d'envoi
    if (btn_validate) btn_validate.disabled = !valid;

    return valid;
}

// -----------------------------
// Fonctions utilitaires de validation
// -----------------------------

// Vérifie qu'un champ requis n'est pas vide
function validateRequired(input) {
    if (!input) return false;
    const value = input.value ? input.value.trim() : "";
    if (value !== "") {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        return true;
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        return false;
    }
}

// Valide le format d'un email
function validateEmail(input) {
    if (!input) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailUser = input.value ? input.value.trim() : "";
    if (emailRegex.test(mailUser)) {
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const password = input.value ? input.value : "";
    if (passwordRegex.test(password)) {
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
    const password = document.getElementById("password") ? document.getElementById("password").value : "";
    const confirmPassword = document.getElementById("confirmPassword") ? document.getElementById("confirmPassword").value : "";
    // On exige que les deux champs soient non-vides ET identiques
    if (password !== "" && password === confirmPassword) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

// Fonction pour inscrire l'utilisateur
function SignUpUser() {
    if (!formEl) {
        console.log("Formulaire introuvable: FormSignup");
        return;
    }

    // Protection supplémentaire : si la validation échoue, on n'envoie pas
    if (!validateForm()) {
        console.log('SignUpUser annulée : formulaire invalide (guard)');
        return;
    }

    let dataForm = new FormData(formEl);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "firstName": dataForm.get("firstname"),
        "lastName": dataForm.get("name"),
        "email": dataForm.get("email"),
        "password": dataForm.get("password")
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    console.log('SignUpUser envoi:', {firstName: dataForm.get("firstname"), lastName: dataForm.get("name"), email: dataForm.get("email")});

    fetch("http://127.0.0.1:8000/api/registration", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

// Attacher la validation sur le submit du formulaire si présent
if (formEl) {
    formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            SignUpUser();
        } else {
            console.log('formulaire invalide (submit)');
        }
    });
}

// Fallback: bouton click
if (btn_validate) {
    btn_validate.addEventListener("click", function (e) {
        e.preventDefault();
        if (validateForm()) {
            SignUpUser();
        } else {
            console.log("formulaire invalide (click)");
        }
    });
}