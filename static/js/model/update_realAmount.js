

// Функция для открытия модального окна
function openExpenseModal() {
    const expenseModal = document.getElementById('expenseModal');
    expenseModal.style.display = 'block';
}

// Обработчик клика на кнопке "Добавить расход"
document.getElementById('addExpenseButton').addEventListener('click', openExpenseModal);

// Обработчик отправки формы добавления расхода
document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const expenseDate = document.getElementById('expenseDate').value;
    const expenseAmount = document.getElementById('expenseAmount').value;
    const expenseComment = document.getElementById('expenseComment').value;

    // Отправка запроса на сервер для добавления расхода
    fetch('http://127.0.0.1:8000/finance/dates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                mutation {
                    updateDate(comment: "${expenseComment}", dateId: "${sessionStorage.getItem(expenseDate)}", realAmount: ${expenseAmount}) {
                        date {
                            id
                            date
                            amount
                            realAmount
                            comment
                        
                        }
                    }
                }
            `
        })
    })
        .then(response => response.json())
        .then(data => {
            // Обработка успешного ответа от сервера
            const updatedItem = data.data.updateDate.date;
            const row = document.getElementById(`row_${updatedItem.id}`);
            const cellDate = row.cells[0];
            const cellRealityAmount = row.cells[3];
            const cellComment = row.cells[4];

            // Обновление ячеек в таблице
            cellDate.textContent = updatedItem.date;
            cellRealityAmount.textContent = updatedItem.realAmount;
            cellComment.textContent = updatedItem.comment;

            location.reload()
            //
            // // Закрытие модального окна
            // const expenseModal = document.getElementById('expenseModal');
            // expenseModal.style.display = 'none';
        })
        .catch(error => {
            // Обработка ошибки
            console.error("Произошла ошибка при добавлении расхода:", error);
        });
});
