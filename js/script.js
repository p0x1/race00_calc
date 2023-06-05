let textArea = document.querySelector('.input');
let numbers = document.querySelectorAll('.number');
let resultField = document.querySelector('.result');
const operatorsArr = /[+\-!√^%/*∛±]+/g;
let input=[];
let operators= [];
let memory = 0;
let lastSymbol = 'g';
let resultString = '';
let menuVisible = false;
let addDot = true;
let is_solution = false;
let lengths = ['cm', 'm', 'km'];
let area = ['cm^2', 'm^2', 'km^2'];
let weights = ['gr', 'kg', 't'];
let from = undefined;
let to = undefined;
let currentConversion = undefined;
let numberForConversion = 0;

for (let i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener('click',(e=>{
        if(textArea.textContent === '0' && numbers[i].getAttribute('value') !== '.' && numbers[i].getAttribute('value') !== '000')
            textArea.textContent = '';
        if(is_solution === true && numbers[i].getAttribute('value') !== '000'){
            textArea.textContent = '';
            is_solution = false;
        }
        if(addDot === true && textArea.textContent.length !== 0 && numbers[i].getAttribute('value') === '.' && !lastSymbol.match(operatorsArr)){
            textArea.append(numbers[i].getAttribute('value'));
            lastSymbol = String(numbers[i].getAttribute('value'));
            addDot = false;
        }
        else if(numbers[i].getAttribute('value') === '000' && (lastSymbol.match(/\d+/g) || lastSymbol === '.')){
            textArea.append(numbers[i].getAttribute('value'));
            lastSymbol = String(numbers[i].getAttribute('value'));
        }
        else if(numbers[i].getAttribute('value') !== '.' && numbers[i].getAttribute('value') !== '000'){
            if(numbers[i].getAttribute('value') === 'π' && addDot === true){
                textArea.append('3.1415');
                addDot = false;
                lastSymbol = '5';
            }
            else if(numbers[i].getAttribute('value') !== 'π'){
                textArea.append(numbers[i].getAttribute('value'));
                lastSymbol = String(numbers[i].getAttribute('value'));
            }
        }
    }));
}
function clearLast(){
    if(textArea.textContent !== '0' && !menuVisible){
        if(textArea.textContent[textArea.textContent.length-1].match(operatorsArr))
            operators.splice(operators.length-1,1);

        textArea.textContent = textArea.textContent.substring(0, textArea.textContent.length - 1) ;
        lastSymbol = textArea.textContent[textArea.textContent.length-1];
        if(textArea.textContent.length === 0)
            textArea.textContent = '0';
    }
}
function clearTextArea(){
    numberForConversion = 0;
    from = undefined;
    to = undefined;
    currentConversion = undefined;
    is_solution = false;
    addDot = true;
    operators = [];
    input = [];
    addDot = true;
    textArea.textContent = '0';
    resultField.textContent = '0';
    lastSymbol = 'g';
}

function addOperator(operator){
    if(menuVisible) return;
    addDot=true;
    let ahon = false;
    if(textArea.textContent === '0' && (operator === '-' || operator === '√' || operator === '∛')){
        textArea.textContent = '';
        textArea.append(operator);
        if(operator === '√' || operator === '∛')
            operators.push(operator);
        lastSymbol = operator;
        is_solution = false;
    }
    else if((operator === '√' || operator === '∛')&& textArea.textContent.length === 1 && textArea.textContent === '0'){
        textArea.textContent = '';
        textArea.append(operator);
        operators.push(operator);
        lastSymbol = operator;
        is_solution = false;
    }
    else if(operator === '√' || operator === '∛'){
       if(!lastSymbol.match(/[+-/*]/g))
            return;
       if(is_solution === true){
           textArea.textContent = '';
           is_solution = false;
       }
       operators.push(operator);
       textArea.append(operator);
       lastSymbol = operator;
       is_solution = false;
    }
    else if(operator === '-' && is_solution === true){
        textArea.append(operator);
        is_solution = false;
        lastSymbol = operator;
        operators.push(operator);
    }
    else if(!lastSymbol.match(operatorsArr) && (lastSymbol === 'g' || lastSymbol.match(/\d+/) && operator !=='±'))
        ahon = true;
    else if(lastSymbol === '+' && operator.match(/[\-√∛]/g))
        ahon = true;
    else if(lastSymbol === '-' && operator.match(/√∛/g))
        ahon=true;
    else if(lastSymbol === '*' && operator.match(/[\-√∛]/g))
        ahon=true;
    else if(lastSymbol === '/' && operator.match(/[\-√∛]/g))
        ahon=true;
    else if(lastSymbol === '!' && operator.match(/[+\-*/]/g))
        ahon=true;
    else if(lastSymbol === '%')
        ahon=true;
    else if(lastSymbol.match(/\d+/) && operator==='±'){
        ahon=true;
    }
    if(ahon === true){
        operators.push(operator);
        textArea.append(operator);
        lastSymbol = operator;
        is_solution = false;
    }
}

function solve(){
    if(menuVisible) return;
    let temp = textArea.textContent.split(operatorsArr);
    for (let i = 0; i < temp.length; i++) {
        if(temp[i] !== '')
            input.push(Number(temp[i]));
    }
    temp = textArea.textContent.split(/[+!√∛^%\/*]+/g);
    let j = 0;
    for (let i = 0; i < temp.length; i++) {
        if(-Number(temp[i])=== input[j] && input[j] > 0){
            input[j] = Number(temp[i]);
        }
        if(temp[i] !== '')
            j++;
    }
    j = 0;
    for (let i = 0; i < input.length; i++) {
        if(operators[j] === '±'){
            input[i] = -input[i];
            operators.splice(j,1);
        }
        else if(operators[j+1] !== '±') j+=2;
        else{
            j++;
        }
    }
    if(input.length > 0){
        highestPriority();
        let result;
        j = 0;
        for (let i = 1; i < input.length; ) {
            result = input[i-1];
            if(operators[j] === '*'){
                operators.splice(j,1);
                result *= input[i];
                input[i-1] = result;
                input.splice(i,1);
            }
            else if(operators[j] === '/'){
                operators.splice(j,1);
                result /= input[i];
                input[i-1] = result;
                input.splice(i,1);
            }
            else{
                j++;
                i++;
            }
        }
        result = input[0];
        j = 0;
        for (let i = 1; i < input.length; i++) {
            if (operators[j] === '+') {
                result += input[i];
                j++;
            } else if (operators[j] === '-') {
                result -= input[i];
                j++;
            }
        }
        operators = [];
        input = [];
        if(result !== undefined){
            resultField.textContent =  textArea.textContent + '=';
            textArea.textContent = String(result);
            lastSymbol= 'g';
            is_solution = true;
            addDot = true;
            return result;
        }
        else{
            textArea.textContent = '0';
            lastSymbol = 'g';
        }
    }
}

function highestPriority(){
    let result = 1;
    let j = 0;
    for (let i = 0; i < input.length; i++) {
        if(operators[j] === '!'){
            if(String(input[i]).includes('.')){
                operators = [];
                input = [];
                return;
            }
            else{
                for(let k = 1; k <= Math.abs(input[i]); k++)
                    result *= k;
            }
            if(input[i] < 0)
                input[i] = -result;
            else
                input[i] = result;
            operators.splice(j,1);
            j++;
        }
        else if(operators[j] === '^'){
            input[i] = Math.pow(input[i], input[i+1]);
            input.splice(i+1,1);
            operators.splice(j,1);
            i--;
        }
        else if(operators[j] === '√' || operators[j] === '∛'){
            if(operators[j] === '√')
                input[i] = Math.sqrt(input[i]);
            else
                input[i] = Math.cbrt(input[i]);
            operators.splice(j,1);
            if(operators[j] !== undefined && operators[j].match(/[+\-/*]+/g)) j++;
            if(operators[j] === '!' || operators[j] === '^' || operators[j] === '%')
                i--;
        }
        else if(operators[j] === '%'){
            input[i] /= 100;
            operators.splice(j,1);
        }
        else j++;
    }
}

function memRead(){
    resultField.textContent = resultString + '=';
    textArea.textContent = String(memory);
}

function memClear(){
    memory = 0;
    resultString = '';
}

function memSub(){
    if(!lastSymbol.match(/[+\-*/√∛^]+/g)){
        let temp = solve();
        memory -= temp;
        if(resultString === '')
            resultString += String(temp);
        else
            resultString += '-' + String(temp);
    }
}

function memAdd(){
    if(!lastSymbol.match(/[+\-*/√∛^]+/g)){
        let temp = solve();
        memory += temp;
        if(resultString === '')
            resultString += String(temp);
        else
            resultString += '+' + String(temp);
    }
}

function copyResult(){
    if(is_solution === true){
        navigator.clipboard.writeText(resultField.textContent + textArea.textContent)
            .then(() => {
            })
            .catch((error) => {
            });
    }
}

function toggleConverterMenu() {
    const menu = document.getElementById('converterMenu');
    if (menuVisible) {
        menu.style.top = '50%';
        menuVisible = false;
    } else {
        numberForConversion = 0;
        menu.style.top = '70.5%';
        menuVisible = true;
    }
}

function doConversion(target, source, conversion){
    if (conversion.includes('cm^2')) {
        if (source === 'cm^2') {
            if (target === 'm^2') {
                resultField.textContent = numberForConversion + ' cm^2';
                numberForConversion /= 10000;
                textArea.textContent = numberForConversion + ' m^2';
            } else if (target === 'km^2') {
                resultField.textContent = numberForConversion + ' cm^2';
                numberForConversion /= 10000000000;
                textArea.textContent = numberForConversion + ' km^2';
            }
        } else if (source === 'm^2') {
            if (target === 'cm^2') {
                resultField.textContent = numberForConversion + ' m^2';
                numberForConversion *= 10000;
                textArea.textContent = numberForConversion + ' cm^2';
            } else if (target === 'km^2') {
                resultField.textContent = numberForConversion + ' m^2';
                numberForConversion /= 1000000;
                textArea.textContent = numberForConversion + ' km^2';
            }
        } else {
            if (target === 'cm^2') {
                resultField.textContent = numberForConversion + ' km^2';
                numberForConversion *= 10000000000;
                textArea.textContent = numberForConversion + ' cm^2';
            } else if (target === 'm^2') {
                resultField.textContent = numberForConversion + ' km^2';
                numberForConversion *= 1000000;
                textArea.textContent = numberForConversion + ' m^2';
            }
        }
    } else if (conversion.includes('cm')) {
        if (source === 'cm') {
            if (target === 'm') {
                resultField.textContent = numberForConversion + ' cm';
                numberForConversion /= 100;
                textArea.textContent = numberForConversion + ' m';
            } else if (target === 'km') {
                resultField.textContent = numberForConversion + ' cm';
                numberForConversion /= 100000;
                textArea.textContent = numberForConversion + ' km';
            }
        } else if (source === 'm') {
            if (target === 'cm') {
                resultField.textContent = numberForConversion + ' m';
                numberForConversion *= 100;
                textArea.textContent = numberForConversion + ' cm';
            } else if (target === 'km') {
                resultField.textContent = numberForConversion + ' m';
                numberForConversion /= 1000;
                textArea.textContent = numberForConversion + ' km';
            }
        } else {
            if (target === 'cm') {
                resultField.textContent = numberForConversion + ' km';
                numberForConversion *= 100000;
                textArea.textContent = numberForConversion + ' cm';
            } else if (target === 'm') {
                resultField.textContent = numberForConversion + ' km';
                numberForConversion *= 1000;
                textArea.textContent = numberForConversion + ' m';
            }
        }
    } else {
        if (source === 'gr') {
            if (target === 'kg') {
                resultField.textContent = numberForConversion + ' gr';
                numberForConversion /= 1000;
                textArea.textContent = numberForConversion + ' kg';
            } else if (target === 't') {
                resultField.textContent = numberForConversion + ' gr';
                numberForConversion /= 1000000;
                textArea.textContent = numberForConversion + ' t';
            }
        } else if (source === 'kg') {
            if (target === 'gr') {
                resultField.textContent = numberForConversion + ' kg';
                numberForConversion *= 1000;
                textArea.textContent = numberForConversion + ' gr';
                from = target;
            } else if (target === 't') {
                resultField.textContent = numberForConversion + ' kg';
                numberForConversion /= 1000;
                textArea.textContent = numberForConversion + ' t';
            }
        } else {
            if (target === 'gr') {
                resultField.textContent = numberForConversion + ' t';
                numberForConversion *= 1000000;
                textArea.textContent = numberForConversion + ' gr';
            } else if (target === 'kg') {
                resultField.textContent = numberForConversion + ' t';
                numberForConversion *= 1000;
                textArea.textContent = numberForConversion + ' kg';
            }
        }
    }
    from = target;
    to = undefined;
}

function getValues(value){
    if(from===undefined){
        from = value;
        if(lengths.includes(value)) currentConversion = lengths;
        else if(weights.includes(value)) currentConversion = weights;
        else currentConversion = area;
    }
    else if(currentConversion.includes(value)){
        if(textArea.textContent !== '0' && numberForConversion === 0) numberForConversion = Number(textArea.textContent);
        to = value;
        doConversion(to, from, currentConversion);
    }
}
