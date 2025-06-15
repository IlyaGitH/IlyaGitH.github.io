document.addEventListener('DOMContentLoaded', function() {

    const cards = document.querySelectorAll('.grid-card, .profession-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    const moreBtns = document.querySelectorAll('.more-btn');
    moreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const details = this.closest('.profession-card').querySelector('.profession-details');
            details.style.display = 'block';
            details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });

    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.profession-details').style.display = 'none';
        });
    });

    const quizBtn = document.getElementById('quiz-btn');
    if (quizBtn) {
        quizBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Тест на профориентацию будет доступен в ближайшее время!');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    if (document.getElementById('region-filter')) {
        const regionFilter = document.getElementById('region-filter');
        const typeFilter = document.getElementById('type-filter');
        const universityCards = document.querySelectorAll('.university-card');
        
        function filterUniversities() {
            const regionValue = regionFilter.value;
            const typeValue = typeFilter.value;
            
            universityCards.forEach(card => {
                const cardRegion = card.dataset.region || 'all';
                const cardType = card.dataset.type || 'all';
                
                const regionMatch = regionValue === 'all' || cardRegion === regionValue;
                const typeMatch = typeValue === 'all' || cardType === typeValue;
                
                if (regionMatch && typeMatch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        regionFilter.addEventListener('change', filterUniversities);
        typeFilter.addEventListener('change', filterUniversities);
    }
    
    const eventBtns = document.querySelectorAll('.event-btn');
    eventBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('h3').textContent;
            const eventDate = eventCard.querySelector('.day').textContent + ' ' + 
                             eventCard.querySelector('.month').textContent;
            const eventTime = eventCard.querySelector('.event-time').textContent;
            const eventLocation = eventCard.querySelector('.event-location').textContent;
            
            const modalHtml = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <h2>${eventTitle}</h2>
                        <p><strong>Дата:</strong> ${eventDate}</p>
                        <p><strong>Время:</strong> ${eventTime}</p>
                        <p><strong>Место:</strong> ${eventLocation}</p>
                        <button class="modal-close">Закрыть</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            document.querySelector('.modal-close').addEventListener('click', function() {
                document.querySelector('.modal-overlay').remove();
            });
        });
    });

if (document.getElementById('type-filter')) {
    const typeFilter = document.getElementById('type-filter');
    const dateFilter = document.getElementById('date-filter');
    const competitionCards = document.querySelectorAll('.competition-card');
    
    function filterCompetitions() {
        const typeValue = typeFilter.value;
        const dateValue = dateFilter.value;
        
        competitionCards.forEach(card => {
            const cardType = card.querySelector('.competition-type').classList.contains(typeValue) || typeValue === 'all';
            const cardDate = card.dataset.date || 'all';
            
            const dateMatch = dateValue === 'all' || checkDateRange(cardDate, dateValue);
            
            if (typeValue === 'all' && dateValue === 'all') {
                card.style.display = 'block';
            } else if (cardType && dateMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function checkDateRange(date, range) {
        return true;
    }
    
    typeFilter.addEventListener('change', filterCompetitions);
    dateFilter.addEventListener('change', filterCompetitions);
}
});