document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("debug-profiler");
    if (!container) return;

    const loadPanel = async () => {
        try {
            const response = await fetch("./DEBUG/debug.html", {cache: "no-store"});
            if (!response.ok) throw new Error("debug.html introuvable");
            container.innerHTML = await response.text();
            injectScript();
        } catch (error) {
            console.warn("[DEBUG PROFILER]", error);
        }
    };

    const injectScript = () => {
        if (window.__debugProfilerScript) return;
        const script = document.createElement("script");
        script.src = "./DEBUG/debug.js";
        script.onload = () => {
            window.__debugProfilerScript = true;
        };
        document.body.appendChild(script);
    };

    loadPanel();
});
