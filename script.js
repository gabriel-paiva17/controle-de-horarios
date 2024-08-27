let currentDateElement = document.getElementById('currentDate')

function updateDate() {

    const date = new Date();

    const weekday = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]


    currentDateElement.textContent = weekday[date.getDay()] + " - " + date.toLocaleDateString('pt-br');

}

setInterval(updateDate);

let currentTimeElement = document.getElementById('currentTime');

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateTime);

const typeOfState = document.getElementById('typeOfState');
const notWorking = "N/A"
const working = "Turno em andamento"

let shiftActive = false;  // Estado do turno
let breakActive = false;  // Estado do intervalo

const shiftButton = document.getElementById('shiftButton');
const breakButton = document.getElementById('breakButton');
const startTimeDialog = document.getElementById("startTimeDialog");
const useCurrentTime = document.getElementById("useCurrentTime");

breakButton.disabled = true;

function canHaveABreakStyles() {

    breakButton.disabled = false;  // Ativa o botão de intervalo
    breakButton.querySelector('span').textContent = "Iniciar Intervalo";
    breakButton.style.background = "lightblue";  // Volta para a cor original
    breakButton.style.color = "lightblue";

}

function startTurnStyles() {

    shiftButton.querySelector('span').textContent = "Fim do Turno";
    shiftButton.style.background = "#ff6666";  // Muda a cor do botão para indicar que está em andamento
    shiftButton.style.color = "#ff6666";

    canHaveABreakStyles();

    typeOfState.textContent = working;

}

function endTurnStyles() {

    shiftButton.querySelector('span').textContent = "Iniciar Turno";
    shiftButton.style.background = "#66ff66";  // Volta para a cor original
    shiftButton.style.color = "#66ff66";

    breakButton.disabled = true;  // Desativa o botão de intervalo
    
    breakButton.querySelector('span').textContent = "Desativado";
    breakButton.style.background = "grey";
    breakButton.style.color = "black";

    typeOfState.textContent = notWorking;

}

function startBreakStyles() {

    breakButton.querySelector('span').textContent = "Fim do Intervalo";
    breakButton.style.background = "#ff6666";  // Muda a cor do botão para indicar que está em andamento
    breakButton.style.color = "#ff6666";

    typeOfState.textContent = "Intervalo em andamento";

}

function endBreakStyles() {

    canHaveABreakStyles();

    typeOfState.textContent = working;

}

let currentShift = JSON.parse(localStorage.getItem('currentShift')) || {};
let currentBreak = JSON.parse(localStorage.getItem('currentBreak')) || {};

function IsObjectEmpty(obj) {

    if (Object.keys(obj).length === 0) {
        return true
    }

    return false

}


if (!IsObjectEmpty(currentBreak) && !IsObjectEmpty(currentShift)) {

    startTurnStyles();
    startBreakStyles();

    breakActive = true;
    shiftActive = true;

} else if (!IsObjectEmpty(currentShift)) {

    startTurnStyles();

    shiftActive = true

}

shiftData = {}

// Função para alternar o estado do turno
function toggleShift() {
    if (shiftActive && breakActive) {
        alert("Finalize o intervalo antes de finalizar o turno.");
        return;
    }

    shiftActive = !shiftActive;

    if (shiftActive) {
        
        document.getElementById("startTimeDialog").showModal();

        startTurnStyles();
        
    } else {

        shiftData.endDate = new Date().toISOString();

        let shifts = JSON.parse(localStorage.getItem('shifts')) || [];
        shifts.push(shiftData);

        localStorage.setItem('shifts', JSON.stringify(shifts));

        console.log(shifts);
        shiftData = {};

       endTurnStyles();

    }
}

// Função para alternar o estado do intervalo
function toggleBreak() {

    breakActive = !breakActive;

    if (breakActive) {

       
        shiftData.breakStartDate =  new Date().toISOString();

        startBreakStyles();

       
    } else {

        shiftData.breakEndDate =  new Date().toISOString();

        endBreakStyles();
       
    }
}

function shiftCurrentTime () {

    shiftData.startDate = new Date().toISOString();

}

// Associa as funções aos botões
shiftButton.addEventListener('click', toggleShift);
breakButton.addEventListener('click', toggleBreak);
useCurrentTime.addEventListener('click', shiftCurrentTime);

// Inicialmente desativa o botão de intervalo

