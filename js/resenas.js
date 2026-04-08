import { supabase } from './supabase.js';

const grid = document.getElementById('resenasGrid');
const formWrapper = document.getElementById('resenaFormWrapper');
const loginPrompt = document.getElementById('resenaLoginPrompt');
const emptyMsg = document.getElementById('resenasEmpty');
const form = document.getElementById('resenaForm');
const starsContainer = document.getElementById('resenaStars');
const puntuacionInput = document.getElementById('resenaPuntuacion');
const textoInput = document.getElementById('resenaTexto');
const charCount = document.getElementById('resenaCharCount');

let currentUser = null;

// --- Init ---
async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    currentUser = session?.user ?? null;

    if (currentUser) {
        formWrapper.style.display = 'block';
        loginPrompt.style.display = 'none';
    } else {
        formWrapper.style.display = 'none';
        loginPrompt.style.display = 'block';
    }

    await loadResenas();
}

// --- Load reviews ---
async function loadResenas() {
    const { data, error } = await supabase
        .from('resenas')
        .select('id, user_id, nombre, texto, puntuacion, created_at')
        .order('created_at', { ascending: false });

    grid.innerHTML = '';

    if (error) {
        grid.innerHTML = '<p style="color:var(--color-text-muted);">Error al cargar reseñas.</p>';
        return;
    }

    if (!data || data.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';

    data.forEach(r => {
        grid.appendChild(createResenaCard(r));
    });
}

function createResenaCard(r) {
    const card = document.createElement('div');
    card.className = 'testimonio-card';
    card.dataset.id = r.id;

    const stars = '★'.repeat(r.puntuacion) + '☆'.repeat(5 - r.puntuacion);
    const fecha = new Date(r.created_at).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    const escapedTexto = escapeHTML(r.texto);
    const escapedNombre = escapeHTML(r.nombre);

    let deleteBtn = '';
    if (currentUser && currentUser.id === r.user_id) {
        deleteBtn = `<button class="resena-delete" data-id="${r.id}" title="Eliminar reseña"><i class="ri-delete-bin-line"></i></button>`;
    }

    card.innerHTML = `
        <div class="resena-card-header">
            <span class="resena-stars">${stars}</span>
            ${deleteBtn}
        </div>
        <p class="testimonio-texto">"${escapedTexto}"</p>
        <div class="resena-card-footer">
            <p class="testimonio-autor">— ${escapedNombre}</p>
            <span class="resena-fecha">${fecha}</span>
        </div>
    `;

    const del = card.querySelector('.resena-delete');
    if (del) {
        del.addEventListener('click', () => deleteResena(r.id, card));
    }

    return card;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// --- Star rating ---
let selectedRating = 0;

starsContainer.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        puntuacionInput.value = selectedRating;
        updateStars();
    });

    star.addEventListener('mouseenter', () => {
        highlightStars(parseInt(star.dataset.value));
    });

    star.addEventListener('mouseleave', () => {
        updateStars();
    });
});

function highlightStars(n) {
    starsContainer.querySelectorAll('.star').forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.value) <= n);
    });
}

function updateStars() {
    highlightStars(selectedRating);
}

// --- Char counter ---
textoInput.addEventListener('input', () => {
    charCount.textContent = textoInput.value.length;
});

// --- Submit ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (selectedRating === 0) {
        alert('Selecciona una puntuación (1-5 estrellas).');
        return;
    }

    const texto = textoInput.value.trim();
    if (texto.length < 10) {
        alert('La reseña debe tener al menos 10 caracteres.');
        return;
    }

    const btn = form.querySelector('.btn-resena');
    const originalText = btn.textContent;
    btn.textContent = 'Publicando...';
    btn.disabled = true;

    const nombre = currentUser.user_metadata?.nombre
        ? `${currentUser.user_metadata.nombre} ${currentUser.user_metadata.apellido || ''}`.trim()
        : currentUser.email.split('@')[0];

    const { error } = await supabase.from('resenas').insert({
        user_id: currentUser.id,
        nombre,
        texto,
        puntuacion: selectedRating
    });

    if (error) {
        alert('Error al publicar: ' + error.message);
        btn.textContent = originalText;
        btn.disabled = false;
        return;
    }

    form.reset();
    selectedRating = 0;
    updateStars();
    charCount.textContent = '0';
    btn.textContent = originalText;
    btn.disabled = false;

    await loadResenas();
});

// --- Delete ---
async function deleteResena(id, cardEl) {
    if (!confirm('¿Eliminar tu reseña?')) return;

    const { error } = await supabase.from('resenas').delete().eq('id', id);
    if (error) {
        alert('Error al eliminar: ' + error.message);
        return;
    }

    cardEl.remove();

    if (grid.children.length === 0) {
        emptyMsg.style.display = 'block';
    }
}

// --- Auth state listener ---
supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    if (currentUser) {
        formWrapper.style.display = 'block';
        loginPrompt.style.display = 'none';
    } else {
        formWrapper.style.display = 'none';
        loginPrompt.style.display = 'block';
    }
});

init();
