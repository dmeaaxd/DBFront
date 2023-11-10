document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Отправка GraphQL-запроса на сервер
    axios.post('http://127.0.0.1:8000/users/graphql', {
        query: `
            mutation {
                tokenAuth(username: "${username}", password: "${password}") {
                    success
                    token
                }
            }
        `
    })
        .then(function (response) {
            const data = response.data.data.tokenAuth;
            if (data.success) {
                // Получаем токен
                const token = data.token;

                sessionStorage.setItem('token', token);


                // Перенаправляем пользователя на страницу index.html с токеном в URL
                // window.location.href = `../index.html?token=${token}`;
                window.location.href = `../index.html`;
            } else {
                // Ошибка авторизации, отобразите сообщение об ошибке
                document.getElementById('error').textContent = 'Ошибка авторизации';
                document.getElementById('error').style.display = 'block';
            }
        })
        .catch(function (error) {
            console.error(error);
        });
});