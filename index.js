let display = 0;
let leftOperand, currentOperator;
let displayHasBeenReset = false;
let lastClickWasOperator = false;
let lastClickWasEquals = false;

function updateMessage(text) {
  const message = document.querySelector("#message");
  message.textContent = text;
}

function updateDisplay(callback) {
  const newDisplay = callback();
  if (newDisplay === undefined) return;

  const newDisplayLength = newDisplay.toString().length;

  if (newDisplayLength <= 9) {
    display = newDisplay;
    document.querySelector("#display").textContent = display;
  } else {
    if (newDisplay.toString().match(/\./)) {
      const split = newDisplay.toString().split(".");
      const leftLength = split[0].length;

      if (leftLength > 7) {
        updateMessage("That's too much for this old calculator!");
        return;
      }

      const resized = newDisplay.toFixed(8 - leftLength);

      display = resized;
      document.querySelector("#display").textContent = display;
    } else {
      updateMessage("That's too much for this old calculator!");
      return;
    }
  }
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b == 0) {
    clear();
    updateMessage("Can't divide by 0 you fool!");
  } else {
    return a / b;
  }
}

function parse(a) {
  if (a === undefined) return;

  const num = a.toString();

  if (num.match(/\./)) {
    return parseFloat(num);
  } else {
    return parseInt(num);
  }
}

function operate(operator, first, second) {
  const a = parse(first);
  const b = parse(second);

  switch (operator) {
    case "add":
      return add(a, b);
    case "subtract":
      return subtract(a, b);
    case "multiply":
      return multiply(a, b);
    case "divide":
      return divide(a, b);
  }
}

function clearButtonClass() {
  const lightsOn = document.querySelectorAll(".op-select");
  if (lightsOn.length > 0) {
    for (let i = 0; i < lightsOn.length; i++) {
      lightsOn[i].classList.remove("op-select");
    }
  }
}

function clear() {
  updateDisplay(() => 0);
  leftOperand = undefined;
  currentOperator = undefined;
  lastClickWasOperator = false;
  clearButtonClass();
  updateMessage("");
}

function equals() {
  updateMessage("");
  const result = operate(currentOperator, leftOperand, display);
  updateDisplay(() => result);
  leftOperand = undefined;
  currentOperator = undefined;
  displayHasBeenReset = false;
  lastClickWasEquals = true;
}

function handleNumClick(num) {
  if (lastClickWasEquals) updateMessage("");

  if (display.toString() === "0.") {
    updateDisplay(() => "0." + num);
    displayHasBeenReset = true;
  } else if (displayHasBeenReset && !lastClickWasEquals) {
    updateDisplay(() => {
      if (display === 0) {
        return parse(num);
      } else {
        return display + num.toString();
      }
    });
  } else {
    updateDisplay(() => num);
    displayHasBeenReset = true;
  }
  clearButtonClass();
  lastClickWasOperator = false;
  lastClickWasEquals = false;
}

function handleOperatorClick(operator) {
  updateMessage("");
  if (lastClickWasOperator === true) {
    currentOperator = operator;
  } else {
    if (currentOperator) equals();
    leftOperand = display;
    currentOperator = operator;
    displayHasBeenReset = false;
    lastClickWasOperator = true;
    lastClickWasEquals = false;
  }

  // update operator button appearance
  clearButtonClass();
  const opClass = document.querySelector(`#${operator}`);
  opClass.classList.add("op-select");
}

function handleDecimalClick() {
  updateMessage("");
  updateDisplay(() => {
    if (lastClickWasOperator || lastClickWasEquals) return "0.";
    if (!display.toString().match(/\./)) return display + ".";
  });
  displayHasBeenReset = true;
  lastClickWasOperator = false;
  lastClickWasEquals = false;
}

function onload() {
  // add event listeners for digit buttons
  const digitButtons = document.querySelectorAll(".dig");
  for (let i = 0; i < digitButtons.length; i++) {
    digitButtons[i].addEventListener("click", (e) => {
      handleNumClick(e.target.id);
    });
  }

  // add event listener for clear button
  const clearButton = document.querySelector("#clear");
  clearButton.addEventListener("click", clear);

  // add event listeners for operator buttons
  const operatorButtons = document.querySelectorAll(".op");
  for (let i = 0; i < operatorButtons.length; i++) {
    operatorButtons[i].addEventListener("click", (e) => {
      handleOperatorClick(e.target.id);
    });
  }

  // add event listener for equals button
  const equalsButton = document.querySelector("#equals");
  equalsButton.addEventListener("click", equals);

  // add event listener for decimal button
  const decimalButton = document.querySelector("#decimal");
  decimalButton.addEventListener("click", handleDecimalClick);
}

document.addEventListener("DOMContentLoaded", onload);
