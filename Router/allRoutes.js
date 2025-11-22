// -----------------------------
// Définition des routes du site
// -----------------------------
import Route from "./Route.js";

// Définir ici vos routes (une instance Route par page)
export const allRoutes = [
  new Route("/", "Accueil", "/pages/home.html"),

  new Route("/galerie", "La galerie", "/pages/galerie.html"),

  new Route(
    "/signin",
    "connexion",
    "/pages/auth/signin.html",
    "/js/auth/signin.js",
  ),
  new Route(
    "/signup",
    "inscription",
    "/pages/auth/signup.html",
    "js/auth/signup.js",
  ),
  new Route("/account", "mon compte", "/pages/auth/account.html", "", true, [
    "client",
    "admin",
  ]),
  new Route(
    "/editpassword",
    "modifier mot de passe",
    "/pages/auth/editpassword.html",
    "",
    true,
    ["client", "admin"],
  ),
  new Route(
    "/reservation",
    "réservation",
    "/pages/reservation/allresa.html",
    "",
    true,
    ["admin"],
  ),
  new Route(
    "/reserver",
    "réserver une table",
    "/pages/reservation/reserver.html",
    "",
    true,
    ["client", "admin"],
  ),

  new Route(
    "/editreservation",
    "édité vos réservation",
    "pages/reservation/reserver.html",
    "",
    true,
    ["client", "admin"],
  ),
  new Route("/menu", "notre menu", "/pages/carte.html", "", false, []),
];

// Le titre s'affiche comme ceci : Route.titre - websiteName
export const websiteName = "Quai Antique";
