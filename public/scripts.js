document.addEventListener('DOMContentLoaded', async function() {
    const faqContainer = document.getElementById('faq-content');
    const searchInput = document.getElementById('search');

    // Функция для загрузки данных из API
    async function loadFAQ() {
        try {
            const response = await fetch('http://94.323.244.190:3306/faq');
            const faqData = await response.json();
            renderFAQ(faqData);
        } catch (error) {
            console.error('Ошибка при загрузке FAQ:', error);
            faqContainer.innerHTML = `<p>Ошибка при загрузке данных. Попробуйте позже.</p>`;
        }
    }

    // Функция для рендеринга FAQ
    function renderFAQ(data) {
        faqContainer.innerHTML = '';
        if (data.length === 0) {
            faqContainer.innerHTML = `<p class="no-results">Ничего не найдено.</p>`;
            return;
        }

        data.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('faq-category');
            
            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category.category;
            categoryDiv.appendChild(categoryTitle);

            category.questions.forEach(item => {
                const faqItemDiv = document.createElement('div');
                faqItemDiv.classList.add('faq-item');

                const questionButton = document.createElement('button');
                questionButton.classList.add('faq-question');
                questionButton.textContent = item.question;
                
                const answerDiv = document.createElement('div');
                answerDiv.classList.add('faq-answer');
                answerDiv.textContent = item.answer;

                faqItemDiv.appendChild(questionButton);
                faqItemDiv.appendChild(answerDiv);
                categoryDiv.appendChild(faqItemDiv);
            });
            faqContainer.appendChild(categoryDiv);
        });
        attachEventListeners();
    }

    // Функция для обработки кликов на вопросы
    function attachEventListeners() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            questionButton.addEventListener('click', () => {
                answer.style.display = (answer.style.display === 'block') ? 'none' : 'block';
                questionButton.classList.toggle('active');
            });
        });

        searchInput.addEventListener('input', (e) => {
            searchFAQ(e.target.value);
        });
    }

    // Функция для фильтрации FAQ по поисковому запросу
    function searchFAQ(query) {
        const faqCategories = document.querySelectorAll('.faq-category');
        faqCategories.forEach(category => {
            const questions = category.querySelectorAll('.faq-item');
            let hasMatch = false;
            questions.forEach(question => {
                const questionText = question.querySelector('.faq-question').textContent.toLowerCase();
                if (questionText.includes(query.toLowerCase())) {
                    question.style.display = 'block';
                    hasMatch = true;
                } else {
                    question.style.display = 'none';
                }
            });
            category.style.display = hasMatch ? 'block' : 'none';
        });
    }

    // Загрузка данных при запуске
    loadFAQ();
});
