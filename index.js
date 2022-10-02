const express = require('express')
const pgp = require('pg-promise')();
const local = 'postgres://postgres:juanesse123@localhost:5432/expense_tracker';
const bodyParser = require('body-parser')
const cors = require('cors')
const handlebars = require('express-handlebars')
const session = require('express-session')
const dotenv = require('dotenv')
const flash = require('connect-flash')
const ExpensesDb = require('./sql/expenses.js')
const ExpensesFE = require('./app.js')
const Routes = require('./routes/routes.js')

const connectionString = process.env.DATABASE_URL || local
const config = {
    connectionString,
    max: 20,
    ssl: {
        rejectUnauthorized: false
    }
}
const db = pgp(config)
// server port number
const app = express()
dotenv.config()
const expensesFE = ExpensesFE()
const expensesDb = ExpensesDb(db)
const routes = Routes(expensesDb, expensesFE)


app.set('view engine', 'hbs')
app.engine('hbs', handlebars.engine({
    layoutsDir: `./views/layouts`,
    extname: 'hbs',
    defaultLayout: 'main',
}))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json())
app.use(cors())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}))

app.use(flash())

app.get('/', routes.getWelcome)
app.post('/', routes.postWelcome)

app.get('/api/get_code/:name', routes.getCode)
app.post('/api/get_code/:name', routes.postCode)

app.get('/api/expenses/:name', routes.getExpenses)
app.post('/api/expenses/:name', routes.postExpenses)

app.get('/api/signup', routes.getSignup)
app.post('/api/signup', routes.postSignup)
app.get('/api/expenses/category/:name', routes.getCategory)
app.post('/api/expenses/category/:name', routes.postCategory)

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log('Your app is running on port: ', port)
})