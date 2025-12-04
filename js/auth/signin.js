// -----------------------------
// Script de la page de connexion
// -----------------------------
console.log("Sign-in script loaded");

(function () {
    if (window.__signinScriptLoaded) {
        console.debug('signin script already initialized');
        return;
    }
    window.__signinScriptLoaded = true;

    // Je récupère dynamiquement le client API pour soumettre le formulaire.
    const getApiFetch = () => window.apifetch;

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
    // Vérification des identifiants
    // -----------------------------

    async function checkCredentials() {
        if (!signinForm) {
            console.warn('Formulaire de connexion introuvable');
            return;
        }

        const dataForm = new FormData(signinForm);
        const payload = {
            username: dataForm.get('Email'),
            password: dataForm.get('Password')
        };

        try {
            const api = getApiFetch();
            if (!api) {
                throw new Error('Client API indisponible');
            }
            const result = await api('/api/security/login', {
                method: 'POST',
                body: payload
            });

            if (result?.apiToken) {
                setToken(result.apiToken);
                if (Array.isArray(result.roles) && result.roles[0]) {
                    setCookie(roleCookieName, result.roles[0], 7);
                }
                window.location.href = '/account';
                return;
            }

            throw new Error('Réponse inattendue lors de la connexion');
        } catch (error) {
            console.error('Erreur de connexion', error);
            if (mailInput) mailInput.classList.add('is-invalid');
            if (passwordInput) passwordInput.classList.add('is-invalid');
        }
    }
})();