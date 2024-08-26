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
const useCurrentTime = document.getElementById("useCurrentTime")

shiftData = {}

// Função para alternar o estado do turno
function toggleShift() {
    if (shiftActive && breakActive) {
        alert("Finalize o intervalo antes de finalizar o turno.");
        return;
    }

    shiftActive = !shiftActive;

    if (shiftActive) {

        typeOfState.textContent = working;
        
        document.getElementById("startTimeDialog").showModal();

        shiftButton.querySelector('span').textContent = "Fim do Turno";
        shiftButton.style.background = "#ff6666";  // Muda a cor do botão para indicar que está em andamento
        shiftButton.style.color = "#ff6666";

        
        breakButton.disabled = false;  // Ativa o botão de intervalo
        breakButton.querySelector('span').textContent = "Iniciar Intervalo";
        breakButton.style.background = "lightblue";  // Volta para a cor original
        breakButton.style.color = "lightblue";
        
    } else {

        typeOfState.textContent = notWorking;
        shiftData.endDate = new Date().toISOString();

        let shifts = JSON.parse(localStorage.getItem('shifts')) || [];
        shifts.push(shiftData);

        localStorage.setItem('shifts', JSON.stringify(shifts));

        console.log(shifts);
        shiftData = {};

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

        typeOfState.textContent = "Intervalo em andamento";
        shiftData.breakStartDate =  new Date().toISOString();

        breakButton.querySelector('span').textContent = "Fim do Intervalo";
        breakButton.style.background = "#ff6666";  // Muda a cor do botão para indicar que está em andamento
        breakButton.style.color = "#ff6666";
    } else {

        typeOfState.textContent = working;
        shiftData.breakEndDate =  new Date().toISOString();

        breakButton.querySelector('span').textContent = "Iniciar Intervalo";
        breakButton.style.background = "lightblue";  // Volta para a cor original
        breakButton.style.color = "lightblue"
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
breakButton.disabled = true;
