// -----------------------------
// Définition des routes du site
// -----------------------------
import Route from "./Route.js";

// Définir ici vos routes (une instance Route par page)
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),

    new Route(
        "/galerie",
        "La galerie",
        "/pages/galerie.html",
        [],
        "/js/validation/galerie.js",
        "/js/galerie.js"
    ),

    new Route(
        "/signin",
        "connexion",
        "/pages/auth/signin.html",
        ["disconnected"],
        "/js/auth/signin.js",
    ),
    new Route(
        "/signup",
        "inscription",
        "/pages/auth/signup.html",
        ["disconnected"],
        "/js/auth/signup.js",
    ),
    new Route(
        "/account",
        "mon compte",
        "/pages/auth/account.html",
        ["ROLE_USER", "ROLE_ADMIN"],
        "/js/validation/account.js",
    ),
    new Route(
        "/password_edit",
        "modifier mot de passe",
        "/pages/auth/editpassword.html",
        ["ROLE_USER", "ROLE_ADMIN"],
        "/js/validation/password.js",
    ),
    new Route("/reservation", "réservation", "/pages/reservation/allresa.html", [
        "ROLE_USER",
        "ROLE_ADMIN",
    ]),
    new Route(
        "/reserver",
        "réserver une table",
        "/pages/reservation/reserver.html",
        ["ROLE_USER", "ROLE_ADMIN"],
        "/js/validation/reservation.js",
    ),

    new Route("/menu", "notre menu", "/pages/carte.html", []),
];

// Le titre s'affiche comme ceci : Route.titre - websiteName
export const websiteName = "Quai Antique";
