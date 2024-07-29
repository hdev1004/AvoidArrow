document.getElementById('start-game').addEventListener('click', () => {
    const nickname = document.getElementById('nickname').value;
    if (nickname) {
        localStorage.setItem('nickname', nickname); // 닉네임 저장
        document.getElementById('nickname-input').style.display = 'none';
        const canvas = document.querySelector('.canvas');
        canvas.style.display = 'block';

        // 캔버스 초기화 및 게임 시작을 위한 App.js 로드
        const script = document.createElement('script');
        script.type = 'module';
        script.src = './App.js';
        document.body.appendChild(script);
    } else {
        alert('닉네임을 입력해주세요.');
    }
});