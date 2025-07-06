import localDateTimeToString from '../../global/LocalDateTimeToString.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postId = new URLSearchParams(window.location.search).get('id');
    const username = localStorage.getItem('username');
    let post;
    let member;

    // DOM 요소
    const postTitle = document.getElementById('post-detail-title');
    const postAuthor = document.getElementById('post-detail-author');
    const postDate = document.getElementById('post-detail-date');
    const postContent = document.getElementById('post-detail-content');
    const backToListBtn = document.getElementById('back-to-list-btn');

    const commentsList = document.getElementById('comments-list');
    const commentFormContainer = document.getElementById('comment-form-container');
    const commentForm = document.getElementById('comment-form');
    const commentContentInput = document.getElementById('comment-content');

    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('username');

    // getPost API
    await fetch(`http://localhost:8080/post/${postId}`)
        .then(res => res.json())
        .then(res => {
            if (res.code === 2103) {
                post = res.data;
                member = res.data.author;
                return;
            }

            alert(res.message);
            window.location.href = '../../index.html';
        })

    if (post) {
        postTitle.textContent = post.title;
        postAuthor.textContent = member.username;
        postContent.textContent = post.content;
        postDate.textContent = localDateTimeToString(post.createdAt);


        // 댓글 작성 폼 표시 여부 제어
        if (isLoggedIn) {
            commentFormContainer.style.display = 'block';
        } else {
            commentFormContainer.style.display = 'none';
        }

        renderComments(post.comments);

    } else {
        postTitle.textContent = '게시글을 찾을 수 없습니다.';
        postAuthor.textContent = '';
        postDate.textContent = '';
        postContent.textContent = '';
        commentFormContainer.style.display = 'none'; // 게시글 없으면 댓글 폼도 숨김
    }

    // 댓글 렌더링 함수
    function renderComments(comments) {
        commentsList.innerHTML = '';
        if (comments.length === 0) {
            commentsList.innerHTML = '<p style="text-align: center; color: #777;">아직 댓글이 없습니다.</p>';
            return;
        }
        comments.forEach(comment => {
            const username = comment.author.username;
            const date = localDateTimeToString(comment.createdAt);
            const li = document.createElement('li');
            li.classList.add('comment-item');
            li.innerHTML = `
                <p class="comment-meta"><span class="comment-author">${username}</span> | ${date}</p>
                <p class="comment-content">${comment.content}</p>
            `;
            commentsList.appendChild(li);
        });
    }

    // 댓글 작성 폼 제출 이벤트
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('로그인 후 댓글을 작성할 수 있습니다.');
            return;
        }

        const commentContent = commentContentInput.value.trim();

        fetch(`http://localhost:8080/comment/write`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': username,
            },
            body: JSON.stringify({
                postId: postId,
                content: commentContent,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.code === 2201) {
                    window.location.reload();
                    return;
                }
                alert(res.message);
            })

        // 폼 초기화
        commentContentInput.value = '';
    });

    backToListBtn.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });
});