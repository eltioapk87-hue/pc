document.addEventListener('DOMContentLoaded', () => {
    const addGameForm = document.getElementById('add-game-form');
    const gameList = document.getElementById('game-list');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Contraseña de administrador (cambia esto por una más segura si lo deseas)
    const ADMIN_PASSWORD = '1234';

    // Cargar juegos desde localStorage
    const getGames = () => {
        const games = localStorage.getItem('pspGames');
        return games ? JSON.parse(games) : [];
    };

    // Guardar juegos en localStorage
    const saveGames = (games) => {
        localStorage.setItem('pspGames', JSON.stringify(games));
    };

    let games = getGames();

    // Renderizar los juegos en la página
    const renderGames = () => {
        gameList.innerHTML = '';
        if (games.length === 0) {
            gameList.innerHTML = `<div class="col-12 text-center text-muted"><p>No hay juegos en el catálogo. ¡Sé el primero en agregar uno!</p></div>`;
            return;
        }

        games.forEach(game => {
            const gameCardCol = document.createElement('div');
            gameCardCol.className = 'col';

            gameCardCol.innerHTML = `
                <div class="card game-card shadow-sm">
                    <img src="${game.imageUrl}" class="card-img-top" alt="${game.name}" onerror="this.onerror=null;this.src='placeholder.png';">
                    <button class="btn btn-danger btn-sm btn-delete" data-id="${game.id}">X</button>
                    <div class="card-body">
                        <h5 class="card-title">${game.name}</h5>
                        <p class="card-text">${game.description}</p>
                        <a href="${game.downloadUrl}" class="btn btn-success btn-download" target="_blank" rel="noopener noreferrer">Descargar</a>
                    </div>
                </div>
            `;
            gameList.appendChild(gameCardCol);
        });
    };

    // Manejar el envío del formulario para agregar un nuevo juego
    addGameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newGame = {
            id: Date.now(),
            name: document.getElementById('game-name').value.trim(),
            imageUrl: document.getElementById('game-image').value.trim(),
            description: document.getElementById('game-description').value.trim(),
            downloadUrl: document.getElementById('game-download').value.trim()
        };

        games.unshift(newGame); // Agrega el nuevo juego al principio del array
        saveGames(games);
        renderGames();
        addGameForm.reset();
        
        // Cierra el acordeón si está abierto
        const collapseElement = document.getElementById('add-game-collapse');
        const bsCollapse = new bootstrap.Collapse(collapseElement, {
            toggle: false
        });
        bsCollapse.hide();
    });

    // Manejar el clic en los botones (delegación de eventos)
    gameList.addEventListener('click', (e) => {
        // Lógica para borrar un juego
        if (e.target.classList.contains('btn-delete')) {
            const userPassword = prompt('Para borrar este juego, ingresa la contraseña de administrador:');
            
            if (userPassword === ADMIN_PASSWORD) {
                const gameId = e.target.getAttribute('data-id');
                games = games.filter(game => game.id != gameId);
                saveGames(games);
                renderGames();
                alert('Juego borrado exitosamente.');
            } else if (userPassword !== null) { // No mostrar alerta si el usuario presiona "Cancelar"
                alert('Contraseña incorrecta.');
            }
        }
    });

    // --- Lógica para el modo oscuro/claro ---
    const getPreferredTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            themeIcon.classList.remove('bi-moon-stars-fill');
            themeIcon.classList.add('bi-sun-fill');
        } else {
            document.documentElement.removeAttribute('data-bs-theme');
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-stars-fill');
        }
        localStorage.setItem('theme', theme);
    };

    // Aplicar tema al cargar la página
    const currentTheme = getPreferredTheme();
    setTheme(currentTheme);

    // Event listener para el botón de cambio de tema
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    // --- Fin de la lógica para el modo oscuro/claro ---

    // Renderizar los juegos al cargar la página por primera vez
    renderGames();
});