document.addEventListener('DOMContentLoaded', () => {
    const writeForm = document.getElementById('write-form');
    const cancelBtn = document.getElementById('cancel-btn');

    // 저장 버튼 클릭 시
    writeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = e.target['post-title'].value;
        const content = e.target['post-content'].value;
        const author = localStorage.getItem('username');

        fetch('http://localhost:8080/post/write', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': author
            },
            body: JSON.stringify({
                'title': title,
                'content': content,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.code === 2101) {
                    window.location.href = `post.html?id=${res.data}`;
                    return;
                }

                alert(res.message);
                window.location.href = `index.html`;
            })
    });

    // 취소 버튼 클릭 시
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
