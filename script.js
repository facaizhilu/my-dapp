document.addEventListener('DOMContentLoaded', () => {
    const spinBtn = document.getElementById('spinBtn');
    const wheel = document.getElementById('wheel');
    const transitionOverlay = document.getElementById('transitionOverlay');
    const starsContainer = document.getElementById('starsContainer');

    let isSpinning = false;

    // 动态生成星际穿越的星星粒子
    function createStars() {
        const starCount = 80;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // 随机初始位置和大小
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            star.style.left = `calc(50% + ${x}px)`;
            star.style.top = `calc(50% + ${y}px)`;
            
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // 随机动画时长和延迟，制造深空跃迁错落感
            const duration = Math.random() * 0.6 + 0.4;
            const delay = Math.random() * 0.5;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(star);
        }
    }

    createStars();

    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;

        spinBtn.style.opacity = '0.7';
        spinBtn.style.pointerEvents = 'none';

        // 随机旋转多圈并停在特定角度
        const randomDegree = Math.floor(Math.random() * 360) + 1800; // 至少转5圈
        wheel.style.transform = `rotate(${randomDegree}deg)`;

        // 转盘旋转的同时，触发星际穿越跃迁动画
        setTimeout(() => {
            transitionOverlay.classList.add('active');
            
            // 动画播放完成后，完美跳转至指定网站
            setTimeout(() => {
                window.location.href = 'https://www.vkm333.com';
            }, 1800);
        }, 3200);
    });
});
