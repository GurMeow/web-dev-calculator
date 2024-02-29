const remove_last_button = document.getElementById("remove_last_button");

remove_last_button.addEventListener('mouseenter', () => {
    const img = document.createElement("img");
    img.setAttribute("class", "btn-img");
    img.src = "remove_last_button_hover.jpg";
    remove_last_button.innerHTML = "";
    remove_last_button.appendChild(img);
});

remove_last_button.addEventListener('mouseleave', () => {
    const img = document.createElement("img");
    img.setAttribute("class", "btn-img");
    img.src = "remove_last_button_casual.jpg";
    remove_last_button.innerHTML = "";
    remove_last_button.appendChild(img);
});

let equation = "";
let shown_equation = ""; // New variable for displaying the equation

let can_add_operation = false;
const equation_line = document.getElementById("equation-line");
const result_line = document.getElementById("result-line");

let result;
let clicked_result = false;

let can_add_open_bracket = true;
let can_add_close_bracket = false;
let in_brackets = false;

let can_add_dot = false;
let clicked_dot = false;

function updateEquation() {
    if (shown_equation !== "")
    {
        equation_line.innerHTML = shown_equation; // Update the equation line to show the shown_equation
    }
    else
    {
        equation_line.innerHTML = "-";
    }
}

function add_number(num) {
    if (clicked_result === false) {
        if (clicked_dot === false)
        {
            can_add_dot = true;
        }

        equation += num;
        shown_equation += num;
        updateEquation();

        can_add_operation = true;
        can_add_open_bracket = false;

        if (in_brackets === true) {
            can_add_close_bracket = true;
        }
    }
    else if (clicked_result === true) {
        equation = `${num}`;
        shown_equation = `${num}`;
        updateEquation();

        clicked_result = false;
        can_add_open_bracket = false;
        can_add_close_bracket = false;
        clicked_dot = false;
        can_add_dot = true;
    }
}

function add_operation(operator) {
    let shown_operator = operator;
    if (operator === "*") {
        shown_operator = "X";
    }
    else if (operator == "/")
    {
        shown_operator = ":";
    }
    if (can_add_operation === true) {
        can_add_dot = true;
        clicked_dot = false;

        equation += operator;
        shown_equation += shown_operator;
        updateEquation();

        can_add_operation = false;
        clicked_result = false;
        can_add_close_bracket = false;
        
        if (in_brackets === false) {
            can_add_open_bracket = true;
        }
    }
}


function show_result() {
    const simple_equation = simplifyEquation(equation);
    console.log(simple_equation);

    try {
        result = eval(simple_equation);
        if (result !== undefined && can_add_operation === true) {
            result = Math.floor(result * 100) / 100;
            result_line.innerHTML = result;
            clicked_result = true;
        }
    } catch (error) {
        result_line.innerHTML = "Error";
        console.log(result, simple_equation, error);
    }
}

function clear_all() {
    equation = "";
    shown_equation = ""; // Clear the shown_equation as well

    equation_line.innerHTML = "-";
    result_line.innerHTML = "0";

    can_add_open_bracket = true;
    can_add_close_bracket = false;
    can_add_operation = false;
    clicked_dot = false;
    can_add_dot = false;
    clicked_result = false;
}

function remove_last() {
    if (equation.length !== 0) {
        if (equation.slice(-2) === "**") {
            // Check if the last character is a multiplication operator
            equation = equation.slice(0, -1);
            shown_equation = shown_equation.slice(0, -2);
            updateEquation();
            can_add_operation = true;
        } else if (equation[equation.length - 1] === "*") {
            // Check if the last two characters are "**" representing power
            equation = equation.slice(0, -1);
            shown_equation = shown_equation.slice(0, -1);
            updateEquation();
            can_add_operation = true;
        } else {
            // Otherwise, remove the last character normally
            if (equation.slice(-1) == "(")
            {
                can_add_open_bracket = true;
                can_add_close_bracket = false;
            }
            else if (equation.slice(-1) == ")")
            {
                can_add_open_bracket = false;
                can_add_close_bracket = true;
                in_brackets = true;
            }
            clicked_result = false;
            equation = equation.slice(0, -1);
            shown_equation = shown_equation.slice(0, -1);
            updateEquation();
        }
    }
}

function remove_last_number() {
    if (equation.length !== 0 && can_add_operation === true) {
        for (let i = equation.length; i >= 0; i--) {
            if (equation[i] == "+" || equation[i] == "-" || equation[i] == "*" || equation[i] == "/") {
                equation = equation.slice(0, i + 1);
                shown_equation = shown_equation.slice(0, i + 1); // Adjust shown_equation
                updateEquation();
                can_add_operation = false;
                break;
            }
        }
    }
}

function add_dot() {
    if (can_add_operation === true && clicked_result === false && can_add_dot === true) {
        can_add_dot = false;
        clicked_dot = true;

        equation += ".";
        shown_equation += ".";
        updateEquation();

        can_add_operation = false;
    }
}

function add_open_bracket() {
    if (clicked_result === true) {
        equation = "(";
        shown_equation = "(";
        updateEquation();

        can_add_close_bracket = false;
        can_add_open_bracket = false;
        in_brackets = true;
        can_add_operation = false;

        clicked_result = false;
    } else if (can_add_open_bracket === true) {
        equation += "(";
        shown_equation += "(";
        updateEquation();

        can_add_open_bracket = false;
        can_add_close_bracket = false;
        can_add_operation = false;
        in_brackets = true;
    }
}

function add_close_bracket() {
    if (can_add_close_bracket === true && clicked_result === false) {
        can_add_close_bracket = false;
        can_add_open_bracket = false;
        equation += ")";
        shown_equation += ")";
        updateEquation();

        in_brackets = false;
    }
}

function add_fraction() {
    if (clicked_result === true) {
        equation = "1/(";
        shown_equation = "1/(";
        updateEquation();

        can_add_open_bracket = false;
        can_add_close_bracket = false;
        can_add_operation = false;
        in_brackets = true;
        clicked_result = false;
    } else if (can_add_operation === false && in_brackets === false) {
        equation += "1/(";
        shown_equation += "1/(";
        updateEquation();

        can_add_open_bracket = false;
        can_add_close_bracket = false;
        can_add_operation = false;
        in_brackets = true;
    }
}

function add_power() {
    if (can_add_operation === true) {
        equation += "**"; // Using **2 to represent raising to the power of 2 in JavaScript
        shown_equation += "^"; // Display "^2" in the shown equation
        updateEquation();

        can_add_operation = false;
        clicked_result = false;
        can_add_close_bracket = false;
        
        if (in_brackets === false) {
            can_add_open_bracket = true;
        }

        can_add_operation = true;
    }
}

function add_answer()
{
    if (result !== undefined && can_add_operation === false && clicked_result === false)
    {
        equation += result;
        shown_equation += result;
        updateEquation();
        can_add_operation = true;
        if (in_brackets === true)
        {
            can_add_open_bracke = false;
            can_add_close_bracket = true;
        }
    }
    else if (clicked_result === true)
    {
        equation = result;
        shown_equation = result;
        updateEquation();
    }
}

function simplifyEquation(equation) {
    // Split the equation into tokens (numbers and operators)
    const tokens = equation.match(/\d+(\.\d+)?|[-+*/()]/g);

    // Process each token
    const simplifiedTokens = tokens.map(token => {
        if (!isNaN(token)) { // If the token is a number
            // Remove leading zeroes if they are unnecessary
            if (token.includes('.')) {
                // If the number is a decimal, remove leading zeroes from both parts
                const parts = token.split('.');
                const integerPart = parseInt(parts[0]).toString();
                const decimalPart = parts[1].replace(/^0+/, ''); // Remove leading zeroes
                return integerPart + (decimalPart ? '.' + decimalPart : ''); // Reconstruct the number
            } else {
                // If the number is an integer, remove leading zeroes
                return parseInt(token).toString();
            }
        } else { // If the token is an operator
            return token;
        }
    });

    // Join the simplified tokens back into a string
    const simplifiedEquation = simplifiedTokens.join('');

    return simplifiedEquation;
}
