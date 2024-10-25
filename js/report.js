const shiftReport = document.getElementById('shiftReport');
const shifts = JSON.parse(localStorage.getItem('shifts')) || [];
const selectPeriod = document.getElementById('selectPeriod');


function stringToDate(dateString) {
    dateString = dateString.substring(0, 10);
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day); // Mês no objeto Date começa do zero (0 = Janeiro)
}

// Função para obter o intervalo da semana passada
function getLastWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const lastSunday = new Date(now);
    lastSunday.setDate(now.getDate() - dayOfWeek - 7);
    const lastSaturday = new Date(lastSunday);
    lastSaturday.setDate(lastSunday.getDate() + 6);
    return { start: lastSunday, end: lastSaturday };
}

// Função para obter o intervalo do mês passado
function getLastMonthRange() {
    const now = new Date();
    const lastMonth = now.getMonth() - 1;
    const year = now.getFullYear();
    const start = new Date(year, lastMonth, 1);
    const end = new Date(year, lastMonth + 1, 0);
    return { start, end };

}

// Filtrar por semana passada
function filterByLastWeek(items) {
    const { start, end } = getLastWeekRange();
    return items.filter(item => {
        const itemDate = stringToDate(item.startDate);
        return itemDate >= start && itemDate <= end;
    });
}

// Filtrar por mês passado
function filterByLastMonth(items) {
    const { start, end } = getLastMonthRange();
    return items.filter(item => {
        const itemDate = stringToDate(item.startDate);
        return itemDate >= start && itemDate <= end;
    });
}

function renderShifts(filteredShifts) {

    shiftReport.textContent = "";

    const groupedShifts = filteredShifts.reduce((group, shift) => {
   
        const shiftDate = shift.startDate.substring(0, 10);
    
        if (!group[shiftDate]) {
            group[shiftDate] = [];
        }
        group[shiftDate].push(shift);
        return group;
    }, {});

    if (filteredShifts.length === 0) {
    
        shiftReport.textContent = "Nenhum turno encontrado."; 

    }

    Object.keys(groupedShifts).forEach(date => {
        const dateContainer = document.createElement('div');
        dateContainer.classList.add('date-container');
        dateContainer.classList.add('grey-background');

        // Crie uma string HTML para o conteúdo
        dateContainer.innerHTML = `
            <h2 class="date-container-title">${date}</h2>
            <img src="../icon/arrow-down-icon.jpg" class="toggleImage">        
            `;

        // Crie o shiftList aqui
        const shiftList = document.createElement('div');
        shiftList.classList.add('shift-list');
        shiftList.classList.add('hidden'); // A lista começa oculta

        // Obtenha a imagem para adicionar o evento de clique
        const toggleImage = dateContainer.querySelector('.toggleImage');
        toggleImage.addEventListener('click', () => {
            shiftList.classList.toggle('hidden');
            toggleImage.classList.toggle('flip-vertical');
        });

        // Adicione os itens de turno ao shiftList
        groupedShifts[date].forEach((shift, index) => {
            const shiftItem = document.createElement('div');
            shiftItem.classList.add('shift-item');

            breakContent = `<p class="redText"><strong>Sem intervalos.</strong></p>`

            if (shift.breaks && shift.breaks.length > 0) {

                breakContent = `
                <p><strong>Intervalos:</strong></p>
                <ul class="breakList">
                    ${shift.breaks.map((breakPeriod, breakIndex) => `
                        <li class="${shift.breaks.length === 1 ? 'onlyBreak' : (breakIndex === 0 ? 'firstBreak' : (breakIndex === shift.breaks.length - 1 ? 'lastBreak' : 'break'))}">
                            <div class="breakInfo"><strong>Início do intervalo:</strong> ${breakPeriod.startDate}</div> 
                            <div class="breakInfo"><strong>Localização de início:</strong> ${breakPeriod.startLocation ? `Lat: ${breakPeriod.startLocation.latitude}, Lon: ${breakPeriod.startLocation.longitude}` : 'N/A'}</div> 
                            <div class="breakInfo"><strong>Fim do intervalo:</strong> ${breakPeriod.endDate}</div>
                            <div><strong>Localização de fim:</strong> ${breakPeriod.endLocation ? `Lat: ${breakPeriod.endLocation.latitude}, Lon: ${breakPeriod.endLocation.longitude}` : 'N/A'}</div>  
                        </li>
                    `).join('')}
                </ul>`

            }

            shiftItem.innerHTML = `
                <p class="list-index">${index + 1}</p>
                ${shift.startedWithPreviousDate ? `<p class="redText"><strong>Esse turno foi inicializado com uma data anterior selecionada manualmente.</strong></p>` : ``}
                <p><strong>Início do turno:</strong> ${shift.startDate}</p>
                <p><strong>Fim do turno:</strong> ${shift.endDate}</p>
                <p><strong>Localização de início:</strong> ${shift.startLocation ? `Lat: ${shift.startLocation.latitude}, Lon: ${shift.startLocation.longitude}` : 'N/A'}</p>
                <p><strong>Localização de fim:</strong> ${shift.endLocation ? `Lat: ${shift.endLocation.latitude}, Lon: ${shift.endLocation.longitude}` : 'N/A'}</p>
                ${breakContent}
            `;
            shiftList.appendChild(shiftItem);
        });

        // Adicione o shiftList à dateContainer
        dateContainer.appendChild(shiftList);
        shiftReport.appendChild(dateContainer);
    });

}

// Renderiza todos os turnos inicialmente
renderShifts(shifts);

// Elemento para o relatório de ausências
const absenceReport = document.getElementById('absenceReport');
const absences = JSON.parse(localStorage.getItem('absences')) || [];

console.log(absences)

function renderAbsences(filteredAbsences) {
    absenceReport.textContent = ""; // Limpar o conteúdo anterior

    if (filteredAbsences.length === 0) {
        absenceReport.textContent = "Nenhuma ausência registrada.";
        return; // Termina a função se não houver ausências
    }

    const groupedAbsences = filteredAbsences.reduce((group, absence) => {
        const absenceDate = absence.startDate.substring(0, 10); // Usando startDate
        if (!group[absenceDate]) {
            group[absenceDate] = [];
        }
        group[absenceDate].push(absence);
        return group;
    }, {});

    Object.keys(groupedAbsences).forEach(date => {
        const dateContainer = document.createElement('div');
        dateContainer.classList.add('date-container');
        dateContainer.classList.add('yellow-background');


        dateContainer.innerHTML = `
            <h2 class="date-container-title">${date}</h2>
            <img src="../icon/arrow-down-icon.jpg" class="toggleImage">
        `;

        const absenceList = document.createElement('div');
        absenceList.classList.add('absence-list', 'hidden');

        const toggleImage = dateContainer.querySelector('.toggleImage');
        toggleImage.addEventListener('click', () => {
            absenceList.classList.toggle('hidden');
            toggleImage.classList.toggle('flip-vertical');
        });

        groupedAbsences[date].forEach((absence, index) => {
            const absenceItem = document.createElement('div');
            absenceItem.classList.add('absence-item');

            absenceItem.innerHTML = `
                <p class="list-index">${index + 1}</p>
                <p><strong>Data:</strong> ${absence.startDate}</p> 
                <p><strong>Arquivo:</strong> ${
                    absence.file ? 
                    `<a href="${URL.createObjectURL(new Blob([absence.file], { type: 'application/octet-stream' }))}" download="ausencia_${index + 1}_${absence.startDate.substring(0, 10)}.png">Baixar</a>` : 
                    'Não disponível'
                }</p>
            `;

            absenceList.appendChild(absenceItem);
        });

        dateContainer.appendChild(absenceList);
        absenceReport.appendChild(dateContainer);
    });
}

renderAbsences(absences)

// Evento para filtrar ao selecionar o período
selectPeriod.addEventListener('change', () => {
    let filteredShifts = shifts;
    let filteredAbsences = absences;

    if (selectPeriod.value === 'week') {
        filteredShifts = filterByLastWeek(shifts);
        filteredAbsences = filterByLastWeek(absences);
    } else if (selectPeriod.value === 'month') {
        filteredShifts = filterByLastMonth(shifts);
        filteredAbsences = filterByLastMonth(absences);
    }

    renderShifts(filteredShifts);      // Renderiza os turnos filtrados
    renderAbsences(filteredAbsences);  // Renderiza as ausências filtradas
});

