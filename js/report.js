const shiftReport = document.getElementById('shiftReport');
const shifts = JSON.parse(localStorage.getItem('shifts')) || [];

if (shifts.length === 0) {
 
    shiftReport.textContent = "Nenhum turno encontrado."; 

}

const groupedShifts = shifts.reduce((group, shift) => {
   
    const shiftDate = shift.startDate.substring(0, 10);

    if (!group[shiftDate]) {
        group[shiftDate] = [];
    }
    group[shiftDate].push(shift);
    return group;
}, {});

Object.keys(groupedShifts).forEach(date => {
    const dateContainer = document.createElement('div');
    dateContainer.classList.add('date-group');
    
    const dateTitle = document.createElement('h2');
    dateTitle.textContent = date;
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = "Mostrar/Ocultar";
    toggleButton.addEventListener('click', () => {
        shiftList.classList.toggle('hidden');
    });

    const shiftList = document.createElement('div');
    shiftList.classList.add('shift-list');
    
    groupedShifts[date].forEach(shift => {
        const shiftItem = document.createElement('div');
        shiftItem.classList.add('shift-item');
        shiftItem.innerHTML = `
            <p><strong>Início do turno:</strong> ${shift.startDate}</p>
            <p><strong>Fim do turno:</strong> ${shift.endDate}</p>
            <p><strong>Localização de início:</strong> ${shift.startLocation ? `Lat: ${shift.startLocation.latitude}, Lon: ${shift.startLocation.longitude}` : 'N/A'}</p>
            <p><strong>Localização de fim:</strong> ${shift.endLocation ? `Lat: ${shift.endLocation.latitude}, Lon: ${shift.endLocation.longitude}` : 'N/A'}</p>
            <p><strong>Intervalos:</strong></p>
            <ul>
                ${shift.breaks.map(breakPeriod => `
                    <li>
                        <div><strong>Início do intervalo:</strong> ${breakPeriod.startDate}</div> 
                        <div><strong>Fim do intervalo:</strong> ${breakPeriod.endDate}</div>
                    </li>
                `).join('')}
            </ul>
        `;
        shiftList.appendChild(shiftItem);
    });

    dateContainer.appendChild(dateTitle);
    dateContainer.appendChild(toggleButton);
    dateContainer.appendChild(shiftList);
    shiftReport.appendChild(dateContainer);
});