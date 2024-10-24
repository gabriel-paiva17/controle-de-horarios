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

// Filtrar turnos por semana passada
function filterShiftsByLastWeek(shifts) {
    const { start, end } = getLastWeekRange();
    return shifts.filter(shift => {
        const shiftDate = stringToDate(shift.startDate);
        return shiftDate >= start && shiftDate <= end;
    });
}

// Filtrar turnos por mês passado
function filterShiftsByLastMonth(shifts) {
    const { start, end } = getLastMonthRange();
    return shifts.filter(shift => {
        const shiftDate = stringToDate(shift.startDate);
        return shiftDate >= start && shiftDate <= end;
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

// Evento para filtrar ao selecionar o período
selectPeriod.addEventListener('change', () => {
    let filteredShifts = shifts;
    if (selectPeriod.value === 'week') {
        filteredShifts = filterShiftsByLastWeek(shifts);
    } else if (selectPeriod.value === 'month') {
        filteredShifts = filterShiftsByLastMonth(shifts);
    }
    renderShifts(filteredShifts); // Renderiza os turnos filtrados
});

// Renderiza todos os turnos inicialmente
renderShifts(shifts);