document.addEventListener('DOMContentLoaded', function() {
    const background = document.getElementById('background');
    const blocks = document.querySelectorAll('.block');
    const text = "FlineZet";
    const typingElement = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    let i = 0;
    const speed = 170;
 
    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent = text.substring(0, i+1);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            cursor.style.opacity = '1';
        }
    }

    function checkBlocksVisibility() {
        const windowHeight = window.innerHeight;
        const trigger = 100;

        blocks.forEach(block => {
            const blockPosition = block.getBoundingClientRect().top;
        
            if (blockPosition < windowHeight - trigger) {
                block.style.opacity = "1";
                block.style.transition = "transform 0.5s, opacity 1s";
            }
        });
    }
 
    function createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            background.appendChild(particle);
        }
    }
    
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            background-color: rgba(108, 92, 231, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float linear infinite;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 1;
            }
            50% {
                transform: translateY(-100px) translateX(50px);
                opacity: 0.5;
            }
            100% {
                transform: translateY(-200px) translateX(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    createParticles();
    checkBlocksVisibility();
    typeWriter();

    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'var(--shadow)';
        });
    });

    window.addEventListener('scroll', function() {
        checkBlocksVisibility();
    });
});