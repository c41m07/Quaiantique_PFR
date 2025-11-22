# Quai Antique — README officiel (mise à jour)

But de ce fichier

- Fournir un état clair, précis et à jour du projet par rapport au cahier des charges (`docs/CDC_Quai_Antique.md`) et donner une TODO séparée :
  *Front (prioritaire)* puis *Back*.

Dernière mise à jour : 22/11/2025

---

1) Contexte rapide

- Projet : site vitrine + administration pour le restaurant "Quai Antique".
- Sources des exigences : `docs/CDC_Quai_Antique.md` et `docs/Diagramme sans nom.drawio.html`.
- Stack actuelle (dépôt) : pages HTML/CSS/JS statiques, router client dans `Router/`, assets dans `image/`, styles dans `scss/`.
- Aucun back-end n'est présent dans le dépôt (pas d'API, pas de DB).

2) État du dépôt (fichiers et structure pertinents)

- `index.html` : layout principal (header, footer, point d'injection `#main-page`).
- `Router/` : `allRoutes.js`, `Route.js`, `Router.js` — routage client (injection de pages + script loader).
- `pages/` : contenu HTML statique (home, galerie, carte, reservation, auth, etc.).
- `js/` : `scripts.js` (gestion cookies/auth côté client), `auth/` (signin.js, signup.js).
- `scss/` : styles (main.scss, result css).
- `docs/` : CDC et diagramme.

3) Comparaison synthétique CDC → état actuel

- Auth (CDC) : inscription + connexion, admin seedé, pré-remplissage formulaires → Statut : front UI présent, back absent.
- Galerie (CDC) : CRUD images + titre au survol + CTA vers réservation → Statut : UI + modals présents, upload/CRUD serveur manquants.
- Carte & menus (CDC) : CRUD catégories/plats/menus → Statut : page publique statique ok, CRUD manquant.
- Réservations (CDC) : créneaux 15 min, services 2h, vérification disponibilité, max convives, auth requise pour réserver → Statut : formulaire côté
  client présent, logique disponibilité et auth manquantes.
- Paramètres restaurant (CDC) : horaires & max convives modifiables par admin → Statut : non implémenté.

En résumé : le front (UI) est largement démarré. La logique métier et la persistance demandées par le CDC nécessitent un back-end que le dépôt ne
contient pas encore.

---

4) Objectif de cette mise à jour README

- Séparer proprement les travaux à faire pour le *Front* (priorité) et le *Back* (après front), en intégrant la liste de tâches que tu as fournie et
  en complétant par de petites tâches utiles pour la mise en œuvre.

---

5) TODO — FRONT (PRIORITAIRE)
   Le front doit être stabilisé, rendu robuste et prêt à consommer des APIs (mock ou réelles). Voici la liste priorisée et actionnable.

A. Flux et sécurité UX (critique)

- [ ] Authentification dans le routage : protéger les routes qui exigent d'être connecté (`/reserver`, `/account`, pages d'administration). Ajouter
  `requiresAuth`/`roles` dans `Router/allRoutes.js` et vérifier côté router avant d'injecter la page.
- [ ] Ajouter un loader global : afficher pendant le fetch/injection des pages et masquer après `showAndHideElementForRole(...)` et initialisation de
  la page.
- [ ] Valider tous les formulaires (client-side) : signup, signin, reserver, modals galerie — HTML5 + validation JS (messages inline, classes
  `.is-invalid`).
- [ ] Confirmation d'annulation d'une réservation : implémenter une modale réutilisable de confirmation (ou page si tu préfères), puis n'exécuter la
  suppression qu'après confirmation.

B. Fonctionnalité & Intégration

- [ ] Page de gestion de la carte (UI admin) : `pages/admin/carte.html` ou équivalent, modals pour CRUD catégories/plats/menus (prête à appeler
  l'API).
- [ ] Finaliser la page publique "La carte" : rendre la structure modulaire, prévoir chargement depuis `data/carte.json` (mock) ou via `js/api.js`.
- [ ] Créer `js/api.js` : wrapper fetch (headers, Authorization, gestion erreurs, timeouts) pour standardiser appels API.
- [ ] Mettre en place gestion d'erreurs globale côté client : toasts/alert area (`showError`, `showSuccess`).

C. Expérience & design

- [ ] Animations d'arrivée des blocs (CSS + petit JS pour stagger) pour lisser le rendu et rendre l'arrivée des sections plus fluide.
- [ ] Nouveau design system (optionnel) : `scss/_alt-design.scss` + palette Coolors, polices et variantes; permettre switch/comment pour tester.
- [ ] Prototypage Figma : ajouter lien dans README / `docs/figma.md` si tu fournis le prototype.

D. Sécurité & déploiement front

- [ ] Recommandations de sécurité front : documenter stratégie de stockage token (cookies HttpOnly recommandés), éviter innerHTML pour contenus non
  sûrs, limiter taille d'upload côté client, échapper tout contenu dynamique.
- [ ] Mettre en ligne la partie front (statisque) : instructions pour GitHub Pages / Netlify / Vercel (préparer un petit build si besoin).

E. Petits compléments recommandés

- [ ] Ajouter des fonctions d'initialisation par page (`initPageName()`) et documenter l'API du router pour les appeler après injection.
- [ ] Tests manuels à réaliser : navigation/routing, loader, formulaires valides/invalide, modale annulation.
- [ ] Accessibility quick pass : aria-labels, focus management, contraste.

---

6) TODO — BACK (après stabilisation du Front)
   Le back fournira persistance et règles métier (auth, réservations, images, plats/menus).

Priorité haute (core)

- [ ] Initialiser `server/` (Node.js + Express) et DB (SQLite en dev).
- [ ] Auth & Users : POST `/api/auth/signup`, POST `/api/auth/signin`, GET/PUT/DELETE `/api/users/me`; seed admin.
- [ ] Settings Restaurant : endpoints pour `openHourLunch`, `openHourDinner`, `maxConvives`.
- [ ] Réservations : POST `/api/reservations` (vérification disponibilité 15-min slots sur fenêtre 2h), GET `/api/reservations` (admin filter par
  date), GET `/api/reservations/me`, PUT/DELETE avec autorisations.
- [ ] Galerie/Images : upload via `multer`, CRUD `/api/images` (titre + filename), stockage `uploads/` ou cloud.
- [ ] Plats/Catégories/Menus : endpoints CRUD, relations simples.

Priorité moyenne

- [ ] Validation serveur, tests unitaires/integration, logging, rate-limiting.

Déploiement & infra

- [ ] Dockerfile, scripts start/prod, documentation déploiement.

---

7) TODO court (liste actionable à cocher)

- Front (priorité) :
    - [x] Auth dans le routage
    - [x] Ajouter loader global
    - [ ] Valider tous les formulaires
    - [ ] Implémenter modale confirmation annulation réservation
    - [ ] Créer page gestion carte (UI)
    - [ ] Rendre `pages/carte.html` modulaire (mock JSON)
    - [ ] Créer `js/api.js` (wrapper fetch)
    - [ ] Ajouter animations d'arrivée
    - [ ] Prototypage/design (Figma + alt design)
    - [ ] Documenter sécurité front
    - [ ] Préparer déploiement statique
- Back (après front) :
    - [ ] Générer `server/` + endpoints auth
    - [ ] Réservations logique disponibilité
    - [ ] CRUD images + upload
    - [ ] CRUD plats/menus/categories