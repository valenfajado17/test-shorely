function eyesFollowCursor(){
    const pupils = [...document.querySelectorAll('.eye')];
    if(!pupils.length) return;

    let mx = 0, my = 0, raf = 0;

    const tick = () => {
        for (const p of pupils) {
            const socket = p.parentElement; if(!socket) continue;
            const r = socket.getBoundingClientRect();
            const cx = r.left + r.width/2;
            const cy = r.top + r.height/2;

            const a = Math.atan2(my - cy, mx - cx);
            const radius = Math.min(r.width, r.height) / 2;
            const pr = Math.max(p.offsetWidth, p.offsetHeight) / 2;
            const travel = Math.max(2, radius * 0.35) - pr;

            p.style.setProperty('--dx', `${Math.cos(a) * travel}px`);
            p.style.setProperty('--dy', `${Math.sin(a) * travel}px`);
        }
    };

    addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        if(!raf) raf = requestAnimationFrame(tick);
    }, { passive: true});
}

document.addEventListener('DOMContentLoaded', eyesFollowCursor);