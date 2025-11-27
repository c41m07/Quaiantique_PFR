// DEBUG profiler JS amélioré
// Lit le rôle et le statut depuis :
// 1) un token stocké en cookie (essaye plusieurs noms communs), en décodant le payload JWT si possible
// 2) fallback : localStorage.userRole et localStorage.isAuthenticated

(function () {
    const roleEl = document.getElementById("debug-role");
    const statusEl = document.getElementById("debug-status");
    const profiler = document.getElementById("debug-profiler");
    const clientBtn = document.getElementById("debug-set-client");
    const adminBtn = document.getElementById("debug-set-admin");
    const debugActions = profiler.querySelector(".debug-actions");

    if (!roleEl || !statusEl || !profiler) return;

    const COOKIE_CANDIDATES = [
        "auth_token",
        "authToken",
        "token",
        "accessToken",
        "jwt",
        "session",
    ];

    const ROLE_COOKIE_NAMES = ["role", "user_role", "userRole"];
    const TOKEN_COOKIE = "auth_token";
    const ROLE_COOKIE = "role";
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
            if (v) return {name: n, value: v};
        }
        return null;
    }

    function findRoleInCookies() {
        for (const n of ROLE_COOKIE_NAMES) {
            const v = getCookie(n);
            if (v) return {name: n, value: v};
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

    function encodeSegment(obj) {
        return btoa(JSON.stringify(obj))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }

    function buildFakeJwt(role) {
        const header = {alg: "HS256", typ: "JWT", dbg: true};
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            role,
            userRole: role,
            scope: [role],
            iat: now,
            exp: now + 3600,
            iss: "debug-profiler",
        };
        return (
            encodeSegment(header) +
            "." +
            encodeSegment(payload) +
            ".debug-signature"
        );
    }

    function setDebugAuth(role) {
        const token = buildFakeJwt(role);
        const cookieAttrs = "; path=/; max-age=3600";
        document.cookie = TOKEN_COOKIE + "=" + token + cookieAttrs;
        document.cookie = ROLE_COOKIE + "=" + role + cookieAttrs;
        try {
            localStorage.setItem("userRole", role);
            localStorage.setItem("isAuthenticated", "true");
        } catch (e) {
        }
        console.debug("[DEBUG PROFILER] role forcé", role);
        render();
        window.location.reload();
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
        return {role, isAuth};
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
        if (debugActions) debugActions.hidden = state.isAuth;

        const normalizedRole =
            state.role && state.role.toUpperCase ? state.role.toUpperCase() : "";
        if (normalizedRole === "ROLE_ADMIN") {
            roleEl.style.fontWeight = "700";
        } else {
            roleEl.style.fontWeight = "400";
        }
    }

    // surcharge setItem pour détecter changements localStorage dans le même onglet
    (function () {
        try {
            const origSet = Storage.prototype.setItem;
            Storage.prototype.setItem = function (key, value) {
                origSet.apply(this, arguments);
                try {
                    window.dispatchEvent(
                        new CustomEvent("local-storage-changed", {
                            detail: {key, value},
                        }),
                    );
                } catch (e) {
                }
            };
        } catch (e) {
        }
    })();

    window.addEventListener("local-storage-changed", function (e) {
        if (!e || !e.detail) return;
        const key = e.detail.key;
        if (key === "userRole" || key === "isAuthenticated") {
            render();
        }
    });

    // écoute cross-tab
    window.addEventListener("storage", function (e) {
        if (!e) return;
        if (e.key === "userRole" || e.key === "isAuthenticated") {
            render();
        }
    });

    // fallback: poll léger (2s) pour détecter changements de cookie/LS
    let last = readState();
    let cookieSnapshot = typeof document !== "undefined" ? document.cookie : "";
    setInterval(function () {
        try {
            const currentCookie =
                typeof document !== "undefined" ? document.cookie : "";
            if (currentCookie !== cookieSnapshot) {
                cookieSnapshot = currentCookie;
                tryFetchMe();
                const cur = readState();
                last = cur;
                render();
                return;
            }

            const cur = readState();
            if (cur.role !== last.role || cur.isAuth !== last.isAuth) {
                last = cur;
                render();
            }
        } catch (e) {
        }
    }, 2000);

    const signout = document.getElementById("signoutbtn");
    if (signout) {
        signout.addEventListener("click", function () {
            setTimeout(render, 250);
        });
    }

    if (clientBtn) {
        clientBtn.addEventListener("click", function () {
            setDebugAuth("ROLE_USER");
        });
    }

    if (adminBtn) {
        adminBtn.addEventListener("click", function () {
            setDebugAuth("ROLE_ADMIN");
        });
    }

    if (!findTokenInCookies()) tryFetchMe();

    render();
})();