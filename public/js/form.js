(function(){

  const form = document.getElementById("contact-form");
  if(!form) return;

  const status = document.getElementById('form-status');
  const nameInput = form.querySelector(".name");
  const emailInput = form.querySelector(".email");
  const messageInput = form.querySelector(".message");

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearForm() {
    document.querySelectorAll('.error').forEach(e => (e.textContent = ""));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearForm();

    // name 
    let valid = true;
    if(nameInput.value.trim() === "") {
      document.getElementById('error-name').textContent = "Name is required";
      valid = false;
    } 
    
    // email
    if (emailInput.value.trim() === ""){
      document.getElementById('error-email').textContent = "Email is required";
      valid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      document.getElementById('error-email').textContent = "Invalid email format";
      valid = false;
    }

    // message
    if(messageInput.value.trim() === ""){
      document.getElementById('error-message').textContent = "Message is required";
      valid = false;
    }

    if(!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = "Sending...";

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
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

      if(res.ok) {
        status.style.display = "block";
        status.textContent = "Thanks for your message!";
        status.style.color = "#2e7d32";
        form.reset();
      } else {
        status.style.display = "block";
        status.textContent = "Error sending form. Try again.";
        status.style.color = "#b00020";
      }
    } catch (err) {
      style.style.display = "block";
      status.textContent = "Network error. Try again later.";
      status.style.color = "#b00020";
      console.error(err);
      alert('Sorry, we could not send your message. Please try again.');


    } finally {
      btn.disabled = false; btn.textContent = "Send →";
    }
});
})();