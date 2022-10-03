const toggleButton = document.querySelector('.expense-button')
const toggleIncomeButton = document.querySelector('.income-button')
const expenseInput = document.querySelector('.input-expense-container')
const incomeInput = document.querySelector('.input-income-container')




const toggle = () => {
    expenseInput.classList.toggle('hide')
    if (toggleButton.innerHTML.includes('Show Add')) {
        toggleButton.innerHTML = 'Hide Add Expense'
    } else if (toggleButton.innerHTML.includes('Hide Add')) {
        toggleButton.innerHTML = 'Show Add Expense'
    }
}

const toggleIncome = () => {
    incomeInput.classList.toggle('hide')
    if (toggleIncomeButton.innerHTML.includes('Show Add')) {
        toggleIncomeButton.innerHTML = 'Hide Add Income'
    } else if (toggleIncomeButton.innerHTML.includes('Hide Add')) {
        toggleIncomeButton.innerHTML = 'Show Add Income'
    }
}

toggleIncomeButton.addEventListener('click', toggleIncome)
toggleButton.addEventListener('click', toggle)