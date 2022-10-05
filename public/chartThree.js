const ctx = document.getElementById('myChartThree').getContext('2d');
const table = document.getElementById('myChart')
const getCredit = document.querySelectorAll('.income-credit')
const getAmount = document.querySelectorAll('.income-amount')

const credit = []
const amount = []

for (let x = 0; x < getAmount.length; x++) {
    credit.push(getCredit[x]?.innerText)
    amount.push(Number(getAmount[x]?.innerText))
}

const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: credit,
        datasets: [{
            label: 'Expense',
            data: amount,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
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