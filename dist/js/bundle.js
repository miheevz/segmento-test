/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

__webpack_require__(2);

var _questions = __webpack_require__(3);

var _types = __webpack_require__(4);

var finalUrl = 'https://segmento.ru/survey_thankyou',
    bannerWrapper = document.querySelector('.banner'),
    startBtn = document.getElementById('btn-start'),
    finishBtn = document.getElementById('btn-finish'),
    startWrapper = document.querySelector('.banner__item--start'),
    questionWrapper = document.querySelector('.banner__item--question'),
    finishWrapper = document.querySelector('.banner__item--finish');

var user = {
    answers: [],
    nextQuestion: 1,
    isSettedUp: false
};

// Events
document.addEventListener('DOMContentLoaded', initUser);
startBtn.addEventListener('click', startInterview);
finishBtn.addEventListener('click', learnMore);

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
    bannerWrapper.classList.add('banner--no-image');
    startWrapper.classList.add('hidden');
    questionWrapper.classList.remove('hidden');
    initQuestion(user.nextQuestion);
}

/**
 * Инициализирует вопрос
 * 
 * @param {number} index Номер вопроса
 */
function initQuestion(index) {

    var answers = document.querySelectorAll('.answer__text'),
        questionLabel = document.querySelector('.question-label');

    questionLabel.innerHTML = '\u0412\u043E\u043F\u0440\u043E\u0441 ' + index + ' \u0438\u0437 ' + Object.keys(_questions.questions).length;
    if (!user.isSettedUp) {
        user.isSettedUp = true;
        for (var i = 0; i < answers.length; i++) {
            answers[i].innerHTML = _questions.questions[index][i + 1];
            answers[i].classList.add('answer__text--n' + (i + 1));
            answers[i].answer = i + 1;
            answers[i].addEventListener('click', function (e) {
                user.answers.push(e.target.answer || null);
                if (user.answers.length < Object.keys(_questions.questions).length) {
                    user.nextQuestion++;
                    initQuestion(user.nextQuestion);
                } else {
                    finishInterview();
                }
            });
        }
    } else {
        for (var _i = 0; _i < answers.length; _i++) {
            answers[_i].innerHTML = _questions.questions[index][_i + 1];
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

    var answers = user.answers;

    // Вычислим сумму ответов 1, 3, 5 и 2, 4, 6
    var sum135 = answers[0] + answers[2] + answers[4];
    var sum246 = answers[1] + answers[3] + answers[5];

    /* 
        Если сумма ответов больше или равна 5 - ответ 2 выбран 2 и более раз
        Если сумма ответов меньше или равна 4 - ответ 1 выбран 2 и более раз
    */
    if (sum135 >= 5 && sum246 <= 4) return _types.types.realizer;else if (sum135 <= 4 && sum246 <= 4) return _types.types.organizer;else if (sum135 >= 5 && sum246 >= 5) return _types.types.thinker;else if (sum135 <= 4 && sum246 >= 5) return _types.types.innovator;else return 'Unknown';
}

/** 
 * Инициализирует процесс окончания опроса
*/
function finishInterview() {
    localStorage.clear();
    bannerWrapper.classList.remove('banner--no-image');
    startWrapper.classList.add('hidden');
    questionWrapper.classList.add('hidden');
    finishWrapper.classList.remove('hidden');

    var userType = checkUserType();
    document.querySelector('.banner__user-type').innerHTML = userType;
}

/**
 * Переводит пользователя на страницу с благодарностями
 */
function learnMore() {
    var userType = Object.keys(_types.types).find(function (key) {
        return _types.types[key] === checkUserType();
    });
    window.location.href = finalUrl + '?sociotype=' + userType;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {

            if (this == null) {
                throw new TypeError('this is null or not defined');
            }

            var obj = Object(this);
            var len = obj.length >>> 0;

            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            var thisArg = arguments[1];

            var index = 0;

            while (index < len) {
                var iValue = obj[index];
                if (predicate.call(thisArg, iValue, index, obj)) {
                    return iValue;
                }
                index++;
            }

            return undefined;
        }
    });
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var questions = exports.questions = {
    1: {
        1: 'Обычно я знаю, как уговорить или попросить человека что-либо сделать.',
        2: 'Я предпочитаю убеждать человека силой логических доводов.'
    },
    2: {
        1: 'Случается, что я сначала прихожу к какому-либо умозаключению, а уж потом обосновываю его.',
        2: 'Важные вопросы стараюсь решать последовательно и планомерно.'
    },
    3: {
        1: 'У меня много друзей и еще больше знакомых. Я легко завожу новые знакомства.',
        2: 'Я очень избирателен в общении. Редко кому могу рассказать о своих переживаниях.'
    },
    4: {
        1: 'Люблю работать быстро, не раздумывая по пустякам.',
        2: 'Стараюсь обдумывать всю получаемую информацию.'
    },
    5: {
        1: 'В непредсказуемых обстоятельствах я чувствую себя немного неуверенно и скованно.',
        2: 'Нестандартная ситуация активизирует меня.'
    },
    6: {
        1: 'К своей цели иду последовательно, руководствуясь планом.',
        2: 'Предпочитаю не «идти в гору», а обходить ее и не лезть напролом в достижении цели.'
    }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var types = exports.types = {
    realizer: 'Реализатор',
    organizer: 'Организатор',
    thinker: 'Мыслитель',
    innovator: 'Инноватор'
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map