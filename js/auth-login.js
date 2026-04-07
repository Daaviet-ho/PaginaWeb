import { supabase } from './supabase.js';

const form = document.querySelector('.auth-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Entrando...';
    btn.disabled = true;

    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert('Error al iniciar sesión: ' + error.message);
        btn.textContent = originalText;
        btn.disabled = false;
        return;
    }

    window.location.href = 'index.html';
});
