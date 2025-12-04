(function () {
    if (window.__signupScriptLoaded) {
        console.debug('signup script already initialized');
        return;
    }
    window.__signupScriptLoaded = true;

    // Je récupère le client API pour envoyer les données du formulaire vers Symfony.
    const getApiFetch = () => window.apifetch;

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
        const nameValid = nameEl ? validateNameLike(nameEl) : true;
        valid = valid && nameValid;

        const firstnameValid = firstnameEl ? validateNameLike(firstnameEl) : true;
        valid = valid && firstnameValid;


        const emailValid = emailEl ? validateEmail(emailEl) : true;
        valid = valid && emailValid;

        const passwordValid = passwordEl ? validatePassword(passwordEl) : true;
        valid = valid && passwordValid;

        const confirmValid = confirmEl ? checkPasswordMatch(confirmEl) : true;
        valid = valid && confirmValid;

        return valid;
    }

    // Je garde les helpers de validation tels quels (nom, email, mot de passe, etc.).
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

    // Valide le format d'un nom ou prénom
    function validateNameLike(input) {
        if (!input) return false;
        const value = input.value ? input.value.trim() : "";
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
        if (nameRegex.test(value)) {
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
    async function SignUpUser() {
        if (!formEl) {
            console.log("Formulaire introuvable: FormSignup");
            return;
        }

        if (!validateForm()) {
            console.log('SignUpUser annulée : formulaire invalide (guard)');
            return;
        }

        const dataForm = new FormData(formEl);
        const payload = {
            firstName: dataForm.get("firstname"),
            lastName: dataForm.get("name"),
            email: dataForm.get("email"),
            password: dataForm.get("password")
        };

        console.log('SignUpUser envoi:', {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email
        });

        try {
            const api = getApiFetch();
            if (!api) {
                throw new Error('Client API indisponible');
            }
            const result = await api('/api/security/register', {
                method: 'POST',
                body: payload
            });

            if (result) {
                alert("Bravo tu est maintenant inscrit !");
                document.location.href = "/signin";
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription', error);
            alert("Hoho un problème lors de l'inscription est survenu");
        }
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
})();