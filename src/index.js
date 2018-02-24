import './scss/main.scss';

import { questions } from './modules/questions.js';
import { types } from './modules/types.js';

let finalUrl = 'https://segmento.ru/survey_thankyou',
    startBtn = document.getElementById('btn-start'),
    finishBtn = document.getElementById('btn-finish'),
    startWrapper = document.querySelector('.banner__item--start'),
    questionWrapper = document.querySelector('.banner__item--question'),
    finishWrapper = document.querySelector('.banner__item--finish');

let user = {
    answers: [],
    nextQuestion: 1,
    isSettedUp: false
};



// Events
document.addEventListener('DOMContentLoaded', initUser);
startBtn.addEventListener('click', startInterview);
finishBtn.addEventListener('click', finishInterview);

/** 
 * Инициализирует пользователя. 
 * Берет данные о пользователе из localStorage,
 * если пользователь проходил опрос до этого
*/
function initUser() {
    if (isUserReturned()) {
        user = JSON.parse(localStorage.getItem('user-data'));
        user.isSettedUp = false;
        startInterview();
    } 
}

/** 
 * Проверяет проходил ли пользователь тест до этого 
 * @returns {boolean}
*/
function isUserReturned() {
    return localStorage.getItem('user-data') !== null;
}

/** 
 * Инициализирует процесс опроса
 * 
*/
function startInterview() {
    localStorage.clear();
    startWrapper.classList.add('hidden');
    questionWrapper.classList.remove('hidden');
    initQuestion(user.nextQuestion);
}

/**
 * 
 * @param {number} index Номер вопроса
 */
function initQuestion(index) {

    let answers = document.querySelectorAll('.answer__text'),
        questionLabel = document.querySelector('.question-label');

    questionLabel.innerHTML = `Вопрос ${index} из ${Object.keys(questions).length}`;
    if (!user.isSettedUp) {
        user.isSettedUp = true;
        for (let i = 0; i < answers.length; i++) {
            answers[i].innerHTML = questions[index][i + 1];
            answers[i].classList.add(`answer__text--n${i + 1}`);
            answers[i].answer = i + 1;
            answers[i].addEventListener('click', (e) => {
                user.answers.push(e.target.answer || null);
                if (user.answers.length < Object.keys(questions).length) {
                    user.nextQuestion++;
                    initQuestion(user.nextQuestion);
                } else {
                    finishInterview();
                }

            });
        }
    } else {
        for (let i = 0; i < answers.length; i++) {
            answers[i].innerHTML = questions[index][i + 1];
        }
    }
    localStorage.setItem('user-data', JSON.stringify(user));
}

/**
 * Проверяет к какому типу принадлежит пользователь,
 * в зависимости от его ответов в процессе прохождения теста
 *    
 * Реализатор
 * Если на 2 (два) и более вопроса под номерами 1, 3, 5 пользователь выбрал 2 (второй вариант ответа) + 
 * Если на 2 (два) и более вопроса под номерами 2, 4, 6 пользователь выбрал 1 (первый вариант ответа) 
 *
 * Организатор
 * Если на 2 (два) и более вопроса под номерами 1, 3, 5 пользователь выбрал 1 (первый вариант ответа) + 
 * Если на 2 (два) и более вопроса под номерами 2, 4, 6 пользователь выбрал 1 (первый вариант ответа) 
 * 
 * Мыслитель
 * Если на 2 (два) и более вопроса под номерами 1, 3, 5 пользователь выбрал 2 (второй вариант ответа) +
 * Если на 2 (два) и более вопроса под номерами 2, 4, 6 пользователь выбрал 2 (второй вариант ответа)
 * 
 * Инноватор
 * Если на 2 (два) и более вопроса под номерами 1, 3, 5 пользователь выбрал 1 (первый вариант ответа) +
 * Если на 2 (два) и более вопроса под номерами 2, 4, 6 пользователь выбрал 2 (второй вариант ответа)
 * @returns {string} [Тип пользователя]
 */
function checkUserType() {

    let answers = user.answers;

    // Вычислим сумму ответов 1, 3, 5 и 2, 4, 6
    let sum135 = answers[0] + answers[2] + answers[4];
    let sum246 = answers[1] + answers[3] + answers[5];

    /* 
        Если сумма ответов больше или равна 5 - ответ 2 выбран 2 и более раз
        Если сумма ответов меньше или равна 4 - ответ 1 выбран 2 и более раз
    */
    if (sum135 >= 5 && sum246 <= 4)
        return types.realizer;
    else if (sum135 <= 4 && sum246 <= 4)
        return types.organizer;
    else if (sum135 >= 5 && sum246 >= 5)
        return types.thinker;
    else if (sum135 <= 4 && sum246 >= 5)
        return types.innovator;
    else
        return 'Unknown';

}

/** 
 * Инициализирует процесс окончания опроса
*/
function finishInterview() {
    localStorage.clear();
    startWrapper.classList.add('hidden');
    questionWrapper.classList.add('hidden');
    finishWrapper.classList.remove('hidden');

    let userType = checkUserType();
    console.log(userType);

    //window.location.href = `${finalUrl}?sociotype=${userType}`;

}



