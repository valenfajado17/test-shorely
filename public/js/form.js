(function(){

  const form = document.getElementById("contact-form");
  if(!form) return;

  const status = document.getElementById('form-status');
  const nameInput = form.querySelector(".name");
  const emailInput = form.querySelector(".email");
  const messageInput = form.querySelector(".message");

  const errName = document.getElementById('error-name');
  const errEmail = document.getElementById('error-email');
  const errMsg  = document.getElementById('error-message');

  nameInput.setAttribute('aria-describedby', 'error-name');
  emailInput.setAttribute('aria-describedby', 'error-email');
  messageInput.setAttribute('aria-describedby', 'error-message');

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  function setError(input, errEl, msg){
    errEl.textContent = msg;
    input.classList.remove('input-ok');
    input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input, errEl){
    errEl.textContent = "";
    input.classList.remove('input-error');
    input.removeAttribute('aria-invalid');
    // (optional) mark as ok if non-empty & valid
    if (input === emailInput) {
      if (emailRx.test(emailInput.value.trim())) input.classList.add('input-ok');
      else input.classList.remove('input-ok');
    } else {
      if (input.value.trim() !== "") input.classList.add('input-ok');
      else input.classList.remove('input-ok');
    }
  }

  function validateField(input){
    if (input === nameInput) {
      if (nameInput.value.trim() === "") { setError(nameInput, errName, "Name is required"); return false; }
      clearError(nameInput, errName); return true;
    }
    if (input === emailInput) {
      const v = emailInput.value.trim();
      if (v === "") { setError(emailInput, errEmail, "Email is required"); return false; }
      if (!emailRx.test(v)) { setError(emailInput, errEmail, "Invalid email format"); return false; }
      clearError(emailInput, errEmail); return true;
    }
    if (input === messageInput) {
      if (messageInput.value.trim() === "") { setError(messageInput, errMsg, "Message is required"); return false; }
      clearError(messageInput, errMsg); return true;
    }
    return true;
  }

  function validateAll(){
    const a = validateField(nameInput);
    const b = validateField(emailInput);
    const c = validateField(messageInput);
    return a && b && c;
  }

  [nameInput, emailInput, messageInput].forEach(inp => {
    inp.addEventListener('input', () => validateField(inp));
    inp.addEventListener('blur',  () => validateField(inp));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.style.display = "none";
    status.textContent= '';
    trackFormSubmit();

    if(!validateAll) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = "Sending...";

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      _honey: form.querySelector('[name="_honey"]')?.value || ''
    };

    try{
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(()=>({}));
        if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');


        form.reset();
        [nameInput, emailInput, messageInput].forEach(i => {
          i.classList.remove('input-error', 'input-ok');
          i.removeAttribute('aria-invalid');
        });

        status.style.display = "block";
        status.textContent = "Thanks for your message!";
        status.style.color = "#2e7d32";
        trackFormSuccess();

      } catch (err) {
        status.style.display = "block";
        status.textContent = "Network error. Try again later.";
        status.style.color = "#b00020";
        trackFormError(err.message || 'unknown_error');

        console.error(err);
      } finally {
        btn.disabled = false; btn.textContent = "Send →";
      }
  });

  [nameInput, emailInput, messageInput].forEach(inp => 
    {
      inp.addEventListener('focus', () =>
         trackFormStart(inp.name), { once: true });
    });

  function trackFormStart(field) {
    gtag('event', 'form_start', {
      form_id: 'contact-form',
      form_name: 'Contact',
      field: field
    });
  }

  function trackFormSubmit(){
     gtag('event', 'form_submit', {
      form_id: 'contact-form',
      form_name: 'Contact'
     });
  }

  function trackFormSuccess() {
    gtag('event', 'form_success', {
      form_id: 'contact-form',
      form_name: 'Contact'
    });
  }

  function trackFormError(errorCode = 'network_error') {
    gtag('event', 'form_error', {
      form_id: 'contact-form',
      form_name: 'Contact',
      error_code: String(errorCode)
    });
  }
})();