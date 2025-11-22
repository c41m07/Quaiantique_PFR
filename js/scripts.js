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
  // Retourne vrai si getToken renvoie une valeur "truthy" (chaîne non vide), sinon false
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
function showAndHideElementForRole() {
  const userConnected = isConnected();
  const roleConnected = getRole();

  let allElementsToEdit = document.querySelectorAll("[data-show]");

  allElementsToEdit.forEach((element) => {
    switch (element.dataset.show) {
      case "disconnected":
        if (userConnected) {
          element.classList.add("d-none");
        }
        break;
      case "connected":
        if (!userConnected) {
          element.classList.add("d-none");
        }
        break;
      case "admin":
        if (!userConnected || roleConnected !== "admin") {
          element.classList.add("d-none");
        }
        break;
      case "client":
        if (!userConnected || roleConnected !== "client") {
          element.classList.add("d-none");
        }
        break;
    }
  });
}
