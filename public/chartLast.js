const ctx = document.getElementById('myChartLast').getContext('2d');
const table = document.getElementById('myChart')
const getCredit = document.querySelectorAll('.income-category')
const getAmount = document.querySelectorAll('.income-amount')

const getCategory = document.querySelectorAll('.expense-category')
const getExpenseAmount = document.querySelectorAll('.expense-amount')


const credit = []
const amount = []
const category = []
const allExpenseAmount = []

for (let x = 0; x < getAmount.length; x++) {
    credit.push(getCredit[x]?.innerText)
    amount.push(Number(getAmount[x]?.innerText))
}

for (let x = 0; x < getExpenseAmount.length; x++) {
    category.push(getCategory[x]?.innerText)
    allExpenseAmount.push(Number(getExpenseAmount[x]?.innerText))
}
let totals = []
const totalExpense = allExpenseAmount.reduce((acc, tot) => acc + tot, 0)
const totalIncome = amount.reduce((acc, tot) => acc + tot, 0)

totals.push(totalExpense)
totals.push(totalIncome)

const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Expense', 'Income'],
        datasets: [{
            label: 'Total',
            data: totals,
            backgroundColor: [
                'rgba(255,0,0, 0.5)',
                'rgba(0,128,0, 0.5)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(255,0,0, 1)',
                'rgba(0,128,0, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});