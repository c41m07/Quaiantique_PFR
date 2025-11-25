// fichier : js/scripts.js

// -----------------------------
// Constantes et éléments DOM
// -----------------------------
// Constantes utilisées pour nommer les cookies
const tokenCookieName = "auth_token";
const roleCookieName = "role";
// Récupération du bouton de déconnexion dans le DOM (peut être absent)
const btnSignout = document.getElementById("signoutbtn");

// Ajout sécurisé de l'écouteur de clic sur le bouton de déconnexion
// (vérifie d'abord que l'élément existe dans la page)
if (btnSignout) {
    btnSignout.addEventListener("click", signOut);
}

// Définition des variables nécessaires
const actualRoute = {title: "Default Title"}; // Exemple de valeur par défaut
const websiteName = "My Website"; // Exemple de valeur par défaut

// Changement du titre de la page
document.title = actualRoute.title + " - " + websiteName;

// Afficher le loader global (présent dans index.html)
function getSiteLoader() {
    return document.getElementById("site-loader");
}

// Minimum display time (ms)
const SITE_LOADER_MIN_MS = 5000;
let _siteLoaderShownAt = 0;
let _siteLoaderHideTimer = null;

function showSiteLoader() {
    const loader = getSiteLoader();
    if (!loader) return;
    // annule timer de masquage en cours
    if (_siteLoaderHideTimer) {
        clearTimeout(_siteLoaderHideTimer);
        _siteLoaderHideTimer = null;
    }
    // afficher immédiatement
    loader.classList.remove("d-none");
    _siteLoaderShownAt = Date.now();
}

/**
 * Masque le loader en respectant un temps minimum d'affichage.
 * Si force === true, masque immédiatement (annule le délai).
 */
function hideSiteLoader(force = true) {
    const loader = getSiteLoader();
    if (!loader) return;
    if (force) {
        loader.classList.add("d-none");
        _siteLoaderShownAt = 0;
        if (_siteLoaderHideTimer) {
            clearTimeout(_siteLoaderHideTimer);
            _siteLoaderHideTimer = null;
        }
        return;
    }

    const elapsed = _siteLoaderShownAt
        ? Date.now() - _siteLoaderShownAt
        : SITE_LOADER_MIN_MS;
    const remaining = Math.max(0, SITE_LOADER_MIN_MS - elapsed);

    if (_siteLoaderHideTimer) {
        clearTimeout(_siteLoaderHideTimer);
    }

    _siteLoaderHideTimer = setTimeout(() => {
        loader.classList.add("d-none");
        _siteLoaderShownAt = 0;
        _siteLoaderHideTimer = null;
    }, remaining);
}

// Afficher et masquer les éléments en fonction du rôle
// Avant d'appeler showAndHideElementsForRoles on affiche le loader, et on le masque juste après
showSiteLoader();
try {
    showAndHideElementsForRoles();
} catch (err) {
    // En cas d'erreur, on log et on continue (loader sera masqué par le fallback)
    console.error("Erreur lors de showAndHideElementsForRoles:", err);
}

// Toujours masquer le loader après un court délai si la fonction ne l'a pas fait.
// Cela évite de bloquer l'UI indéfiniment.
setTimeout(() => hideSiteLoader(), 500);

// -----------------------------
// Gestion des cookies (lecture / écriture / suppression)
// -----------------------------

/**
 * Écrit un cookie avec un nom, une valeur et une durée en jours.
 * name: string, value: string, days: number | undefined
 */
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Lit la valeur d'un cookie par son nom.
 * Retourne la valeur (string) ou null si le cookie n'existe pas.
 */
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        // Supprime les espaces de début (trimStart pour éviter les comparaisons non-strictes)
        c = c.trimStart();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Supprime un cookie en le réinitialisant avec une date d'expiration passée.
 */
function eraseCookie(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// -----------------------------
// Gestion du token d'authentification
// -----------------------------

/**
 * Enregistre le token d'authentification dans un cookie (durée fixée).
 * token: string
 */
function setToken(token) {
    setCookie(tokenCookieName, token, 7);
}

/**
 * Récupère le token d'authentification depuis le cookie.
 * Retourne la valeur (string) ou null si absent.
 */
function getToken() {
    return getCookie(tokenCookieName);
}

// -----------------------------
// Gestion du rôle
// -----------------------------

/**
 * Récupère le rôle de l'utilisateur depuis le cookie.
 * Retourne la valeur (string) ou null si absent.
 */
function getRole() {
    return getCookie(roleCookieName);
}

// -----------------------------
// Gestion de la connexion / déconnexion
// -----------------------------

/**
 * Indique si l'utilisateur est considéré comme connecté.
 * Renvoie true si un token est présent, false sinon.
 */
function isConnected() {
    const token = getToken();
    return token !== null && token !== undefined && token !== "";
}

/**
 * Déconnecte l'utilisateur : supprime token et rôle, puis redirige vers la racine.
 */
function signOut() {
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    window.location.href = "/";
}

// -----------------------------
// Affichage conditionnel selon le rôle / état de connexion
// -----------------------------

/**
 * Parcourt les éléments marqués par l'attribut data-show et affiche/masque
 * chaque élément selon l'état de connexion et le rôle de l'utilisateur.
 * Exemples de valeurs pour data-show : "disconnected", "connected", "ROLE_ADMIN", "ROLE_USER".
 */

function showAndHideElementsForRoles() {
    const userConnected = isConnected();
    const role = getRole();

    let allElementsToEdit = document.querySelectorAll("[data-show]");

    allElementsToEdit.forEach((element) => {
        switch (element.dataset.show) {
            case "disconnected":
                if (userConnected) {
                    element.classList.add("d-none");
                } else {
                    element.classList.remove("d-none");
                }
                break;
            case "connected":
                if (!userConnected) {
                    element.classList.add("d-none");
                } else {
                    element.classList.remove("d-none");
                }
                break;
            case "admin":
                if (!userConnected || role !== "ROLE_ADMIN") {
                    element.classList.add("d-none");
                } else {
                    element.classList.remove("d-none");
                }
                break;
            case "client":
                if (!userConnected || role !== "ROLE_USER") {
                    element.classList.add("d-none");
                } else {
                    element.classList.remove("d-none");
                }
                break;
        }
    });

    // Une fois fini, masquer le loader
    hideSiteLoader();
}

function sanitizeHtml(html) {
    const tempHtml = document.createElement('div');
    tempHtml.textContent = html;
    return tempHtml.innerHTML;
}

function getInfoUser() {
    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/api/account/me", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Erreur lors de la récupération des informations utilisateur.");
            }
        })
        .then(result => {
            return result;
        })
        .catch(error => console.error('error user', error))
}