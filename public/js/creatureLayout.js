(function () {
  "use strict";

    const SECTION_CANDIDATES = ["#main-section", ".about-us", ".main-section"];
    const CREATURE_SELECTOR = ".creature";
    const SIZE_CFG = { sm: { min: 0.70, max: 0.95 }, md: { min: 0.90, max: 1.15 }, lg: { min: 1.10, max: 1.35 } };

    // Layout knobs
    const PADDING = 12;     
    const MARGIN  = 10;     
    const MAX_TRIES = 120;  
    const USE_RANDOM_LAYOUT = true;

    // Breakpoints for deterministic randomness 
    const BP = [
    { name: "xs", max: 480,   seed: 111 },
    { name: "sm", max: 768,   seed: 222 },
    { name: "md", max: 1024,  seed: 333 },
    { name: "lg", max: 1440,  seed: 444 },
    { name: "xl", max: 99999, seed: 555 },
    ];

    // ---- INTERNAL STATE ------------------------------------------------------
    let section = null;
    let creatures = [];      
    let ro = null;           
    let lastBpName = "";

    // ---- UTILITIES -----------------------------------------------------------
    const rng = (seed0) => {
    let seed = seed0 | 0;
    return function () {
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    };

    function getBreakpoint() {
        const w = window.innerWidth || 0;
        for (const b of BP) if (w <= b.max) return b;
        return BP[BP.length - 1];
    }

    function scanSection() {
        for (const sel of SECTION_CANDIDATES) {
            const el = document.querySelector(sel);
            if (el) return el;
        }
    // Last resort: try the first section that actually contains creatures
        const all = Array.from(document.querySelectorAll("section"));
        for (const sec of all) {
            if (sec.querySelector(CREATURE_SELECTOR)) return sec;
        }
        return null;
    }

    function scanCreatures(container) {
        return Array.from(container.querySelectorAll(CREATURE_SELECTOR))
            .filter((node) => node instanceof HTMLElement);
    }

    function naturalSize(el) {
    // Always return numbers
        const img = el.querySelector("img,svg");
        if (!img) return { w: 100, h: 100, ar: 1 };

        if (img.tagName.toLowerCase() === "img") {
            const w = Number(img.naturalWidth || img.width || img.clientWidth || 100);
            const h = Number(img.naturalHeight || img.height || img.clientHeight || 100);
            return { w: Math.max(1, w), h: Math.max(1, h), ar: w / Math.max(1, h) };
        }

        if (img.tagName.toLowerCase() === "svg") {
            const vb = img.viewBox && img.viewBox.baseVal;
            if (vb && vb.width && vb.height) {
            const w = Number(vb.width), h = Number(vb.height);
            return { w: Math.max(1, w), h: Math.max(1, h), ar: w / Math.max(1, h) };
            }
            const r = img.getBoundingClientRect?.() || { width: 100, height: 100 };
            const w = Number(r.width || 100), h = Number(r.height || 100);
            return { w: Math.max(1, w), h: Math.max(1, h), ar: w / Math.max(1, h) };
        }

        return { w: 100, h: 100, ar: 1 };
    }

    function getSizeCfgFromEl(el) {
        const token = el?.dataset?.size || "md";
        return SIZE_CFG[token] || SIZE_CFG.md;
    }

    function baseScaleForViewport(ns, W, H, cfg, randFn) {
        const minDim = Math.max(1, Math.min(W, H));
        const root = getComputedStyle(document.documentElement);
        const unit = parseFloat(root.getPropertyValue("--creature-base")) || 140;

        const base = minDim / (unit * 4.5); // global density
        const sMin = (cfg?.min ?? 1) * base;
        const sMax = (cfg?.max ?? 1) * base;

        const r = typeof randFn === "function" ? randFn() : 0.5;
        const s = USE_RANDOM_LAYOUT ? (sMin + (sMax - sMin) * r) : (sMin + sMax) / 2;

        return Math.max(0.45, Math.min(s || 1, 2.0));
    }

    const area = (v) => {
        const nw = Number(v?.ns?.w || 100);
        const nh = Number(v?.ns?.h || 100);
        const s  = Number(v?.s || 1);
        return nw * nh * s * s;
    };

    function insideBounds(r, W, H) {
        return r.x >= PADDING &&
                r.y >= PADDING &&
                r.x + r.w <= W - PADDING &&
                r.y + r.h <= H - PADDING;
    }

    function overlap(a, b) {
        return !(
            a.x + a.w + MARGIN <= b.x ||
            b.x + b.w + MARGIN <= a.x ||
            a.y + a.h + MARGIN <= b.y ||
            b.y + b.h + MARGIN <= a.y
        );
    }

    // ---- LAYOUT (SAFE) -------------------------------------------------------
    function layout() {
        if (!section) return;

        // Always re-scan creatures to avoid stale refs.
        creatures = scanCreatures(section);
        if (!creatures.length) {
            console.error("[creatureLayout] No .creature elements found inside the main section.");
            return;
        }

        const S = section.getBoundingClientRect();
        const W = Math.max(1, S.width);
        const H = Math.max(1, S.height);

        const bp  = getBreakpoint();
        const rnd = rng(bp.seed);

        if (bp.name !== lastBpName) lastBpName = bp.name;

        const placed = [];

        // Prepare data safely
        const enriched = creatures.map((el) => ({ el, ns: naturalSize(el) }));

        // Preview scale for sort
        const preview = enriched.map((o) => {
            const cfg = getSizeCfgFromEl(o.el);
            const s   = baseScaleForViewport(o.ns, W, H, cfg, () => 0.5);
            return { ...o, s: Number.isFinite(s) ? s : 1 };
        });

        preview.sort((a, b) => area(b) - area(a));

        // Place each creature (el is always HTMLElement due to scanCreatures)
        for (const item of preview) {
            const el  = item.el;               // HTMLElement (guaranteed)
            const ns  = item.ns || { w:100, h:100 };
            const cfg = getSizeCfgFromEl(el);

            const s = baseScaleForViewport(ns, W, H, cfg, rnd);
            let w = ns.w * s;
            let h = ns.h * s;

            let best = null;
            let tries = 0;

            while (tries++ < MAX_TRIES) {
                const biasX = USE_RANDOM_LAYOUT ? (0.2 + 0.6 * rnd()) : 0.5;
                const biasY = USE_RANDOM_LAYOUT ? (0.2 + 0.6 * rnd()) : 0.6;

                const x = PADDING + (W - 2*PADDING - w) * (USE_RANDOM_LAYOUT ? biasX : 0.5);
                const y = PADDING + (H - 2*PADDING - h) * (USE_RANDOM_LAYOUT ? biasY : 0.5);

                const r = { x, y, w, h };
                if (!insideBounds(r, W, H)) continue;

                let collides = false;
                for (const p of placed) { if (overlap(r, p)) { collides = true; break; } }

                if (!collides) { best = r; break; }
            }

            if (!best) {
            // Shrink a bit and center
                const s2 = Math.max(0.85 * s, 0.45);
                w = ns.w * s2; h = ns.h * s2;
                best = {
                    x: Math.max(PADDING, Math.min(W - PADDING - w, (W - w) / 2)),
                    y: Math.max(PADDING, Math.min(H - PADDING - h, (H - h) / 2)),
                    w, h
                };
                el.style.setProperty("--s", s2.toFixed(4));
            } else {
                el.style.setProperty("--s", s.toFixed(4));
            }

            // Commit placement (el is guaranteed HTMLElement with .style)
            el.style.setProperty("--x", `${best.x}px`);
            el.style.setProperty("--y", `${best.y}px`);
            placed.push(best);
        }
    }

    // ---- INIT ---------------------------------------------------------------
    function init() {
        section = scanSection();
        if (!section) {
            console.error("[creatureLayout] Could not locate the main section. Add id='main-section' or class='about-us' to the container that holds the creatures.");
            return;
        }

        creatures = scanCreatures(section);
        if (!creatures.length) {
            console.error("[creatureLayout] No .creature elements found. Add class='creature' to each sea-creature wrapper.");
            return;
        }

        // Observe the section size for responsive relayout
        if (ro) ro.disconnect();
        ro = new ResizeObserver(() => requestAnimationFrame(layout));
        ro.observe(section);

        // Debounced viewport resize/orientation
        let t;
        window.addEventListener("resize", () => {
            clearTimeout(t);
            t = setTimeout(() => requestAnimationFrame(layout), 80);
        });

        // Layout once images are ready (with a fallback)
        const imgs = creatures.map(c => c.querySelector("img")).filter(Boolean);
        let pending = imgs.length;
        if (pending === 0) {
            layout();
        } else {
            imgs.forEach(img => {
            if (img.complete) { if (--pending === 0) layout(); }
            else img.addEventListener("load", () => { if (--pending === 0) layout(); }, { once: true });
            });
            setTimeout(() => requestAnimationFrame(layout), 400);
        }
    }

    document.addEventListener("DOMContentLoaded", init);
})();
