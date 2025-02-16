document.addEventListener('DOMContentLoaded', function() {

    //====================== MODAL CONFIGURACION ======================//
    const engraneBoton = document.querySelector('.boton-configuracion');
    const modalConfiguracion = document.querySelector('#modal-configuracion');
    const cerrarModal = document.querySelector('#cerrar-modal');

    // modalConfiguracion.classList.add('mostrar');

    engraneBoton.addEventListener('click', function(e) {
        e.preventDefault();
        modalConfiguracion.classList.add('mostrar');
    });

    cerrarModal.addEventListener('click', function() { 
        modalConfiguracion.classList.remove('mostrar');
    });

    // TEMPORIZADOR
    let temporizador;
    let tiempoTerminado = false;
    const minutosInput = document.querySelector('#minutos');
    const segundosInput = document.querySelector('#segundos');
    const temporizadorTexto = document.querySelector('#temporizador-texto');

    function actualizarTemporizadorTexto() {
        const minutos = minutosInput.value ? parseInt(minutosInput.value).toString().padStart(2, '0') : '00';
        const segundos = segundosInput.value ? parseInt(segundosInput.value).toString().padStart(2, '0') : '00';
        temporizadorTexto.textContent = `${minutos}:${segundos}`;
    }

    minutosInput.addEventListener('input', actualizarTemporizadorTexto);
    segundosInput.addEventListener('input', actualizarTemporizadorTexto);

    function iniciarTemporizador() {
        let minutos = minutosInput.value ? parseInt(minutosInput.value) : 0;
        let segundos = segundosInput.value ? parseInt(segundosInput.value) : 0;
        tiempoTerminado = false;

        temporizador = setInterval(() => {
            if (segundos === 0) {
                if (minutos === 0) {
                    mostrarModalGanador('Empate');
                    actualizarContador('Empate');
                    detenerTemporizador();
                    tiempoTerminado = true;
                    return;
                }
                minutos--;
                segundos = 59;
            } else {
                segundos--;
            }

            temporizadorTexto.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function detenerTemporizador() {
        clearInterval(temporizador);
    }

    function reiniciarTemporizador() {
        detenerTemporizador();
        temporizadorIniciado = false;
        tiempoTerminado = false;

        let minutos = minutosInput.value ? parseInt(minutosInput.value) : 0;
        let segundos = segundosInput.value ? parseInt(segundosInput.value) : 0;
        temporizadorTexto.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    // MODIFICAR ICONOS
    let iconoCirculo = 'img/circulo.png';
    let iconoCruz = 'img/cruz.png';
    let nombreIconoCirculo = 'Circulo';
    let nombreIconoCruz = 'Cruz';
    const iconoParesSelect = document.querySelector('#icono-pares');

    iconoParesSelect.addEventListener('change', function() {
        const [circulo, cruz] = iconoParesSelect.value.split(',');
        iconoCirculo = circulo;
        iconoCruz = cruz;
        actualizarIconosTablero();
        actualizarIconosResumen();
    });

    function actualizarIconosTablero() {
        casillas.forEach((casilla, index) => {
            if (tablero[index] === 'X') {
                casilla.innerHTML = `<img src="${iconoCruz}" alt="Cruz">`;
            } else if (tablero[index] === 'O') {
                casilla.innerHTML = `<img src="${iconoCirculo}" alt="Círculo">`;
            }
        });
    }

    function actualizarIconosResumen() {
        const iconoJugador1 = document.querySelector('#jugador1-icono');
        const iconoJugador2 = document.querySelector('#jugador2-icono');

        iconoJugador1.src = iconoCirculo;
        iconoJugador2.src = iconoCruz;

        if (iconoCirculo.includes('gato')) {
            nombreIconoCirculo = 'Gato';
        } else if (iconoCirculo.includes('estrella')) {
            nombreIconoCirculo = 'Estrella';
        } else {
            nombreIconoCirculo = 'Cruz';
        }

        if (iconoCruz.includes('perro')) {
            nombreIconoCruz = 'Perro';
        } else if (iconoCruz.includes('luna')) {
            nombreIconoCruz = 'Luna';
        } else {
            nombreIconoCruz = 'Circulo';
        }
    }

    // MODIFICAR COLORES
    const color1Input = document.querySelector('#color1');
    const color2Input = document.querySelector('#color2');    

    color1Input.addEventListener('input', actualizarColores);
    color2Input.addEventListener('input', actualizarColores);

    function actualizarColores() {
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        casillas.forEach((casilla, index) => {
            casilla.style.backgroundColor = index % 2 === 0 ? color1 : color2;
        });
    }    


    //====================== MODAL GANADOR ======================//
    const modalGanador = document.querySelector('#modal-ganador');
    const mensajeGanador = document.querySelector('#mensaje-ganador');
    const cerrarModalGanador = document.querySelector('#cerrar-modal-ganador');

    cerrarModalGanador.addEventListener('click', function() {
        modalGanador.close();
    });

    function mostrarModalGanador(resultado) {
        if (resultado === 'Empate') {
            mensajeGanador.textContent = '¡Es un empate!';
        } else {
            mensajeGanador.textContent = `¡${resultado} ha ganado!`;
        }
        modalGanador.showModal();
    }


    //=============== MODAL CONFIRMAR REINICIO ===============//
    const botonReinicio = document.querySelector('.boton-reiniciar');
    const modalConfirmacionReinicio = document.querySelector('#modal-confirmacion-reinicio');
    const confirmarReinicio = document.querySelector('#confirmar-reinicio');
    const cancelarReinicio = document.querySelector('#cancelar-reinicio');    

    let clickCount = 0;    
    let clickTimer = null;
    
    botonReinicio.addEventListener('click', function(e) {
        e.preventDefault();
        clickCount++;

        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                reiniciarJuego();
                clickCount = 0;
            }, 300);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            mostrarModalConfirmacionReinicio();
            clickCount = 0;
        }
    });

    confirmarReinicio.addEventListener('click', function() {
        reiniciarContadores();
        reiniciarIconosResumen();
        modalConfirmacionReinicio.close();
    });

    cancelarReinicio.addEventListener('click', function() {
        modalConfirmacionReinicio.close();
    });

    function mostrarModalConfirmacionReinicio() {
        modalConfirmacionReinicio.showModal();
    }

    function reiniciarContadores() {
        jugador1Ganadas.textContent = '0';
        jugador2Ganadas.textContent = '0';
        empates.textContent = '0';
        
        color1Input.value = '#ffffff';
        color2Input.value = '#ffffff';
        reiniciarJuego();
    }

    function reiniciarIconosResumen() {
        iconoParesSelect.value = 'img/circulo.png,img/cruz.png';
        iconoCirculo = 'img/circulo.png';
        iconoCruz = 'img/cruz.png';
        actualizarIconosResumen();
    }


    //======================= RESUMEN PARTIDA =======================//
    const jugador1Ganadas = document.querySelector('#jugador1-ganadas');
    const jugador2Ganadas = document.querySelector('#jugador2-ganadas');
    const empates = document.querySelector('#empates');

    function actualizarContador(ganador) {
        if (ganador === 'O') {            
            jugador1Ganadas.textContent = parseInt(jugador1Ganadas.textContent) + 1;            
        } else if (ganador === 'X') {
            jugador2Ganadas.textContent = parseInt(jugador2Ganadas.textContent) + 1;
        } else {
            empates.textContent = parseInt(empates.textContent) + 1;
        }
    }


    //==================== TIC TAC TOE ====================//
    const casillas = document.querySelectorAll('.casilla');    
    const tablero = Array(9).fill(null);
    let turnoActual = 'X'; 
    let temporizadorIniciado = false;
    const turnoTexto = document.querySelector('#turno-texto');

    const combinacionesGanadoras = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];    

    casillas.forEach(casilla => casilla.addEventListener('click', manejarClick));

    function manejarClick(e) {
        if (tiempoTerminado) return;

        const index = e.target.dataset.index;
        if (tablero[index] || verificarEstadoJuego()) return;
        tablero[index] = turnoActual;
        
        if (!temporizadorIniciado) {
            iniciarTemporizador();
            temporizadorIniciado = true;
        }

        asignarImagen(turnoActual, e);

        const resultado = verificarEstadoJuego();
        if (resultado) {
            mostrarModalGanador(resultado);
            actualizarContador(resultado);
            detenerTemporizador();
            return;
        }

        turnoActual = turnoActual === 'X' ? 'O' : 'X';
        turnoTexto.textContent = `${turnoActual === 'X' ? nombreIconoCruz : nombreIconoCirculo}`;
    }

    function verificarEstadoJuego() {
        const ganador = combinacionesGanadoras.find(combinacion => {
            const [a, b, c] = combinacion;
            return tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c];
        });

        if (ganador) {
            return turnoActual;
        }

        if (tablero.every(casilla => casilla !== null)) {
            return 'Empate';
        }

        return null;
    }

    function reiniciarJuego() {
        tablero.fill(null);
        casillas.forEach(casilla => casilla.textContent = '');
        turnoActual = 'X';
        turnoTexto.textContent = `${nombreIconoCruz}`;
        reiniciarTemporizador();
        actualizarColores();
    }

    function asignarImagen(turnoActual, e) {
        const img = document.createElement('img');
        img.src = turnoActual === 'X' ? iconoCruz : iconoCirculo;
        e.target.appendChild(img);
    }        
});