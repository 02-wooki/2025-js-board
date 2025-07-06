document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('login-error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = '../../index.html';
        }

        fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
            }),
        })
            .then(res => res.json())
            .then(res => {
                if (res.code === 2002) {
                    localStorage.setItem('username', username);
                    window.location.href = '../../index.html';
                    return;
                }
                if (res.code === 4011 || res.code === 4041) {
                    errorMessage.textContent = '아이디 또는 비밀번호가 일치하지 않습니다.';
                    errorMessage.classList.add('show');
                    return;
                }
                alert(res.message);
                window.location.href = '../../index.html';
            })

    });
});
