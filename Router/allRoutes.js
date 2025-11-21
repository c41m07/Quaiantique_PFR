import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
  new Route("/", "Accueil", "/pages/home.html"),
  new Route("/galerie", "La galerie", "/pages/galerie.html"),
  new Route("/signin", "connexion", "/pages/signin.html"),
  new Route("/signup", "inscription", "/pages/signup.html"),
  new Route("/account", "mon compte", "/pages/account.html"),
  new Route(
    "/editpassword",
    "modifier mot de passe",
    "/pages/editpassword.html",
  ),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Quai Antique";
