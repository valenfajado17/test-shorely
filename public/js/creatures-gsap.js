(() => {
    const section = document.querySelector('#main-section') || document.querySelector('.sea-creatures');
    if (!section) return;

    const layer = section.querySelector('.creatures-row') || section;
    const creatures = Array.from(section.querySelectorAll('.creature'));
    if (creatures.length === 0) return; 

    function mulberry32(seed) {
        return function() {
            seed = (seed + 0x6D2B79F5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        }
    }

    const seed = Math.floor(Math.random() * 1e9);
    const rand = mulberry32(seed);
    const r = (min, max) => min + (max - min) * rand();

    const SIZE = { sm:[0.65,0.90], md:[0.90,1.15], lg:[1.10,1.35] };
    const SLOTS = {
        xs: [ // ≤480
        { x: 18, y: 30, w: 12, h: 10 },
        { x: 82, y: 28, w: 12, h: 10 },
        { x: 22, y: 70, w: 12, h: 10 },
        { x: 78, y: 68, w: 12, h: 10 },
        ],
        sm: [ // 481–768
        { x: 16, y: 28, w: 12, h: 10 },
        { x: 84, y: 32, w: 12, h: 10 },
        { x: 22, y: 72, w: 12, h: 10 },
        { x: 80, y: 70, w: 12, h: 10 },
        ],
        md: [ // 769–1024
        { x: 14, y: 26, w: 12, h: 10 },
        { x: 86, y: 30, w: 12, h: 10 },
        { x: 22, y: 74, w: 12, h: 10 },
        { x: 82, y: 72, w: 12, h: 10 },
        ],
        lg: [ // 1025–1440
        { x: 13, y: 24, w: 12, h: 10 },
        { x: 87, y: 28, w: 12, h: 10 },
        { x: 22, y: 76, w: 12, h: 10 },
        { x: 84, y: 74, w: 12, h: 10 },
        ],
        xl: [ // 1441+
        { x: 12, y: 22, w: 12, h: 10 },
        { x: 88, y: 26, w: 12, h: 10 },
        { x: 22, y: 78, w: 12, h: 10 },
        { x: 86, y: 76, w: 12, h: 10 },
        ]
    };

    function sizeFactor(el) {
        const token = el.dataset.size || 'md';
        const [min, max] = SIZE[token] || SIZE.md;

        const root = getComputedStyle(document.documentElement);
        const base = parseFloat(root.getPropertyValue('--creature-base')) || 140;

        const rect = section.getBoundingClientRect();
        const minDim = Math.max(320, Math.min(rect.width, rect.height));
        const density = minDim / (base * 4.5);

        return gsap.utils.clamp(0.5, 2.0, (min + (max - min) * rand()) * density);
    }

    function jitter(center, box){
        const clampPct = (v) => gsap.utils.clamp(8, 92, v);
        const x = clampPct(center.x + r(-box.w/2, box.w/2));
        const y = clampPct(center.y + r(-box.h/2, box.h/2));
        return { x, y }
    } 

    function applyLayout(slotKey){
        const slots = SLOTS[slotKey] || SLOTS.md;
        
        creatures.forEach((el, i) => {
            const s = sizeFactor(el);
            const slot = slots[i % slots.length];
            const { x, y } = jitter({ x: slot.x, y: slot.y}, slot);

            gsap.set(el, { left: `${x}%`, top: `${y}%` });
            el.computedStyleMap.setProperty('--s', s.toFixed(3))
        });
    }

    const mm = gsap.matchMedia();
    mm.add(
        {
        isXS: "(max-width: 480px)",
        isSM: "(min-width: 481px) and (max-width: 768px)",
        isMD: "(min-width: 769px) and (max-width: 1024px)",
        isLG: "(min-width: 1025px) and (max-width: 1440px)",
        isXL: "(min-width: 1441px)"
        },
        (ctx) => {
            const { isXS, isSM, isMD, isLG, isXL } = ctx.conditions;
            const key = isXS ? 'xs' : isSM ? 'sm' : isMD ? 'md' : isLG ? 'lg' : 'xl';
            applyLayout(key);

            let t;
            window.addEventListener('resize', () => {
                clearTimeout(t);
                t = setTimeout(() => applyLayout(key), 120);
            });
        }
    )
})