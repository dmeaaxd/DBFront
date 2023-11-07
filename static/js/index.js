// Получение токена пользователя из URL
// const urlParams = new URLSearchParams(window.location.search);
// const token = urlParams.get('token');

token = sessionStorage.getItem('token');

// Проверка, есть ли токен в URL
if (token) {
    // Выполнение запроса GraphQL с использованием токена
    fetch('http://127.0.0.1:8000/users/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Используйте токен пользователя
        },
        body: JSON.stringify({
            query: `
                        query {
                            me {
                                id
                                lastLogin
                                username
                                firstName
                                lastName
                                email
                                isStaff
                                isActive
                                dateJoined
                                modelSet {
                                    id
                                    name
                                    startDate
                                    finishDate
                                    startAmount
                                }
                                pk
                                archived
                                verified
                                secondaryEmail
                            }
                        }
                    `
        })
    })
        .then(response => response.json())
        .then(data => {
            // Обработка и вывод данных пользователя
            const user = data.data.me;
            const userData = `
                    <p>Имя пользователя: ${user.username}</p>
                    <!--Другие данные пользователя-->
                `;
            document.getElementById('userData').innerHTML = userData;

            // Обработка и вывод списка моделей
            const modelList = user.modelSet;
            const modelListElement = document.getElementById('modelList');
            modelList.forEach(model => {
                const modelBlock = document.createElement('div'); // Создаем блок для модели
                modelBlock.innerHTML = `
                        <p>${model.name}</p>
                        <p>${model.startAmount}</p>
                        <p>${model.startDate} - ${model.finishDate}</p>
                    `;

                const goToModelButton = document.createElement('button'); // Кнопка "Перейти в модель"
                goToModelButton.textContent = 'Перейти в модель';
                goToModelButton.addEventListener('click', function () {
                    window.location.href = `./model/model.html?id=${model.id}`;
                });


                const editButton = document.createElement('button'); // Кнопка "Редактировать"
                editButton.textContent = 'Редактировать';
                // Кнопка "Редактировать"
                editButton.addEventListener('click', function () {
                    const editForm = modelBlock.querySelector('.edit-form');

                    if (!editForm) {
                        // Если формы ещё нет, создаем её
                        const newEditForm = document.createElement('div');
                        newEditForm.classList.add('edit-form');

                        newEditForm.innerHTML = `
                                <input id="editModelName" required type="text" placeholder="Название" value="${model.name}"><br>
                                <input id="editModelStartAmount" required type="text" placeholder="Начальная сумма" value="${model.startAmount}"><br>
                                <input id="editModelStartDate" required type="text" placeholder="Начальная дата" value="${model.startDate}"><br>
                                <input id="editModelFinishDate" required type="text" placeholder="Дата завершения" value="${model.finishDate}"><br>
                                <button id="saveModelChanges">Сохранить</button>
                            `;

                        // Добавление формы редактирования в блок модели
                        modelBlock.appendChild(newEditForm);

                        // Обработчик события для кнопки "Сохранить"
                        const saveModelChangesButton = newEditForm.querySelector('#saveModelChanges');
                        saveModelChangesButton.addEventListener('click', function () {
                            const newName = newEditForm.querySelector('#editModelName').value;
                            const newStartAmount = newEditForm.querySelector('#editModelStartAmount').value;
                            const newStartDate = newEditForm.querySelector('#editModelStartDate').value;
                            const newFinishDate = newEditForm.querySelector('#editModelFinishDate').value;

                            // Выполнение запроса GraphQL для обновления модели
                            fetch('http://127.0.0.1:8000/finance/models', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    query: `
                                            mutation {
                                                updateModel(
                                                    finishDate: "${newFinishDate}"
                                                    modelId: "${model.id}"
                                                    name: "${newName}"
                                                    startAmount: ${newStartAmount}
                                                    startDate: "${newStartDate}"
                                                ) {
                                                    model {
                                                        id
                                                        name
                                                        startDate
                                                        finishDate
                                                        startAmount
                                                    }
                                                }
                                            }
                                        `
                                })
                            });
                            location.reload()
                        });
                    }
                });


                const deleteButton = document.createElement('button'); // Кнопка "Удалить"
                deleteButton.textContent = 'Удалить';
                deleteButton.addEventListener('click', function () {

                    const shouldDelete = window.confirm('Вы уверены, что хотите удалить модель?');

                    if (shouldDelete) {

                        fetch('http://127.0.0.1:8000/finance/models', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                query: `
                                    mutation {
                                      deleteModel(modelId: ${model.id}) {
                                        allModels {
                                          id
                                          name
                                          startDate
                                          finishDate
                                          startAmount
                                        }
                                      }
                                    }
                                    `
                            })
                        })
                        location.reload();
                    }
                });

                modelBlock.appendChild(goToModelButton);
                modelBlock.appendChild(editButton);
                modelBlock.appendChild(deleteButton);

                modelListElement.appendChild(modelBlock);
            });

        })
        .catch(error => {
            console.error(error);
        });


    // Обработчик события для кнопки "Новая модель"
    const createModelButton = document.getElementById('createModel');
    createModelButton.addEventListener('click', function () {
        const createModelForm = document.getElementById('createNewModel');
        createModelForm.style.display = 'block'; // Отображаем форму
    });

    // Обработчик события для кнопки "Сохранить"
    const createButton = document.getElementById('createButton');
    createButton.addEventListener('click', function () {
        const newModelName = document.getElementById('newModelName').value;
        const newModelAmount = document.getElementById('newModelAmount').value;
        const newModelStartDate = document.getElementById('newModelStartDate').value;
        const newModelFinishDate = document.getElementById('newModelFinishDate').value;

        // Выполнение запроса GraphQL для создания модели
        fetch('http://127.0.0.1:8000/finance/models', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: `
                    mutation {
                        createModel(
                            finishDate: "${newModelFinishDate}"
                            name: "${newModelName}"
                            startAmount: ${newModelAmount}
                            startDate: "${newModelStartDate}"
                        ) {
                            model {
                                id
                                name
                                startDate
                                finishDate
                                startAmount
                            }
                        }
                    }
                `
            })
        })
        location.reload()
    });


} else {
    document.getElementById('userData').textContent = 'Токен пользователя не найден в URL.';
}
