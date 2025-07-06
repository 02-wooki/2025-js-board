document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('signup-error-message');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const confirmPassword = e.target['confirm-password'].value;

        if (username === 'admin') {
            errorMessage.textContent = '해당 id는 사용할 수 없습니다.';
            errorMessage.classList.add('show');
            return;
        }

        if (password !== confirmPassword) {
            errorMessage.textContent = '비밀번호가 일치하지 않습니다.';
            errorMessage.classList.add('show');
            return;
        }

        fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.code === 2001) {
                    window.location.href = '../login/login.html';
                    return;
                }
                errorMessage.textContent = '이미 존재하는 아이디입니다.';
                errorMessage.classList.add('show');
            })
            .catch(error => {
                // JSON 파싱 실패 또는 네트워크 오류 등
                console.error('Signup request failed:', error);
                errorMessage.textContent = '서버와 통신에 실패했습니다. 잠시 후 다시 시도해주세요.';
                errorMessage.classList.add('show');
            })
    });

    // 사용자가 입력을 시작하면 에러 메시지 숨기기
    signupForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            if (errorMessage.classList.contains('show')) {
                errorMessage.classList.remove('show');
            }
        });
    });
});