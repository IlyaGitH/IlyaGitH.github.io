// 1. Инициализация плавного скролла
const lenis = new Lenis({
    lerp: 0.08,
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Логика курсора-прицела
const cursor = document.querySelector('.cursor-crosshair');
// Проверка на существование курсора (для мобильных где он может быть скрыт)
if (cursor) {
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
    });
    document.addEventListener('mouseup', () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });
}

// 3. GSAP Анимации
gsap.registerPlugin(ScrollTrigger);

// Появление заголовка
gsap.from(".hero-title .reveal", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
});

// Анимация карточек преимуществ (Главная)
const features = document.querySelector('.features');
if (features) {
    // Сначала делаем элементы видимыми на случай, если JS сломается
    gsap.set(".feature-card", { opacity: 1 }); 
    
    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: ".features",
            start: "top bottom", // Запуск сразу при появлении на экране
            toggleActions: "play none none reverse" // Проигрывать при появлении
        },
        y: 50, // Выезжают снизу на 50px
        opacity: 0, // Начальная прозрачность (GSAP сам скроет их перед стартом)
        duration: 0.8,
        stagger: 0.2, // Задержка между карточками
        ease: "power2.out",
        clearProps: "all" // После анимации очистить стили, чтобы не мешать CSS
    });
}

// Анимация списка услуг
const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach((item) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 90%", // Срабатывает, когда элемент чуть показался
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Анимация для страницы Оборудования
const equipCards = document.querySelectorAll('.equip-card');
if(equipCards.length > 0) {
    equipCards.forEach((card) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });
}

// Анимация формы контактов
const contactForm = document.querySelector('.tech-form');
if(contactForm) {
    gsap.from(".contact-info", {
        scrollTrigger: { trigger: ".contact-section", start: "top 80%" },
        x: -50, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out"
    });
    gsap.from(contactForm, {
        scrollTrigger: { trigger: ".contact-section", start: "top 80%" },
        x: 50, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out"
    });
}

// !!! ВАЖНОЕ ИСПРАВЛЕНИЕ !!!
// Обновляем ScrollTrigger после полной загрузки страницы (картинок),
// чтобы блоки не исчезали и появлялись в правильных местах.
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});