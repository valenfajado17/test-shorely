const form = document.getElementById('contact-form');
if (!form) return;

const modal = document.getElementById('sent-modal');
const backdrop = modal?.querySelector('.backdrop');
const closeBtn = modal?.querySelector('.close');

const openModal = () => {
    modal?.setAttribute('aria-hidden', 'false');
    modal.style.display = 'block';
}
const closeModal = () => {
    modal?.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
}

closeBtn?.addEventListener('click', {closeModal});
backdrop?.addEventListener('click', closeBtn);

window.addEventListener('keydown', e => { 
    if (e.key === 'Escape') closeModal();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.style.opacity = .7;


    const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message:  form.message.value.trim(),
        _honey: form.querySelector('[name="_honey"]')?.value || ''
    };

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');

        form.reset();
        openModal();
    } catch (err) {
        console.error(err);
        alert('Sorry, we could not sent your message. Please try again.')
    } finally {
        btn.disabled = false; btn.style.opacity = 1;
    }
});
