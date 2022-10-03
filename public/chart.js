const ctx = document.getElementById('myChart').getContext('2d');
const table = document.getElementById('myChart')
const getCategory = document.querySelectorAll('.expense-category')
const getAmount = document.querySelectorAll('.expense-amount')

const allCategory = []
const allAmount = []

for (let x = 0; x < getAmount.length; x++) {
    allCategory.push(getCategory[x]?.innerText)
    allAmount.push(Number(getAmount[x]?.innerText))
}

allAmount.push(allAmount.reduce((acc, tot) => acc + tot))
allCategory.push('Total')

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: allCategory,
        datasets: [{
            label: 'Expense',
            data: allAmount,
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