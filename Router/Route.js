// -----------------------------
// Classe Route
// -----------------------------

// Classe représentant une route du site
// Propriétés :
// - url: chemin de la route (ex: "/home")
// - title: titre de la page
// - pathHtml: chemin du fichier HTML à injecter
// - authorize:  bool indiquant si la page nécessite une authentification
// - validator: (optionnel) chemin du script de validation à charger pour cette page
// - pathJS: (optionnel) chemin du script JS à charger pour cette page
export default class Route {
    constructor(url, title, pathHtml, authorize = [], validator = "", pathJS = "") {
        this.url = url;
        this.title = title;
        this.pathHtml = pathHtml;
        this.authorize = authorize;
        this.validator = validator;
        this.pathJS = pathJS;
    }
}
