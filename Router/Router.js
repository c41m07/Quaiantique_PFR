// -----------------------------
// Imports et routes de base
// -----------------------------
import Route from "./Route.js";
import {allRoutes, websiteName} from "./allRoutes.js";
import './Route.js';
import '../js/config.js';
import '../js/apiClient.js';

// Je définis une route 404 utilisée comme fallback lorsque l’URL ne correspond à rien.
const route404 = new Route(
    "404",
    "Page introuvable",
    "/pages/404.html",
    false,
    [],
);

// -----------------------------
// Récupération de route
// -----------------------------

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
    let currentRoute = null;
    // Parcours de toutes les routes pour trouver la correspondance
    allRoutes.forEach((element) => {
        if (element.url === url) {
            currentRoute = element;
        }
    });
    // Si aucune correspondance n'est trouvée, on retourne la route 404
    if (currentRoute !== null) {
        return currentRoute;
    } else {
        return route404;
    }
};
const LoadContentPage = async () => {
    // Je m’assure de montrer le loader tant que la page n’est pas injectée.
    if (typeof showSiteLoader === "function") showSiteLoader();

    try {
        const path = window.location.pathname;
        const actualRoute = getRouteByUrl(path) || route404;
        const allRolesArray = actualRoute.authorize;

        // Je contrôle ici les accès en fonction du rôle ou de l’état de connexion.
        if (allRolesArray.length > 0) {
            // cas spécial : page réservée aux "disconnected" (utilisateurs non connectés)
            if (allRolesArray.includes("disconnected")) {
                if (typeof isConnected === "function" && isConnected()) {
                    if (typeof hideSiteLoader === "function") hideSiteLoader();
                    window.location.replace("/");
                    return;
                }
            } else {
                // vérification du rôle de l'utilisateur
                const roleUser = typeof getRole === "function" ? getRole() : null;
                if (!allRolesArray.includes(roleUser)) {
                    if (typeof hideSiteLoader === "function") hideSiteLoader();
                    window.location.replace("/");
                    return;
                }
            }
        }

        // Je charge ensuite le HTML associé à la route et je l’injecte dans #main-page.
        const html = await fetch(actualRoute.pathHtml)
            .then((res) => res.text())
            .catch((err) => {
                console.error("Erreur lors de la récupération du contenu HTML:", err);
                return "<h1>Erreur de chargement</h1>";
            });
        document.getElementById("main-page").innerHTML = html;

        if (actualRoute.validator !== "") {
            const scriptTag = document.createElement("script");
            scriptTag.type = "text/javascript";
            scriptTag.src = actualRoute.validator;
            document.querySelector("body").appendChild(scriptTag);
        }

        // Je charge un script spécifique à la page si nécessaire (pathJS).
        if (actualRoute.pathJS !== "") {
            const scriptTag = document.createElement("script");
            scriptTag.type = "text/javascript";
            scriptTag.src = actualRoute.pathJS;

            // Quand le script est chargé, exécuter le show/hide des éléments puis masquer le loader
            scriptTag.onload = () => {
                if (typeof showAndHideElementsForRoles === "function") {
                    try {
                        showAndHideElementsForRoles();
                    } catch (e) {
                        console.error("Erreur lors de showAndHideElementsForRoles:", e);
                    }
                }
                if (typeof hideSiteLoader === "function") hideSiteLoader();
            };

            document.querySelector("body").appendChild(scriptTag);

            // En cas où le script ne déclencherait pas onload (cache/erreur), placer un fallback
            setTimeout(() => {
                if (typeof showAndHideElementsForRoles === "function") {
                    try {
                        showAndHideElementsForRoles();
                    } catch (e) {
                        console.error(
                            "Erreur lors de showAndHideElementsForRoles (fallback):",
                            e,
                        );
                    }
                }
                if (typeof hideSiteLoader === "function") hideSiteLoader();
            }, 800);
        } else {
            // Pas de script : on peut appeler directement le show/hide et masquer le loader
            if (typeof showAndHideElementsForRoles === "function") {
                try {
                    showAndHideElementsForRoles();
                } catch (e) {
                    console.error("Erreur lors de showAndHideElementsForRoles:", e);
                }
            }
            if (typeof hideSiteLoader === "function") hideSiteLoader();
        }
    } catch (err) {
        console.error("Erreur lors du chargement de la route:", err);
        if (typeof hideSiteLoader === "function") hideSiteLoader();
    }
};

// Je gère ici la navigation côté client (pushState + interception des clics).
const routeEvent = (event) => {
    event = event || window.event;
    event.preventDefault();
    // Mise à jour de l'URL dans l'historique du navigateur
    window.history.pushState({}, "", event.target.href);
    // Chargement du contenu de la nouvelle page
    LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();