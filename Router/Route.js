// -----------------------------
// Classe Route
// -----------------------------

// Classe représentant une route du site
// Propriétés :
// - url: chemin de la route (ex: "/home")
// - title: titre de la page
// - pathHtml: chemin du fichier HTML à injecter
// - pathJS: (optionnel) chemin du script JS à charger pour cette page
// - requiresAuth: (optionnel) bool indiquant si la page nécessite une authentification
// - roles: (optionnel) tableau des rôles autorisés
export default class Route {
  constructor(
    url,
    title,
    pathHtml,
    pathJS = "",
    requiresAuth = false,
    roles = [],
  ) {
    this.url = url;
    this.title = title;
    this.pathHtml = pathHtml;
    this.pathJS = pathJS;
    this.requiresAuth = requiresAuth;
    this.roles = roles;
  }
}
