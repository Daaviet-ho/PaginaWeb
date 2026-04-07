import { supabase } from './supabase.js';

const form = document.querySelector('.contacto-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        const nombre = form.querySelector('#nombre').value;
        const email = form.querySelector('#email').value;
        const tipo = form.querySelector('#tipo').value;
        const mensaje = form.querySelector('#mensaje').value;

        const { error } = await supabase.from('contact_messages').insert({
            nombre,
            email,
            tipo,
            mensaje
        });

        if (error) {
            alert('Error al enviar mensaje: ' + error.message);
            btn.textContent = originalText;
            btn.disabled = false;
            return;
        }

        alert('¡Mensaje enviado! Te responderé lo antes posible.');
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
    });
}
