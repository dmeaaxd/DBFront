// Получение name и id модели из URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Получение токена пользователя из URL
// const token = urlParams.get('token');
token = sessionStorage.getItem('token');


if (id) {
    fetch('http://127.0.0.1:8000/finance/dates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                    query {
                        modelDates(modelId: "${id}") {
                            id
                            date
                            amount
                            realAmount
                            comment
                            profits {
                                name
                                amount
                            }
                            expenses {
                                name
                                amount
                            }
                        }
                    }
                `
        })
    })
        .then(response => response.json())
        .then(data => {
            const modelData = data.data.modelDates;
            const tableBody = document.getElementById('tableBody');

            // sessionStorage.clear()

            // Заполнение таблицы данными
            modelData.forEach(item => {
                const row = tableBody.insertRow();
                row.id = `row_${item.id}`; // Устанавливаем ID строки



                const cellDate = row.insertCell(0);
                const cellModelAmount = row.insertCell(1); // Сумма
                const cellFinancialOps = row.insertCell(2); // Финансовые операции
                const cellRealityAmount = row.insertCell(3); // Сумма
                const cellComment = row.insertCell(4); // Комментарий
                const cellDifference = row.insertCell(5); // Разница


                sessionStorage.setItem(item.date.toString(), item.id.toString())


                // Вставляем данные в ячейки
                cellDate.textContent = item.date;
                cellModelAmount.textContent = item.amount;

                // Финансовые операции (каждая операция в новой строке)
                item.profits.forEach(profit => {
                    const profitRow = document.createElement('div');
                    profitRow.textContent = `${profit.name} +${profit.amount}`;
                    cellFinancialOps.appendChild(profitRow);
                });
                item.expenses.forEach(expense => {
                    const expenseRow = document.createElement('div');
                    expenseRow.textContent = `${expense.name} -${expense.amount}`;
                    cellFinancialOps.appendChild(expenseRow);
                });

                cellRealityAmount.textContent = item.realAmount;
                cellComment.textContent = item.comment;

                // Проверка наличия реальной суммы перед отображением разницы
                if (item.realAmount !== null) {
                    const difference = item.realAmount - item.amount;
                    cellDifference.textContent = difference;
                } else {
                    const difference = "-";
                    cellDifference.textContent = difference;
                }

            });
        });
}