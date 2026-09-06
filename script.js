document.addEventListener('DOMContentLoaded', () => {
    const spinBtn = document.getElementById('spinBtn');
    const wheel = document.getElementById('wheel');
    const transitionOverlay = document.getElementById('transitionOverlay');
    const starsContainer = document.getElementById('starsContainer');

    let isSpinning = false;

    const TARGET_URL = 'https://www.vkm333.com';

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

    // 创建移动端手动跳转的后备按钮（不会影响自动跳转）
    function ensureFallbackButton() {
        if (document.getElementById('redirectFallback')) return;

        const container = document.createElement('div');
        container.id = 'redirectFallback';
        // 保证在跃迁覆盖层之上显示，并在移动端容易点击
        container.style.position = 'fixed';
        container.style.bottom = '18px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '10001';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.gap = '8px';

        const hint = document.createElement('div');
        hint.textContent = '若未自动跳转，请点击下方按钮打开目标网站';
        hint.style.color = '#fff';
        hint.style.fontSize = '14px';
        hint.style.textShadow = '0 0 6px rgba(0,0,0,0.6)';
        hint.style.background = 'rgba(0,0,0,0.4)';
        hint.style.padding = '6px 10px';
        hint.style.borderRadius = '14px';

        const btn = document.createElement('button');
        btn.id = 'openExternalBtn';
        btn.textContent = '打开目标网站';
        btn.style.padding = '12px 18px';
        btn.style.borderRadius = '28px';
        btn.style.border = 'none';
        btn.style.background = 'linear-gradient(135deg, #bc13fe, #00f3ff)';
        btn.style.color = '#fff';
        btn.style.fontWeight = '700';
        btn.style.fontSize = '16px';
        btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)';

        btn.addEventListener('click', () => {
            // 手动点击是用户操作，浏览器不会拦截
            window.location.href = TARGET_URL;
        });

        container.appendChild(hint);
        container.appendChild(btn);
        document.body.appendChild(container);
    }

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

            // 在覆盖层激活时添加一个可见的手动跳转按钮（仅作为后备），
            // 不改变原有自动跳转逻辑，保证所有原功能不变
            ensureFallbackButton();
            
            // 动画播放完成后，完美跳转至指定网站（保留原逻辑）
            setTimeout(() => {
                window.location.href = TARGET_URL;
            }, 1800);
        }, 3200);
    });
});
