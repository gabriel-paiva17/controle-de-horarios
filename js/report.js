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

        shiftItem.innerHTML = `
            <p class="list-index">${index}</p>
            <p><strong>Início do turno:</strong> ${shift.startDate}</p>
            <p><strong>Fim do turno:</strong> ${shift.endDate}</p>
            <p><strong>Localização de início:</strong> ${shift.startLocation ? `Lat: ${shift.startLocation.latitude}, Lon: ${shift.startLocation.longitude}` : 'N/A'}</p>
            <p><strong>Localização de fim:</strong> ${shift.endLocation ? `Lat: ${shift.endLocation.latitude}, Lon: ${shift.endLocation.longitude}` : 'N/A'}</p>
            <p><strong>Intervalos:</strong></p>
            <ul>
                ${shift.breaks.map(breakPeriod => `
                    <li>
                        <div><strong>Início do intervalo:</strong> ${breakPeriod.startDate}</div> 
                        <div><strong>Localização de início:</strong> ${breakPeriod.startLocation ? `Lat: ${breakPeriod.startLocation.latitude}, Lon: ${breakPeriod.startLocation.longitude}` : 'N/A'}</div> 
                        <div><strong>Fim do intervalo:</strong> ${breakPeriod.endDate}</div>
                        <div><strong>Localização de fim:</strong> ${breakPeriod.endLocation ? `Lat: ${breakPeriod.endLocation.latitude}, Lon: ${breakPeriod.endLocation.longitude}` : 'N/A'}</div>  
                    </li>
                `).join('')}
            </ul>
        `;
        shiftList.appendChild(shiftItem);
    });

    // Adicione o shiftList à dateContainer
    dateContainer.appendChild(shiftList);
    shiftReport.appendChild(dateContainer);
});