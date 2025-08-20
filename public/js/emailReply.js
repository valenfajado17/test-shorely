
const form = document.getElementById("contact-formsubmit");
const modal = document.getElementById("sent-modal");
const backdrop = modal?.querySelector(".backdrop");
const closeBtn = modal?.querySelector(".close");
const statusEl = document.getElementById("form-status");

function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
}

function closeModal(){
    if (!modal) return;
    modal.classList.remove('open');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
}


document.addEventListener("DOMContentLoaded", () => {
    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
    window.addEventListener('keydown', e => {if (e.key === 'Escape') closeModal(); }); 

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        
        const btn = form.querySelector('button[type="submit"');
        btn.disabled = true; btn.style.opacity = .7;

        const fd = new FormData(form);
        try{
            if (!fd.get('_autoresponse')){
                fd.append('_autoresponse',
`Thanks for reaching out to Shorely  👋

 We’ve received your message. Your inquiry is currently being directed to the appropriate team member. 
 If we find your request interesting, you can expect a response within 48 to 72 hours.                     
 
We appreciate your patience and look forward to assisting you.

— Shorely 🌊`);
               }
        

            const res = await fetch(form.action, {
                method: 'POST',
                headers: {'Accept': 'application/json'},
                body: fd
            });

            if(!res.ok) throw new Error('Network Error');
            let data = null;
            try { data = await res.json();} catch(_) {}

            console.log('FormSubmit response', res.status, data);
            
            if (!res.ok || (data && data.success === 'false')) {
                // messages: "Please verify your email" or validation hints
                const msg = (data && (data.message || data.error)) || 'FormSubmit error';
                throw new Error(msg);
            }

            form.reset();
            openModal();
            statusEl.hidden = false;
            statusEl.textContent = 'Thanks! Your message has been sent.';
            statusEl.style.color = '#4caf50';
        } catch(err) {
            console.error('Submit failed:', err);
            // Friendly message; feel free to style a toast instead of alert
            alert(
                ('' + err.message).includes('verify')
                ? 'FormSubmit needs you to verify the recipient email first. Please check your inbox for a verification email from FormSubmit and click the link, then try again.'
                : 'Oops, something went wrong. Please try again.'
            );
        } finally {
            btn.disabled = false; btn.style.opacity = 1;
        }
    });
});
