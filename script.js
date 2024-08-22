let currentTimeElement = document.getElementById('currentTime');

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateTime);

let shiftActive = false;  // Estado do turno
let breakActive = false;  // Estado do intervalo

const shiftButton = document.getElementById('shiftButton');
const breakButton = document.getElementById('breakButton');

// Função para alternar o estado do turno
function toggleShift() {
    if (shiftActive && breakActive) {
        alert("Finalize o intervalo antes de finalizar o turno.");
        return;
    }

    shiftActive = !shiftActive;

    if (shiftActive) {
        shiftButton.querySelector('span').textContent = "Fim do Turno";
        shiftButton.style.background = "#ff6666";  // Muda a cor do botão para indicar que está em andamento
        shiftButton.style.color = "#ff6666";

        
        breakButton.disabled = false;  // Ativa o botão de intervalo
        breakButton.querySelector('span').textContent = "Iniciar Intervalo";
        breakButton.style.background = "lightblue";  // Volta para a cor original
        breakButton.style.color = "lightblue"
        
    } else {
        shiftButton.querySelector('span').textContent = "Iniciar Turno";
        shiftButton.style.background = "#66ff66";  // Volta para a cor original
        shiftButton.style.color = "#66ff66";

        breakButton.disabled = true;  // Desativa o botão de intervalo
        
        breakButton.querySelector('span').textContent = "Desativado";
        breakButton.style.background = "grey";
        breakButton.style.color = "black";


    }
}

// Função para alternar o estado do intervalo
function toggleBreak() {

    breakActive = !breakActive;

    if (breakActive) {
        breakButton.querySelector('span').textContent = "Fim do Intervalo";
        breakButton.style.background = "#ff6666";  // Muda a cor do botão para indicar que está em andamento
        breakButton.style.color = "#ff6666";
    } else {
        breakButton.querySelector('span').textContent = "Iniciar Intervalo";
        breakButton.style.background = "lightblue";  // Volta para a cor original
        breakButton.style.color = "lightblue"
    }
}

// Associa as funções aos botões
shiftButton.addEventListener('click', toggleShift);
breakButton.addEventListener('click', toggleBreak);

// Inicialmente desativa o botão de intervalo
breakButton.disabled = true;
