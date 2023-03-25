const output = document.querySelector('.calc-screen p');
const shifters = document.getElementsByClassName('shifter');

const operators = ['+', '−', '×', '÷', '%', '!', 'E', '^', '_√'];
const otherOperators = ['(', ')', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'log', '√', 'Ans'];

let inverse = false;
let angle_unit_iverse = false;
let answer = 0;

let book = ['0'];



function getLast() {
    return book[book.length-1];
}
function changeLast(value) {
    book[book.length-1] = value;
}
function extendLast(value) {
    book[book.length-1] += value;
}



function reverseString(str) {
    return str.split("").reverse().join("");
}



function showResults() {
    console.log('Results:')
    console.log(output);
    console.log(book);
}



function displayCorrectly() {
    for (let k = 0; k < 3; k++) {
        if (k == 1) {
            output.textContent = book.join('');
            continue;
        }

        book.reverse();
        for (let i = 0; i < book.length; i++) {
            book[i] = reverseString(book[i]);

            if (book[i] == '(') {
                book[i] = ')';
            } else if (book[i] == ')') {
                book[i] = '(';
            }
        }
    }
}



function definePercent(index) {
    if (book[index-2] == '+' || book[index-2] == '-') {
        
        if (book[index-2] == '+') {
            book[index-1] = '(1 + ' + book[index-1] + ' / 100)';
        } else {
            book[index-1] = '(1 - ' + book[index-1] + ' / 100)';
        }

        book[index-2] = '*'
    } else {
        book[index-1] = '(' + book[index-1] + ' / 100)';
    }

    book[index] = '';
}



function defineOperator(operator) {
    switch(operator) {
        case 'xy':
            operator = '^';
            break;
        case 'EXP':
            operator = 'E';
            break;
        case 'x!':
            operator = '!';
            break;
        case 'sin-1':
            operator = 'a' + operator.slice(0, 3);
            break;
        case 'cos-1':
            operator = 'a' + operator.slice(0, 3);
            break;
        case 'tan-1':
            operator = 'a' + operator.slice(0, 3);
            break;
        case 'y√x':
            operator = '_√';
            break;

        case 'ex':
            if (getLast() == '0') {
                changeLast('e');
            } else {
                book.push('e');
            }
            operator = '^';
            break;
        case '10x':
            if (getLast() == '0') {
                changeLast('10');
            } else {
                book.push('10');
            }
            operator = '^';
            break;
        case 'x2':
            book.push('^', '2');
            operator = '';
            break;
    }

    return operator;
}



function factorial(number) {
    if (number == 0 || number == 1) {
        return 1;
    } else {
        let a = 1;
        while (number != 1) {
            a *= number;
            number--;

            if (number < 0) break;
        }
        return a;
    }
}



function changeAngleUnit(index, isArc) {
    if (angle_unit_iverse) {
        if (isArc) {
            book[index] = '180/Math.PI*' + book[index];
        }
        else {
            book[index+1] = book[index+1] + 'Math.PI/180*';
        }
    }
}



function write(word) {
    document.querySelector('.clear').innerHTML = 'CE';

    word = defineOperator(word);

    if (operators.includes(word)) {
        if (operators.includes(getLast())) {
            
            if (getLast() == '^' && word == '−') {
                book.push('');
            } else {
                if ((getLast() == '!' || getLast() == '%') && word != '!' && word != '%') {
                    book.push('');
                } else {
                    changeLast('0');
                }
            }

        } else {
            
            if (getLast() == '0' && book.length == 1 && word == '−') {
                changeLast('0');
            }
            else {
                book.push('');
            }

	    }
    }

    if (otherOperators.includes(word)) {
        if (getLast() == '0') {
            changeLast('0');
        } else {
            book.push('');
        }
    }

    if (operators.includes(getLast()) || otherOperators.includes(getLast())) {
        book.push('');
    }

    if (word == '.' && getLast().includes('.')) return;

    if (getLast() == '0' && word != '.') {
        changeLast(word);
    } else {
        extendLast(word);
    }

    displayCorrectly();
}



function clear () {
    if (document.querySelector('.clear').textContent == 'CA') {
        document.querySelector('.clear').innerHTML = 'CE';
        book = ['0'];
    }

    if (getLast().length == 1) {
        book.pop();
    } else {
        if (otherOperators.includes(getLast())) {
            book.pop();
        } else {
            changeLast(getLast().slice(0, -1));
        }
    }

    if (book.length == 0) {
        book = ['0'];
    }
    
    displayCorrectly();
}



function equal () {
    document.querySelector('.clear').innerHTML = 'CA';

    understand();
    answer = eval(book.join(''));
    book = [answer.toString()];

    displayCorrectly();
}



function understand () {
    for (let i = 0; i < book.length; i++) {
        switch (book[i]) {
            case '−':
                book[i] = '-';
                break;
            case '×':
                book[i] = '*';
                break;
            case '÷':
                book[i] = '/';
                break;
            case 'π':
                book[i] = Math.PI.toString();
                break;
            case 'e':
                book[i] = Math.E.toString();
                break; 
            case 'Ans':
                book[i] = 'answer';
                break;
            case 'sin':
                book[i] = 'Math.sin';
                changeAngleUnit(i, false);
                break;
            case 'cos':
                book[i] = 'Math.cos'; 
                changeAngleUnit(i, false);
                break;
            case 'tan':
                book[i] = 'Math.tan';
                changeAngleUnit(i, false);
                break;
            case 'asin':
                book[i] = 'Math.asin';
                changeAngleUnit(i, true);
                break;
            case 'acos':
                book[i] = 'Math.acos';
                changeAngleUnit(i, true);
                break;
            case 'atan':
                book[i] = 'Math.atan';
                changeAngleUnit(i, true);
                break;
            case '√':
                book[i] = 'Math.sqrt';
                break;
            case '!':
                book[i-1] = 'factorial(' + book[i-1] + ')';
                book[i] = '';
                break;
            case 'ln':
                book[i] = 'Math.log';
                break;
            case 'log':
                book[i] = 'Math.log10';
                break;
            case '%':
                definePercent(i);
                break;
            case '^':
                book[i] = '**';
                break;
            case '_√': //3_√(8)
                book[i] = 'Math.pow';
                book[i+2] += ', 1 / ' + book[i-1];
                book[i-1]= '';
                break;
        }
    }

    console.log('here is... ' + book);
}



function invert() {
    if (!inverse) {
        inverse = true;
        document.querySelector('.sin').innerHTML = 'sin<sup>-1</sup>';
        document.querySelector('.cos').innerHTML = 'cos<sup>-1</sup>';
        document.querySelector('.tan').innerHTML = 'tan<sup>-1</sup>';

        document.querySelector('.ln').innerHTML = 'e<sup>x</sup>';
        document.querySelector('.log').innerHTML = '10<sup>x</sup>';
        document.querySelector('.sqrt').innerHTML = 'x<sup>2</sup>';
        document.querySelector('.pow').innerHTML = '<sup>y</sup>&radic;x';

        for (let i = 0; i < 6; i++) {
            shifters[i].style = 'line-height: 30px';
        }
    }
    else {
        inverse = false;
        document.querySelector('.sin').innerHTML = 'sin';
        document.querySelector('.sin').style = 'line-height: 40px';
        document.querySelector('.cos').innerHTML = 'cos';
        document.querySelector('.tan').innerHTML = 'tan';

        document.querySelector('.ln').innerHTML = 'ln';
        document.querySelector('.log').innerHTML = 'log';
        document.querySelector('.sqrt').innerHTML = '&radic;';
        document.querySelector('.pow').innerHTML = 'x<sup>y</sup>';

        for (let i = 0; i < 6; i++) {
            shifters[i].style = 'line-height: 40px';
        }
    }
}



document.querySelector('.raddeg') .onclick = (event) => {
    if (angle_unit_iverse) {
        angle_unit_iverse = false;
        document.querySelector('.rad').style = 'color: #fff';
        document.querySelector('.deg').style = 'color: rgb(150, 150, 150)';

    } else {
        angle_unit_iverse = true;
        document.querySelector('.rad').style = 'color: rgb(150, 150, 150)';
        document.querySelector('.deg').style = 'color: #fff';
    }
}
document.querySelector('.buttons').onclick = (event) => {
    // Нажата не кнопка
    if (!event.target.classList.contains('btn')) return;

    // Получаем нажатую кнопку
    const key = event.target.textContent;

    switch (key) {
        case 'Inv':
            invert();
            break;
        case 'CE':
            clear();
            break;
        case 'CA':
            clear();
            break;
        case '=':
            equal();
            break;
        case '\n                Rad\n                |\n                Deg\n            ':
            break;
        default:
            write(key);
            break;
    }

    showResults();
}