// DEBUG profiler JS amélioré
// Lit le rôle et le statut depuis :
// 1) un token stocké en cookie (essaye plusieurs noms communs), en décodant le payload JWT si possible
// 2) fallback : localStorage.userRole et localStorage.isAuthenticated

(function () {
  const roleEl = document.getElementById("debug-role");
  const statusEl = document.getElementById("debug-status");
  const toggleBtn = document.getElementById("debug-toggle");
  const profiler = document.getElementById("debug-profiler");

  if (!roleEl || !statusEl || !toggleBtn || !profiler) return;

  // noms de cookie candidats à vérifier pour le token
  // priorité aux cookies utilisés par votre app : auth_token et role
  const COOKIE_CANDIDATES = [
    "auth_token", // votre cookie d'auth principal
    "authToken",
    "token",
    "accessToken",
    "jwt",
    "session",
  ];

  const ROLE_COOKIE_NAMES = ["role", "user_role", "userRole"];
  // cache pour /api/me et throttle
  let fetchCache = null;
  let lastFetchAt = 0;

  function getCookie(name) {
    const m = document.cookie.match(
      "(?:^|; )" +
        name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1") +
        "=([^;]*)",
    );
    return m ? decodeURIComponent(m[1]) : null;
  }

  function findTokenInCookies() {
    for (const n of COOKIE_CANDIDATES) {
      const v = getCookie(n);
      if (v) return { name: n, value: v };
    }
    return null;
  }

  function findRoleInCookies() {
    for (const n of ROLE_COOKIE_NAMES) {
      const v = getCookie(n);
      if (v) return { name: n, value: v };
    }
    return null;
  }

  // décode un JWT (payload) sans vérification
  function parseJwt(token) {
    try {
      if (!token) return null;
      // enlever 'Bearer ' si présent
      token = token.trim();
      if (token.toLowerCase().startsWith("bearer "))
        token = token.slice(7).trim();
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = parts[1];
      // base64url -> base64
      const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      // pad
      const pad = b64.length % 4;
      const padded = pad ? b64 + "====".slice(0, 4 - pad) : b64;
      const json = decodeURIComponent(
        atob(padded)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function extractRoleFromPayload(payload) {
    if (!payload) return null;
    // clés possibles
    const keys = [
      "role",
      "roles",
      "roleName",
      "userRole",
      "authority",
      "authorities",
      "scope",
      "scopes",
    ];
    for (const k of keys) {
      if (payload[k]) {
        const val = payload[k];
        if (Array.isArray(val)) return val.length ? String(val[0]) : null;
        if (typeof val === "string") return val;
        if (typeof val === "object") return JSON.stringify(val);
      }
    }
    // parfois rôle dans subclaim ou custom claim
    if (payload["sub"]) return String(payload["sub"]);
    return null;
  }

  function readState() {
    // priorité aux cookies: role direct ou auth_token
    const cookieRole = findRoleInCookies();
    const cookieToken = findTokenInCookies();
    let role = null;
    let isAuth = false;

    if (cookieRole) {
      role = cookieRole.value;
      isAuth = !!cookieToken;
    } else if (cookieToken) {
      isAuth = true;
      // tenter de décoder le JWT auth_token
      const payload = parseJwt(cookieToken.value);
      if (payload) {
        role = extractRoleFromPayload(payload) || "—";
      } else {
        // si la valeur du cookie est JSON ou contient role=...
        try {
          const maybeJson = JSON.parse(cookieToken.value);
          role = maybeJson.role || maybeJson.userRole || "—";
        } catch (e) {
          const m = cookieToken.value.match(/role=([^;,&]+)/);
          if (m) role = decodeURIComponent(m[1]);
        }
      }
    }

    // fallback vers localStorage si pas de cookie
    if (!role) {
      const lsRole = localStorage.getItem("userRole");
      if (lsRole) role = lsRole;
    }

    // fallback pour isAuth depuis localStorage
    if (!isAuth) {
      const rawAuth = localStorage.getItem("isAuthenticated");
      if (rawAuth === "1" || rawAuth === "true" || rawAuth === "yes")
        isAuth = true;
    }

    if (!role) role = "—";
    return { role, isAuth };
  }

  function render() {
    const state = readState();
    // déterminer la source
    const source =
      findRoleInCookies() || findTokenInCookies()
        ? "cookie"
        : fetchCache
          ? "fetch"
          : "localStorage";
    profiler.setAttribute("data-source", source);
    console.debug("[DEBUG PROFILER] render", {
      role: state.role,
      isAuth: state.isAuth,
      source,
      fetchCache,
    });
    roleEl.textContent = state.role;
    statusEl.textContent = state.isAuth ? "connecté" : "déconnecté";

    if (
      state.role &&
      state.role.toLowerCase &&
      state.role.toLowerCase() === "admin"
    ) {
      roleEl.style.fontWeight = "700";
    } else {
      roleEl.style.fontWeight = "400";
    }
  }

  // persistance du mode masqué
  function applyHiddenStateFromStorage() {
    const h = localStorage.getItem("debugHidden");
    const shouldHide = h === "1" || h === "true";
    if (shouldHide) {
      profiler.classList.add("hidden");
      toggleBtn.textContent = "Afficher";
    } else {
      profiler.classList.remove("hidden");
      toggleBtn.textContent = "Masquer";
    }
  }

  toggleBtn.addEventListener("click", function () {
    profiler.classList.toggle("hidden");
    toggleBtn.textContent = profiler.classList.contains("hidden")
      ? "Afficher"
      : "Masquer";
    try {
      localStorage.setItem(
        "debugHidden",
        profiler.classList.contains("hidden") ? "1" : "0",
      );
    } catch (e) {}
  });

  // surcharge setItem pour détecter changements localStorage dans le même onglet
  (function () {
    try {
      const origSet = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        origSet.apply(this, arguments);
        try {
          window.dispatchEvent(
            new CustomEvent("local-storage-changed", {
              detail: { key, value },
            }),
          );
        } catch (e) {}
      };
    } catch (e) {}
  })();

  window.addEventListener("local-storage-changed", function (e) {
    if (!e || !e.detail) return;
    const key = e.detail.key;
    if (
      key === "userRole" ||
      key === "isAuthenticated" ||
      key === "debugHidden"
    ) {
      if (key === "debugHidden") applyHiddenStateFromStorage();
      render();
    }
  });

  // écoute cross-tab
  window.addEventListener("storage", function (e) {
    if (!e) return;
    if (
      e.key === "userRole" ||
      e.key === "isAuthenticated" ||
      e.key === "debugHidden"
    ) {
      if (e.key === "debugHidden") applyHiddenStateFromStorage();
      render();
    }
  });

  // fallback: poll léger (2s) pour détecter changements de cookie/LS
  let last = readState();
  let cookieSnapshot = typeof document !== "undefined" ? document.cookie : "";
  setInterval(function () {
    try {
      // détecter changement de cookie (utile si cookie HttpOnly modifié côté serveur)
      const currentCookie =
        typeof document !== "undefined" ? document.cookie : "";
      if (currentCookie !== cookieSnapshot) {
        cookieSnapshot = currentCookie;
        // relancer tentative fetch et rendu
        tryFetchMe();
        const cur = readState();
        last = cur;
        render();
        return; // passer au prochain interval
      }

      const cur = readState();
      if (cur.role !== last.role || cur.isAuth !== last.isAuth) {
        last = cur;
        render();
      }
      const hidden = localStorage.getItem("debugHidden");
      const wasHidden = profiler.classList.contains("hidden");
      const shouldHide = hidden === "1" || hidden === "true";
      if (shouldHide !== wasHidden) applyHiddenStateFromStorage();
    } catch (e) {}
  }, 2000);

  // rerender si bouton de déconnexion cliqué
  const signout = document.getElementById("signoutbtn");
  if (signout) {
    signout.addEventListener("click", function () {
      setTimeout(render, 250);
    });
  }

  // tenter de récupérer role/auth depuis un endpoint serveur si cookie est HttpOnly
  async function tryFetchMe() {
    // throttle fetches
    const now = Date.now();
    if (now - lastFetchAt < 1500) return;
    lastFetchAt = now;
    const endpoints = [
      "/api/me",
      "/auth/me",
      "/user/me",
      "/api/auth/me",
      "/me",
    ];
    for (const ep of endpoints) {
      try {
        console.debug("[DEBUG PROFILER] trying", ep);
        const r = await fetch(ep, {
          credentials: "include",
          cache: "no-store",
        });
        if (!r.ok) {
          console.debug("[DEBUG PROFILER] endpoint", ep, "returned", r.status);
          continue;
        }
        const json = await r.json();
        console.debug("[DEBUG PROFILER] endpoint", ep, "returned json", json);
        const role =
          json.role || json.userRole || (json.data && json.data.role) || null;
        const isAuth =
          json.authenticated === true ||
          json.auth === true ||
          json.isAuthenticated === true ||
          !!role;
        fetchCache = { role: role || "—", isAuth };
        try {
          render();
        } catch (e) {}
        return;
      } catch (err) {
        console.debug(
          "[DEBUG PROFILER] fetch error for",
          ep,
          err && err.message,
        );
        // essayer le suivant
      }
    }
  }

  // effectuer un premier fetch si cookie non lisible
  if (!findTokenInCookies()) tryFetchMe();

  // rendu initial
  applyHiddenStateFromStorage();
  render();
})();
