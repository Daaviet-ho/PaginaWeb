import { supabase } from './supabase.js';

const form = document.querySelector('.auth-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Creando cuenta...';
    btn.disabled = true;

    const nombre = form.querySelector('#nombre').value;
    const apellido = form.querySelector('#apellido').value;
    const email = form.querySelector('#email').value;
    const telefono = form.querySelector('#telefono').value;
    const sector = form.querySelector('#sector').value;
    const password = form.querySelector('#password').value;
    const password2 = form.querySelector('#password2').value;

    if (password !== password2) {
        alert('Las contraseñas no coinciden');
        btn.textContent = originalText;
        btn.disabled = false;
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nombre,
                apellido,
                telefono,
                sector
            }
        }
    });

    if (error) {
        alert('Error al crear cuenta: ' + error.message);
        btn.textContent = originalText;
        btn.disabled = false;
        return;
    }

    // Insertar perfil en la tabla profiles
    if (data.user) {
        await supabase.from('profiles').insert({
            id: data.user.id,
            nombre,
            apellido,
            telefono,
            sector
        });
    }

    alert('¡Cuenta creada! Revisa tu email para confirmar.');
    window.location.href = 'login.html';
});
