(function eyeTracker() {
  const stage = document.querySelector('.creatures-row');
  if (!stage) return;
  const isMobile = window.matchMedia('(max-width:575px)').matches;
  const jitter = isMobile ? 2 : 1.5; // max

  const eyes = Array.from(document.querySelectorAll('.eye'));
  if (!eyes.length) return;

  // Utility to get scale factor if the creature is transformed (optional)
  function getElementScale(el) {
    const tr = getComputedStyle(el).transform;
    if (!tr || tr === 'none') return 1;
    const m = tr.match(/matrix\(([^)]+)\)/);
    if (!m) return 1;
    const a = parseFloat(m[1].split(',')[0]);
    return isNaN(a) ? 1 : Math.abs(a); // scaleX is enough for our radius fix
  }

  function movePupils(clientX, clientY) {
    eyes.forEach(eye => {
      const rect = eye.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;

      // Max travel in px; compensate if parent is scaled
      const baseR = parseFloat(eye.dataset.r) || 6;
      const scale = getElementScale(eye.parentElement) || 1;
      const r = baseR / scale;

      const tx = (dx / dist) * r;
      const ty = (dy / dist) * r;

      const pupil = eye.firstElementChild;
      if (pupil) pupil.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
    });
  }

  window.addEventListener('pointermove', (e) => movePupils(e.clientX, e.clientY), { passive: true });

  // On resize/scroll, reset pupils (they will re-track on next pointer move)
  const reset = () => eyes.forEach(eye => {
    const p = eye.firstElementChild;
    if (p) p.style.transform = 'translate(-50%, -50%)';
  });
  window.addEventListener('resize', reset);
  window.addEventListener('scroll',  reset, { passive: true });

  // Optional: center pupils until user moves mouse
  reset();
})();

