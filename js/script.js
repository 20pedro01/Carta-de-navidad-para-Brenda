window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progress-bar');
    const percentageText = document.getElementById('progress-percentage');

    // Rutas originales
    const imageUrls = [
        'img/2.png',
        'img/3.png',
        'img/4.jpg',
    ];

    let imagesLoaded = 0;
    const totalImages = imageUrls.length;

    if (totalImages === 0) { startApp(); return; }

    const imageLoaded = () => {
        imagesLoaded++;
        let percent = Math.round((imagesLoaded / totalImages) * 100);
        progressBar.style.width = percent + '%';
        percentageText.textContent = percent + '%';
        if (imagesLoaded === totalImages) setTimeout(startApp, 500);
    };

    imageUrls.forEach(url => {
        const img = new Image();
        img.onload = imageLoaded;
        img.onerror = imageLoaded;
        img.src = url;
    });

    function startApp() {
        loader.classList.add('hidden');
        loader.addEventListener('transitionend', () => {
            initializeLetter();
            createFallingEmojis();
        }, { once: true });
    }
});

function createFallingEmojis() {
    const container = document.getElementById('falling-emojis-container');
    if (!container) return;

    const emojis = ['❄️', '❄️', '❄️', '🎄', '🦌', '🎁', '⛄', '🔔', '✨'];
    const numberOfEmojis = 40;
    for (let i = 0; i < numberOfEmojis; i++) {
        createEmoji();
    }

    function createEmoji() {
        const emoji = document.createElement('div');
        emoji.className = 'falling-emoji';
        emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];

        const size = Math.random() * 20 + 10;
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * 10;
        const horizontalPosition = Math.random() * 100;

        emoji.style.fontSize = `${size}px`;
        emoji.style.left = `${horizontalPosition}vw`;
        emoji.style.animationDuration = `${duration}s`;
        emoji.style.animationDelay = `${delay}s`;

        container.appendChild(emoji);

        emoji.addEventListener('animationend', () => {
            emoji.remove();
            createEmoji();
        });
    }
}

function initializeLetter() {
    const envoltura = document.querySelector(".envoltura-sobre");
    const carta = document.querySelector(".carta");
    const sonido = document.getElementById("sound");

    let isAnimating = false;
    let cartaAbierta = false;
    const esMovil = window.innerWidth <= 768;

    function gestionarAnimacion(accion) {
        if (isAnimating) return;
        isAnimating = true;

        if (accion === 'abrir') {
            envoltura.classList.add('abierto');
            sonido.play().catch(e => console.log("La reproducción automática fue bloqueada."));

            crearEfectosAscendentes();

            if (esMovil) {
                setTimeout(() => {
                    carta.style.top = '15px';
                    carta.style.transform = 'translateX(-50%)';
                    carta.style.width = '95vw';
                    carta.style.height = 'calc(100vh - 30px)';
                }, 1700);
            }

            carta.addEventListener('animationend', () => {
                isAnimating = false;
                cartaAbierta = true;
            }, { once: true });
            setTimeout(crearEfectosMagicos, 800);

        } else if (accion === 'cerrar') {
            carta.style.top = '';
            carta.style.transform = '';
            carta.style.width = '';
            carta.style.height = '';
            void carta.offsetWidth;

            envoltura.classList.add('cerrando');
            if (sonido) {
                sonido.pause();
            }

            limpiarEfectosAscendentes();

            carta.addEventListener('animationend', () => {
                envoltura.classList.remove('abierto', 'cerrando');
                isAnimating = false;
                cartaAbierta = false;
            }, { once: true });
        }
    }

    document.addEventListener('click', (e) => {
        if (isAnimating) return;

        if (!cartaAbierta) {
            const clickEnSobre = e.target.closest('.envoltura-sobre');
            if (clickEnSobre && !clickEnSobre.classList.contains('abierto')) {
                gestionarAnimacion('abrir');
            }
        } else {
            gestionarAnimacion('cerrar');
        }
    });

    function crearEfectosMagicos() {
        if (!envoltura.classList.contains('abierto') || envoltura.classList.contains('cerrando')) return;
        const contenedor = document.body;
        const cantidad = 30;
        const emojis = ['✨', '⭐', '🎄', '🎁', '❄️', '❤️'];
        const sobreRect = envoltura.getBoundingClientRect();
        const startX = sobreRect.left + sobreRect.width / 2;
        const startY = sobreRect.top + sobreRect.height / 2;

        for (let i = 0; i < cantidad; i++) {
            setTimeout(() => {
                if (!cartaAbierta) return;
                const efecto = document.createElement('div');
                efecto.className = 'efecto-magico';
                efecto.innerHTML = emojis[i % emojis.length];
                efecto.style.left = `${startX}px`;
                efecto.style.top = `${startY}px`;
                const duracion = Math.random() * 2 + 3;
                const fontSize = Math.random() * 15 + 15;
                const xEnd = (Math.random() - 0.5) * window.innerWidth * 1.2;
                const yEnd = (Math.random() - 0.5) * window.innerHeight * 1.2;
                const scaleEnd = Math.random() * 0.5 + 0.25;
                const rotationEnd = (Math.random() - 0.5) * 720;
                const xMid = (Math.random() - 0.5) * 200;
                const yMid = (Math.random() - 0.5) * 200;
                const rotationMid = (Math.random() - 0.5) * 360;
                efecto.style.setProperty('--dur', `${duracion}s`);
                efecto.style.setProperty('--fs', `${fontSize}px`);
                efecto.style.setProperty('--x-end', `${xEnd}px`);
                efecto.style.setProperty('--y-end', `${yEnd}px`);
                efecto.style.setProperty('--s-end', scaleEnd);
                efecto.style.setProperty('--r-end', `${rotationEnd}deg`);
                efecto.style.setProperty('--x-mid', `${xMid}px`);
                efecto.style.setProperty('--y-mid', `${yMid}px`);
                efecto.style.setProperty('--r-mid', `${rotationMid}deg`);
                contenedor.appendChild(efecto);
                setTimeout(() => efecto.remove(), duracion * 1000);
            }, i * 50);
        }
    }

    function crearEfectosAscendentes() {
        const contenedor = document.getElementById('efectos-ascendentes');
        if (!contenedor) return;
        const cantidad = 25;
        const emojis = ['🎄', '🦌', '🎁', '❄️', '⛄', '🎅', '⭐', '🔔'];

        for (let i = 0; i < cantidad; i++) {
            const efecto = document.createElement('div');
            efecto.className = 'efecto-ascendente';
            efecto.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

            const duracion = Math.random() * 5 + 6;
            const retraso = Math.random() * 7;
            const tamaño = Math.random() * 25 + 15;
            const posicionHorizontal = Math.random() * 100;

            efecto.style.setProperty('--dur', `${duracion}s`);
            efecto.style.setProperty('--fs', `${tamaño}px`);
            efecto.style.left = `${posicionHorizontal}vw`;
            efecto.style.animationDelay = `${retraso}s`;

            contenedor.appendChild(efecto);

            setTimeout(() => {
                efecto.remove();
            }, (duracion + retraso) * 1000);
        }
    }

    function limpiarEfectosAscendentes() {
        const contenedor = document.getElementById('efectos-ascendentes');
        if (contenedor) {
            contenedor.innerHTML = '';
        }
    }

}
