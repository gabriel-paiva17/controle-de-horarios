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

function getCurrentCoordinates() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const currentCoords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    resolve(currentCoords);
                },
                function (error) {
                    console.error("Erro ao obter coordenadas: ", error.message);
                    reject({});
                }
            );
        } else {
            console.error("Geolocalização não é suportada pelo navegador.");
            reject({});
        }
    });
}

function formatBrasiliaDateTime(date) {
    const options = { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

const typeOfState = document.getElementById('typeOfState');
const notWorking = "N/A"
const working = "Turno em andamento"

let shiftActive = false;  // Estado do turno
let breakActive = false;  // Estado do intervalo

const shiftButton = document.getElementById('shiftButton');
const breakButton = document.getElementById('breakButton');
const startDateDialog = document.getElementById("startDateDialog");
const closeStartDate = document.getElementById("closeStartDate"); 
const useCurrentTime = document.getElementById("useCurrentTime");
const usePreviousTime = document.getElementById("usePreviousTime");
const previousDateDialog = document.getElementById("previousDateDialog");
const closePreviousDate = document.getElementById("closePreviousDate");
const inputStartDate = document.getElementById("inputStartDate");
const confirmSelectDate = document.getElementById('confirmSelectDate');

breakButton.disabled = true;

function canHaveABreakStyles() {

    breakButton.disabled = false;  // Ativa o botão de intervalo
    breakButton.querySelector('span').textContent = "Iniciar Intervalo";
    breakButton.style.background = "lightblue";  // Volta para a cor original
    breakButton.style.color = "lightblue";

}

function startShiftStyles() {

    shiftButton.querySelector('span').textContent = "Fim do Turno";
    shiftButton.style.background = "#ff6666";  // Muda a cor do botão para indicar que está em andamento
    shiftButton.style.color = "#ff6666";

    canHaveABreakStyles();

    typeOfState.textContent = working;

}

function endShiftStyles() {

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

let currentShift = JSON.parse(localStorage.getItem('currentShift')) || {breaks: []};
let currentBreak = JSON.parse(localStorage.getItem('currentBreak')) || {};

function IsObjectActive(obj) {

    return obj.startDate != null

}

if (IsObjectActive(currentBreak) && IsObjectActive(currentShift)) {

    startShiftStyles();
    startBreakStyles();

    breakActive = true;
    shiftActive = true;

} else if (IsObjectActive(currentShift)) {

    startShiftStyles();

    shiftActive = true

}

// Função para alternar o estado do turno
async function toggleShift() {

    shiftButton.disabled = true;

    if (shiftActive && breakActive) {
        alert("Finalize o intervalo antes de finalizar o turno.");
        shiftButton.disabled = false;
        return;
    }

    if (!shiftActive) {
        
        startDateDialog.showModal();
        
    } else {

        currentShift.endDate = formatBrasiliaDateTime(new Date());
        
        await getCurrentCoordinates()
            .then(location => {
                currentShift.endLocation = location;
            })
            .catch(error => {
                console.error("Erro ao obter a localização:", error);
                alert("Erro ao obter a localização. Tente novamente.");
                shiftButton.disabled = false;
                return;
            });

        if (!shiftButton.disabled) {

            return;

        }

        let shifts = JSON.parse(localStorage.getItem('shifts')) || [];
        shifts.push(currentShift);

        localStorage.setItem('shifts', JSON.stringify(shifts));
        
        currentShift = {breaks:[]}
        localStorage.removeItem('currentShift');

        endShiftStyles();
        shiftActive = !shiftActive;

        console.log(shifts)

        showSuccessAlert("Turno finalizado!");

    }

    shiftButton.disabled = false;
}

// Função para alternar o estado do intervalo
async function toggleBreak() {

    breakButton.disabled = true;

    if (!breakActive) {

        currentBreak = {};

        currentBreak.startDate = formatBrasiliaDateTime(new Date());
       
        await getCurrentCoordinates()
            .then(location => {
                currentBreak.startLocation = location;
            })
            .catch(error => {
                console.error("Erro ao obter a localização:", error);
                alert("Erro ao obter a localização. Tente novamente.");
                breakButton.disabled = false;
                return;
            });
     
        if (!breakButton.disabled) {

            return;

        }

        localStorage.setItem('currentBreak', JSON.stringify(currentBreak));

        startBreakStyles();

        showSuccessAlert("Intervalo iniciado!");

        breakActive = !breakActive;

       
    } else {

        currentBreak.endDate = formatBrasiliaDateTime(new Date());
        
        await getCurrentCoordinates()
            .then(location => {
                currentBreak.endLocation = location;
            })
            .catch(error => {
                console.error("Erro ao obter a localização:", error);
                alert("Erro ao obter a localização. Tente novamente.");
                breakButton.disabled = false;
                return;
            });
     
        if (!breakButton.disabled) {

            return;

        }

        currentShift.breaks.push(currentBreak)

        localStorage.setItem('currentShift', JSON.stringify(currentShift));
        localStorage.removeItem('currentBreak');

        endBreakStyles();

        showSuccessAlert("Intervalo finalizado!")

        breakActive = !breakActive;
       
    }

    breakButton.disabled = false;

}

async function startShiftCurrentTime () {

    currentShift.startDate = formatBrasiliaDateTime(new Date());
    currentShift.startLocation = await getCurrentCoordinates();
    currentShift.id = crypto.randomUUID();
    currentShift.edited = false;
    localStorage.setItem('currentShift', JSON.stringify(currentShift));
    
    startShiftStyles();
    shiftActive = !shiftActive;

    showSuccessAlert("Turno iniciado!");

}

async function startShiftPreviousTime() {

    confirmSelectDate.disabled = true;

    if (!inputStartDate.value) {
        alert("Por favor, insira uma data.");
        return;
    }

    let selectedDate = new Date(inputStartDate.value);
    let currentDate = new Date();

    if (selectedDate >= currentDate) {
        alert("A data selecionada deve ser anterior à data e hora atuais.");
        return;
    }

    currentShift.startDate = formatBrasiliaDateTime(selectedDate);
    await getCurrentCoordinates()
        .then(location => {
            currentShift.startLocation = location;
        })
        .catch(error => {
            console.error("Erro ao obter a localização:", error);
            alert("Erro ao obter a localização. Tente novamente.");
            confirmSelectDate.disabled = false;
            return;
        });

    if (!confirmSelectDate.disabled) {

        return;

    }

    currentShift.edited = false;
    currentShift.id = crypto.randomUUID();
    currentShift.startedWithPreviousDate = true;
    localStorage.setItem('currentShift', JSON.stringify(currentShift));

    previousDateDialog.close();
    startShiftStyles();
    shiftActive = !shiftActive;

    showSuccessAlert("Turno iniciado!")
    
    confirmSelectDate.disabled = false;

} 

// Associa as funções aos botões
shiftButton.addEventListener('click', toggleShift);
breakButton.addEventListener('click', toggleBreak);
closeStartDate.addEventListener('click', () => {
    startDateDialog.close();
});
useCurrentTime.addEventListener('click', startShiftCurrentTime);
usePreviousTime.addEventListener('click',() => {
    previousDateDialog.showModal();
});
closePreviousDate.addEventListener('click', () => {
    previousDateDialog.close();
});
confirmSelectDate.addEventListener('click', startShiftPreviousTime);

const successAlert = document.getElementById("successAlert");
const successAlertText = document.getElementById("successAlertText");

function showSuccessAlert(message) {

    successAlertText.textContent = message;

    successAlert.classList.remove("hidden");

    setTimeout(() => {
        successAlert.classList.add("hidden");
    }, 5000);

}

const inputAbsentDate = document.getElementById("inputAbsentDate");
const absentButton = document.getElementById("absentButton");
const absentDialog = document.getElementById("absentDialog");
const closeAbsentDialog = document.getElementById("closeAbsentDialog");
const submitAbsentButton = document.getElementById("submitAbsence");
const absenceAttachment = document.getElementById("absenceAttachment");
let fileContent = '';
const MAX_SIZE_FILE = 1 * 1024 * 1024; //Tamanho máximo de 1mb

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);
    });
}

document.getElementById('absenceAttachment').addEventListener("change",async (event)=>{
    const file = event.target.files[0];

    if (!file) return;

    if (file.size > MAX_SIZE_FILE){
        alert("Tamanho máximo de arquivo permitido é 1mb");
        return;
    }

    try{
        fileContent = await readFileContent(file);
    } catch(error){
        console.error("Erro ao ler o arquivo", error);
    }
});

submitAbsentButton.addEventListener('click', () => {

    if (!fileContent){
        alert('Nenhum arquivo foi selecionado!');
        return
    }

    if (inputAbsentDate.value == ""){
        alert("Selecione uma data e horário");
        return
    }

    let absence = {
        "id": crypto.randomUUID(),
        "startDate": formatBrasiliaDateTime(new Date(inputAbsentDate.value)),
        "file": fileContent,
        "edited": false,
    }

    saveAbsence(absence);
    absentDialog.close();
    showSuccessAlert("Ausência enviada");
})

function restoreAllAbsences(){
    let allAbsences = localStorage.getItem("absences");

    if(!allAbsences){
        return [];
    }

    return JSON.parse(allAbsences)
}

function saveAbsence(absence){
    let allAbsences = restoreAllAbsences();

    allAbsences.push(absence);

    localStorage.setItem("absences", JSON.stringify(allAbsences))
}

closeAbsentDialog.addEventListener('click', () => {
    absentDialog.close();
});

absentButton.addEventListener('click', () => {

    absentDialog.showModal();

})

const shiftRecordButton = document.getElementById("shiftRecordButton");

shiftRecordButton.addEventListener('click',() => {

    window.location.href = 'https://gabriel-paiva17.github.io/controle-de-horarios/html/report.html'

})