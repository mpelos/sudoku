const container = document.getElementById('container');
const counterEl = document.getElementById('counter');
const table = document.createElement('table');
container.appendChild(table);

const inputs = [];

const EXAMPLE = [
  [null, null, 2, null, 5, null, null, null, null],
  [null, null, null, null, null, 9, 7, null, null],
  [9, null, 7, null, 3, null, null, 2, null],
  [null, null, null, null, 2, null, null, 4, null],
  [7, null, 3, 1, null, 4, 2, null, 5],
  [null, 8, null, null, 6, null, null, null, null],
  [null, 6, null, null, 9, null, 5, null, 7],
  [null, null, 1, 5, null, null, null, null, null],
  [null, null, null, null, 4, null, 8, null, null],
]

for (let i = 0; i < 9; i++) {
  const tr = document.createElement('tr');
  table.appendChild(tr);
  inputs[i] = [];

  for (let j = 0; j < 9; j++) {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.setAttribute('maxlength', '1');
    input.setAttribute('data-index', (j + 1) + (i * 9));
    input.value = EXAMPLE[i][j]; // TODO: remover

    input.addEventListener('input', inputEventListener);

    tr.appendChild(td);
    td.appendChild(input);

    inputs[i][j] = input;
  }
}

function solve() {
  let counter = 0;
  const currentScenario = getCurrentScenario();
  let validScenarios = [currentScenario];

  for (var i = 0; i < currentScenario.length; i++) {
    for (var j = 0; j < currentScenario[i].length; j++) {
      if (currentScenario[i][j]) {
        continue;
      }

      validScenarios = validScenarios.reduce((acc, scenario) => {
        counter += 1;
        const cellValidScenarios = validScenariosForCell(scenario, i, j);

        if (cellValidScenarios.length) {
          return acc.concat(cellValidScenarios);
        } else {
          return acc;
        }
      }, []);
    }
  }

  if (counterEl) {
    counterEl.innerText = counter;
  }

  if (validScenarios.length === 1) {
    writeScenarioOnInputs(validScenarios[0]);
  } else {
    alert('Não é possível resolver esse Sudoku');
  }
}

function getCurrentScenario() {
  const scenario = [];

  for (var i = 0; i < inputs.length; i++) {
    scenario[i] = [];

    for (var j = 0; j < inputs[i].length; j++) {
      const value = inputs[i][j].value;
      scenario[i][j] = value ? parseInt(value) : null;
    }
  }

  return scenario;
}

function validScenariosForCell(matrix, i, j) {
  const scenarios = [];

  for (var x = 1; x <= 9; x++) {
    if (getLineNumbers(matrix, i).includes(x)) {
      continue;
    } else if (getColumnNumbers(matrix, j).includes(x)) {
      continue;
    } else if (getGroupNumbers(matrix, i, j).includes(x)) {
      continue;
    }

    const scenario = matrix.map(row => [...row])
    scenario[i][j] = x;
    scenarios.push(scenario);
  }

  return scenarios;
}

function getLineNumbers(matrix, i) {
  return matrix[i].filter((n) => !!n);
}

function getColumnNumbers(matrix, j) {
  return matrix.map(function(row) {
    return row[j];
  }).filter((n) => !!n);
}

function getGroupNumbers(matrix, i, j) {
  const numbers = [];

  i = Math.floor(i / 3);
  j = Math.floor(j / 3);

  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      const n = matrix[(i * 3) + x][(j * 3) + y];
      if (n) numbers.push(n);
    }
  }

  if (j >= 3) console.log(numbers);

  return numbers;
}

function writeScenarioOnInputs(scenario) {
  for (var i = 0; i < scenario.length; i++) {
    for (var j = 0; j < scenario[i].length; j++) {
      const input = inputs[i][j];

      if (!input.value) { input.readOnly = true; }

      input.value = scenario[i][j];
    }
  }
}

function inputEventListener(event) {
  const el = event.target;

  if (/\D/.test(el.value) || !event.data) {
    el.value = "";
    return;
  }

  focusNext(el);
}

function focusNext(input) {
  const index = +input.getAttribute('data-index');
  const nextInput = document.querySelector(`[data-index="${index+1}"]`)

  if (nextInput.readOnly) {
    focusNext(nextInput);
    return;
  } else if (!nextInput) {
    return;
  }

  nextInput.focus();
}
