// -----------------------------
// Imports et routes de base
// -----------------------------
import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
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

// -----------------------------
// Loader global
// -----------------------------

// Affiche le loader global (doit exister dans index.html)
// function showLoader() {
//   const loader = document.getElementById("site-loader");
//   if (loader) loader.classList.remove("d-none");
// }
//
// // Masque le loader global
// function hideLoader() {
//   const loader = document.getElementById("site-loader");
//   if (loader) loader.classList.add("d-none");
// }

// ----

// ---

// -----------------------------
// Chargement du contenu de la page
// -----------------------------

// Fonction principale pour charger le contenu d'une route dans #main-page
// const LoadContentPage = async () => {
//   showLoader();
//   const path = window.location.pathname;
//   // Récupération de l'URL actuelle
//   const actualRoute = getRouteByUrl(path);
//
//   // Vérifier l'autorisation si nécessaire
//   if (actualRoute.requiresAuth) {
//     // fonctions isConnected() et getRole() doivent être définies globalement (js/scripts.js)
//     if (typeof isConnected === "function") {
//       if (!isConnected()) {
//         // rediriger vers signin
//         window.history.pushState({}, "", "/signin");
//         hideLoader();
//         return LoadContentPage();
//       }
//     }
//     if (
//       actualRoute.roles &&
//       actualRoute.roles.length > 0 &&
//       typeof getRole === "function"
//     ) {
//       const role = getRole();
//       if (!role || !actualRoute.roles.includes(role)) {
//         window.history.pushState({}, "", "/signin");
//         hideLoader();
//         return LoadContentPage();
//       }
//     }
//   }
//
//   // Récupération du contenu HTML de la route et injection
//   document.getElementById("main-page").innerHTML = await fetch(
//     actualRoute.pathHtml,
//   ).then((data) => data.text());
//
//   // Ajout du contenu JavaScript
//   if (actualRoute.pathJS !== "") {
//     // Création d'une balise script
//     var scriptTag = document.createElement("script");
//     scriptTag.setAttribute("type", "text/javascript");
//     scriptTag.setAttribute("src", actualRoute.pathJS);
//
//     // Ajout de la balise script au corps du document
//     document.querySelector("body").appendChild(scriptTag);
//   }
//
//   // Changement du titre de la page
//   document.title = actualRoute.title + " - " + websiteName;
//
//   //Show & Hide
//   showAndHideElementForRole();
//
//   // Masquer le loader une fois que l'affichage est prêt
//   hideLoader();
// };

// ----
// javascript
const LoadContentPage = async () => {
  // Affiche le loader global (fonctions définies dans js/scripts.js)
  if (typeof showSiteLoader === "function") showSiteLoader();

  try {
    const path = window.location.pathname;
    const actualRoute = getRouteByUrl(path) || route404;
    const allRolesArray = actualRoute.authorize;

    // Si des règles d'accès sont définies
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

    // Récupération du contenu HTML de la route
    const html = await fetch(actualRoute.pathHtml).then((res) => res.text());
    document.getElementById("main-page").innerHTML = html;

    // Ajout du script si nécessaire
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

// ---

// -----------------------------
// Gestion des événements de routage
// -----------------------------

// Fonction pour gérer les événements de routage (clic sur les liens)
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
