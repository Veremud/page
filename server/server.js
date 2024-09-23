const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Подключение к MySQL базе данных
const db = mysql.createConnection({
    host: '94.323.244.190:3306',
    user: 'marzban', // ваш пользователь MySQL
    password: 'super-password', // ваш пароль MySQL
    database: 'marzban' // название вашей базы данных
});

// Проверка подключения
db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к MySQL:', err);
        return;
    }
    console.log('Подключено к MySQL');
});

// API для получения всех FAQ
app.get('/faq', (req, res) => {
    const query = `
        SELECT categories.category_name, questions.question_text, questions.answer_text
        FROM categories
        JOIN questions ON categories.id = questions.category_id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(500).json({ message: 'Ошибка сервера' });
            return;
        }

        // Преобразование данных в формат, удобный для фронтенда
        const faqData = results.reduce((acc, row) => {
            const categoryIndex = acc.findIndex(cat => cat.category === row.category_name);

            if (categoryIndex === -1) {
                acc.push({
                    category: row.category_name,
                    questions: [{
                        question: row.question_text,
                        answer: row.answer_text
                    }]
                });
            } else {
                acc[categoryIndex].questions.push({
                    question: row.question_text,
                    answer: row.answer_text
                });
            }
            return acc;
        }, []);

        res.json(faqData);
    });
});

// Отдача статики (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
