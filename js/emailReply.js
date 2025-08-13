(function () {
    const form = document.getElementById('contact-form');
    if(!form) return;

    const status = document.getElementById('form-status');

    function showStatus(msg, ok = true){
        status.style.display = 'block';
        status.textContent = msg;
        status.style.color = ok ? '#ffffffff' : '#eb0606ff';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!form.reportValidity()) return;

        const btn = form.querySelector('button[type=submit]');
        btn.disabled = true; btn.textContent = 'Sending...';

        try {
            const fd = new FormData(form);
            const res = await fetch(form.action, {
                method: POST, 
                headers: {'Accept': 'application/json'},
                body: fd
            });

            if (res.ok) {
                showStatus('Thanks for your message! We’ll get back to you shortly.');
                form.reset();
            } else {
                showStatus('Oops, something went wrong. Please try again.', false);
            }
        } catch {
      showStatus('Network error. Please try again.', false);
    } finally {
      btn.disabled = false; btn.textContent = 'Send →';
    }

    });
})();