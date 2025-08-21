(function(){
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.style.opacity = .7;

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
      // open your success modal here
      const modal = document.getElementById('sent-modal');
      if (modal){ modal.setAttribute('aria-hidden','false'); modal.style.display='block'; }
    }catch(err){
      console.error(err);
      alert('Sorry, we could not send your message. Please try again.');
    }finally{
      btn.disabled = false; btn.style.opacity = 1;
    }
  });
})();