
const form = document.getElementById("contact-formsubmit");
const modal = document.getElementById("sent-modal");
const closeBtn = modal.querySelector(".sent-modal__close");
const backdrop = modal.querySelector(".sent-modal__backdrop");
const statusEl = document.getElementById("form-status");

function openModal() {
    modal.setAttribute('aria-hidden', 'flase');
}
function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
}

document.addEventListener("DOMContentLoaded", () => {
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {if (e.key === 'Escape') closeModal();});

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"');
        btn.disabled = true; btn.style.opacity = .7;

        const fd = new FormData(form);
        try{
            const res = await fetch(form.action, {
                method: 'POST',
                headers: {'Accept': 'application/json'},
                body: fd
            });

            if(!res.ok) throw new Error('Network Error');

            //Success
            form.reset();
            openModal();

            statusEl.hidden = false;
            statusEl.textContent = 'Thanks! Your message has been sent.';
            statusEl.style.color = '#4caf50';
        } catch(err) {
            statusEl.hidden = false;
            statusEl.textContent = 'Oops, something went wrong. Please try again.';
            statusEl.style.color = '#f44336';
        } finally {
            btn.disabled = false; btn.style.opacity = 1;
        }
    });
});
