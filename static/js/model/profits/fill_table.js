// Получение name и id модели из URL
const urlParams = new URLSearchParams(window.location.search);

// Получение токена пользователя из URL
// const token = urlParams.get('token');
const token = sessionStorage.getItem('token');

const modelId = urlParams.get('id');


if (modelId) {
    fetch('http://127.0.0.1:8000/finance/profits', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                    query {
                      modelProfits(modelId: "${modelId}") {
                        id
                        name
                        startDate
                        amount
                        replayType {
                          id
                          name
                          days
                          months
                          years
                        }
                        customReplayDays
                        finishDate
                      }
                    }
                `
        })
    })
        .then(response => response.json())
        .then(data => {

            const modelProfits = data.data.modelProfits;

            const tableBody = document.getElementById('tableBody');

            modelProfits.forEach(item => {
                const row = tableBody.insertRow();
                row.id = `row_${item.id}`;

                const cellDate = row.insertCell(0);
                const cellName = row.insertCell(1);
                const cellAmount = row.insertCell(2);
                const cellReplayType = row.insertCell(3);

                // Создаем кнопку "Удалить"
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Удалить";
                deleteButton.id = 'deleteButton';
                deleteButton.addEventListener("click", () => {
                    fetch('http://127.0.0.1:8000/finance/profits', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            query: `
                            mutation {
                              deleteProfit(profitId: "${item.id}") {
                                allProfits {
                                  id
                                  name
                                  startDate
                                  amount
                                  customReplayDays
                                  finishDate
                                }
                              }
                            }
                            `
                        })
                    })
                    location.reload();
                });

                // Создаем кнопку "Редактировать"
                const editButton = document.createElement("button");
                editButton.textContent = "Редактировать";
                editButton.id = 'editButton';
                editButton.addEventListener("click", () => {

                    if (item.replayType.id === '4') {
                        custom_model.style.display = 'block';
                        everyDMY_model.style.display = 'none';
                        withoutRepeat_model.style.display = 'none';

                        const amountInput = document.getElementById('custom_amount');
                        const nameInput = document.getElementById('custom_name');
                        const startDateInput = document.getElementById('custom_startDate');
                        const finishDateInput = document.getElementById('custom_finishDate');
                        const replayDaysInput = document.getElementById('custom_replayDays');


                        // todo Проблема с полями ввода доходов

                        // replayDaysInput.disabled = true;
                        // startDateInput.disabled = true;
                        // finishDateInput.disabled = true;


                        amountInput.value = item.amount;
                        nameInput.value = item.name;
                        startDateInput.value = item.startDate;
                        finishDateInput.value = item.finishDate;
                        replayDaysInput.value = item.customReplayDays;

                        document.getElementById('custom_form').addEventListener('submit', (e) => {
                            e.preventDefault();

                            const formAmount = document.getElementById('custom_amount').value;
                            const formName = document.getElementById('custom_name').value;
                            const formSDate = document.getElementById('custom_startDate').value;
                            const formFDate = document.getElementById('custom_finishDate').value;
                            const formReplayDays = document.getElementById('custom_replayDays').value;

                            fetch('http://127.0.0.1:8000/finance/profits', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    query: `
                                        mutation {
                                          updateProfit(
                                            amount: ${formAmount}
                                            customReplayDays: ${formReplayDays}
                                            finishDate: "${formFDate}"
                                            name: "${formName}"
                                            profitId: "${item.id}"
                                            replayTypeId: "4"
                                            startDate: "${formSDate}"
                                          ) {
                                            profit {
                                              id
                                              name
                                              startDate
                                              amount
                                              customReplayDays
                                              finishDate
                                            }
                                          }
                                        }
                                    `
                                })
                            })
                            location.reload();
                        });
                    } else if (item.replayType.id === '5') {
                        withoutRepeat_model.style.display = 'block';
                        everyDMY_model.style.display = 'none';
                        custom_model.style.display = 'none';

                        const amountInput = document.getElementById('withoutRepeats_amount');
                        const nameInput = document.getElementById('withoutRepeats_name');
                        const startDateInput = document.getElementById('withoutRepeats_startDate');

                        // startDateInput.disabled = true;

                        amountInput.value = item.amount;
                        nameInput.value = item.name;
                        startDateInput.value = item.startDate;


                        document.getElementById('withoutRepeats_form').addEventListener('submit', (e) => {
                            e.preventDefault();

                            const formAmount = document.getElementById('withoutRepeats_amount').value;
                            const formName = document.getElementById('withoutRepeats_name').value;
                            const formSDate = document.getElementById('withoutRepeats_startDate').value;

                            fetch('http://127.0.0.1:8000/finance/profits', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    query: `
                                        mutation {
                                          updateProfit(
                                            amount: ${formAmount}
                                            name: "${formName}"
                                            profitId: "${item.id}"
                                            replayTypeId: "5"
                                            startDate: "${formSDate}"
                                          ) {
                                            profit {
                                              id
                                              name
                                              startDate
                                              amount
                                            }
                                          }
                                        }
                                    `
                                })
                            })
                            location.reload();
                        });


                    } else {
                        everyDMY_model.style.display = 'block';
                        custom_model.style.display = 'none'
                        withoutRepeat_model.style.display = 'none';

                        const amountInput = document.getElementById('everyDMY_amount');
                        const nameInput = document.getElementById('everyDMY_name');
                        const startDateInput = document.getElementById('everyDMY_startDate');
                        const finishDateInput = document.getElementById('everyDMY_finishDate');

                        // startDateInput.disabled = true;
                        // finishDateInput.disabled = true;


                        amountInput.value = item.amount;
                        nameInput.value = item.name;
                        startDateInput.value = item.startDate;
                        finishDateInput.value = item.finishDate;


                        document.getElementById('everyDMY_form').addEventListener('submit', (e) => {
                            e.preventDefault();

                            const formAmount = document.getElementById('everyDMY_amount').value;
                            const formName = document.getElementById('everyDMY_name').value;
                            const formSDate = document.getElementById('everyDMY_startDate').value;
                            const formFDate = document.getElementById('everyDMY_finishDate').value;

                            fetch('http://127.0.0.1:8000/finance/profits', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    query: `
                                        mutation {
                                          updateProfit(
                                            amount: ${formAmount}
                                            finishDate: "${formFDate}"
                                            name: "${formName}"
                                            profitId: "${item.id}"
                                            replayTypeId: "${item.replayType.id}"
                                            startDate: "${formSDate}"
                                          ) {
                                            profit {
                                              id
                                              name
                                              startDate
                                              amount
                                              customReplayDays
                                              finishDate
                                            }
                                          }
                                        }
                                    `
                                })
                            })
                            location.reload();
                        });

                    }
                });

                // Создаем ячку для кнопок
                const actionCell = row.insertCell(4);
                actionCell.appendChild(editButton);
                actionCell.appendChild(deleteButton);


                if (!item.finishDate) {
                    cellDate.textContent = formatDate(item.startDate);
                } else cellDate.textContent = `${formatDate(item.startDate)} - ${formatDate(item.finishDate)}`;

                cellName.textContent = item.name;
                cellAmount.textContent = formatAmount(item.amount);

                if (item.replayType.id !== '4') {
                    cellReplayType.textContent = item.replayType.name;
                } else {
                    cellReplayType.textContent = `Каждые ${item.customReplayDays} суток`;
                }

            })
        });
}