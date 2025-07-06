document.addEventListener('DOMContentLoaded', () => {
    // 상태 관리
    const username = localStorage.getItem('username');
    let post;

    // DOM 요소
    const pageTitle = document.querySelector('.board-title');
    const postList = document.querySelector('.post-list');
    const loginLogoutBtn = document.getElementById('login-logout-btn');
    const withdrawalBtn = document.getElementById('withdrawal-btn');
    const signupLink = document.getElementById('signup-link');
    const newPostBtn = document.getElementById('new-post-btn');
    const statusMessage = document.getElementById('status-message');

    withdrawalBtn.addEventListener('click', () => {
        const pwConfirm = prompt('정말 탈퇴하려면 비밀번호를 입력하세요.');

        if (!pwConfirm)
            return;

        fetch('http://localhost:8080/auth/withdrawal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': username,
            },
            body: JSON.stringify({
                "password": pwConfirm,
            }),
        })
            .then(res => res.json())
            .then(res => {
                if (res.code === 2003) {
                    localStorage.removeItem('username');
                    document.location.reload();
                    return;
                }
                if (res.code === 4011) {
                    alert('비밀번호가 일치하지 않습니다. 다시 시도하세요.');
                    return;
                }
                alert(res.message);
            })
    })

    // 헤더 업데이트
    function updateHeader() {
        if (username) {
            pageTitle.innerText = username;

            loginLogoutBtn.textContent = '로그아웃';
            loginLogoutBtn.href = '#'; // 로그아웃은 현재 페이지에서 처리
            signupLink.style.display = 'none';
            newPostBtn.style.display = 'inline-block';

            loginLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('username');
                window.location.reload(); // 페이지를 새로고침하여 로그아웃 상태 반영
            });
        } else {
            pageTitle.innerText = '게시판';

            loginLogoutBtn.textContent = '로그인';
            loginLogoutBtn.href = 'pages/login/login.html';
            signupLink.style.display = 'inline';
            newPostBtn.style.display = 'none'; // 로그인하지 않으면 새 글 작성 버튼 숨김
            withdrawalBtn.style.display = 'none';
        }
    }

    //게시글 데이터 가져오기
    async function getPosts() {
        await fetch('http://localhost:8080/post', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.code === 2102) {
                    post = res.data;
                    return;
                }
                alert(res.message);
            });
    }

    // 게시글 목록 렌더링
    function renderPosts() {
        postList.innerHTML = '';

        if (!post || !post.length) {
            statusMessage.textContent = '등록된 게시글이 없습니다.';
            return;
        } else {
            statusMessage.style.display = 'none';
        }

        // 최신 글이 위로 오도록 createdAt 기준으로 정렬
        post.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        post.forEach(p => {
            const li = document.createElement('li');

            // createdAt 날짜 포맷팅 (YYYY.MM.DD HH:mm)
            const datetime = new Date(p.createdAt);
            const year = datetime.getFullYear();
            const month = String(datetime.getMonth() + 1).padStart(2, '0');
            const day = String(datetime.getDate()).padStart(2, '0');
            const hours = String(datetime.getHours()).padStart(2, '0');
            const minutes = String(datetime.getMinutes()).padStart(2, '0');
            const formattedDate = `${year}.${month}.${day} ${hours}:${minutes}`;

            li.innerHTML = `
                <span class="post-author">${p.author.username}</span>
                <span class="post-title">${p.title}</span>
                <span class="post-date">${formattedDate}</span>
            `;
            li.dataset.postId = p.id;
            li.addEventListener('click', () => {
                window.location.href = `pages/post/post.html?id=${p.id}`;
            });
            postList.appendChild(li);
        });
    }

    // 초기화
    async function init() {
        updateHeader();
        await getPosts();
        renderPosts();
    }

    init();
});
