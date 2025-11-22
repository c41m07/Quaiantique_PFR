// fichier : js/scripts.js

// -----------------------------
// Constantes et éléments DOM
// -----------------------------
// Constantes utilisées pour nommer les cookies
const tokenCookieName = "auth_token";
const roleCookieName = "role";

// Définition des variables nécessaires
const actualRoute = { title: "Default Title" }; // Exemple de valeur par défaut
const websiteName = "My Website"; // Exemple de valeur par défaut

// Exécute les opérations dépendantes du DOM après que le DOM soit prêt
document.addEventListener("DOMContentLoaded", function () {
  // Récupération du bouton de déconnexion dans le DOM (peut être absent)
  const btnSignout = document.getElementById("signoutbtn");

  // Ajout sécurisé de l'écouteur de clic sur le bouton de déconnexion
  // (vérifie d'abord que l'élément existe dans la page)
  if (btnSignout) {
    btnSignout.addEventListener("click", signOut);
  }

  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  //Afficher et masquer les éléments en fonction du rôle
  showAndHideElementsForRoles();
});

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
  // Encodage simple pour éviter les problèmes avec des caractères spéciaux
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
  // Utiliser `path` en minuscule et `expires` en minuscule pour être conforme
  document.cookie = name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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
  var r = getCookie(roleCookieName);
  if (typeof r === "string") return r.trim().toLowerCase();
  return null;
}

// -----------------------------
// Gestion de la connexion / déconnexion
// -----------------------------

/**
 * Indique si l'utilisateur est considéré comme connecté.
 * Renvoie true si un token est présent, false sinon.
 */
function isConnected() {
  // Utiliser coercition booléenne sur la valeur du token
  return !!getToken();
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
 * Exemples de valeurs pour data-show : "disconnected", "connected", "admin", "client".
 */

function showAndHideElementsForRoles() {
  const userConnected = isConnected();
  let role = getRole();
  if (role === null) role = null; // explicite

  let allElementsToEdit = document.querySelectorAll("[data-show]");

  allElementsToEdit.forEach((element) => {
    const criterion = (element.dataset.show || "").trim();
    let shouldShow = true;

    switch (criterion) {
      case "disconnected":
        shouldShow = !userConnected;
        break;
      case "connected":
        shouldShow = userConnected;
        break;
      case "admin":
        shouldShow = userConnected && role === "admin";
        break;
      case "client":
        shouldShow = userConnected && role === "client";
        break;
      default:
        // Si la valeur n'est pas reconnue on laisse l'élément tel quel
        shouldShow = true;
    }

    // Ajoute ou retire proprement la classe d-none
    element.classList.toggle("d-none", !shouldShow);
  });
}
