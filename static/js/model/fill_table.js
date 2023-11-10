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
                cellDate.textContent = formatDate(item.date);
                cellModelAmount.textContent = formatAmount(item.amount);

                // Финансовые операции (каждая операция в новой строке)
                item.profits.forEach(profit => {
                    const profitRow = document.createElement('div');
                    profitRow.id = 'tableProfit';
                    profitRow.textContent = formatFinanceOperation('profit', profit.name, profit.amount);
                    profitRow.style.color = 'green';
                    cellFinancialOps.appendChild(profitRow);
                });
                item.expenses.forEach(expense => {
                    const expenseRow = document.createElement('div');
                    expenseRow.id = 'tableExpense';
                    expenseRow.textContent = formatFinanceOperation('expense', expense.name, expense.amount);
                    expenseRow.style.color = 'red';
                    cellFinancialOps.appendChild(expenseRow);
                });

                if (item.realAmount != null) {
                    cellRealityAmount.textContent = formatAmount(item.realAmount);
                } else {
                    cellRealityAmount.textContent = null;
                }
                cellComment.textContent = item.comment;

                // Проверка наличия реальной суммы перед отображением разницы
                if (item.realAmount !== null) {
                    const difference = formatAmount(item.realAmount - item.amount);
                    cellDifference.textContent = difference;
                } else {
                    const difference = null;
                    cellDifference.textContent = difference;
                }

            });
        });
}