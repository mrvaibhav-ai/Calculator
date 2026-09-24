const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calc-btn');

let currentInput = '0';
let previousValue = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function appendValue(value) {
  if (value === '.' && currentInput.includes('.')) {
    return;
  }

  if (shouldResetDisplay) {
    currentInput = '';
    shouldResetDisplay = false;
  }

  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }

  updateDisplay();
}

function clearCalculator() {
  currentInput = '0';
  previousValue = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLast() {
  if (currentInput.length <= 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }

  updateDisplay();
}

function calculateResult() {
  if (operator === null || previousValue === null) {
    return;
  }

  const current = Number(currentInput);
  let result = 0;

  if (operator === '+') {
    result = previousValue + current;
  } else if (operator === '-') {
    result = previousValue - current;
  } else if (operator === '*') {
    result = previousValue * current;
  } else if (operator === '/') {
    result = previousValue / current;
  }

  if (!Number.isFinite(result)) {
    currentInput = 'Error';
    previousValue = null;
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
    return;
  }

  currentInput = String(result);
  previousValue = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function chooseOperator(nextOperator) {
  const inputValue = Number(currentInput);

  if (currentInput === 'Error') {
    return;
  }

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (operator) {
    const previous = previousValue;
    const current = inputValue;
    let result = 0;

    if (operator === '+') {
      result = previous + current;
    } else if (operator === '-') {
      result = previous - current;
    } else if (operator === '*') {
      result = previous * current;
    } else if (operator === '/') {
      result = previous / current;
    }

    previousValue = result;
    currentInput = String(result);
    updateDisplay();
  }

  operator = nextOperator;
  shouldResetDisplay = true;
}

for (let i = 0; i < buttons.length; i += 1) {
  buttons[i].addEventListener('click', () => {
    const action = buttons[i].dataset.action;
    const value = buttons[i].dataset.value;

    if (buttons[i].classList.contains('number')) {
      appendValue(value);
      return;
    }

    if (action === 'clear') {
      clearCalculator();
      return;
    }

    if (action === 'delete') {
      deleteLast();
      return;
    }

    if (action === 'operator') {
      chooseOperator(value);
      return;
    }

    if (action === 'equals') {
      calculateResult();
    }
  });
}

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/[0-9]/.test(key)) {
    appendValue(key);
    return;
  }

  if (key === '.') {
    appendValue('.');
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    chooseOperator(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    calculateResult();
    return;
  }

  if (key === 'Backspace') {
    deleteLast();
    return;
  }

  if (key === 'Escape') {
    clearCalculator();
  }
});

updateDisplay();
