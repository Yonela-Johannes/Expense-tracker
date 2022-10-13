const moment = require("moment")
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 5 });

const Routes = (expenseDb, expensesFE) => {
    const getWelcome = async (req, res) => {
        const messages = req.flash()
        const failed = messages ? messages?.failed : ''
        res.render('welcome', {
            failed,
        })
    }
    const postWelcome = async (req, res) => {
        const { name } = req.body
        if (!name) {
            req.flash('failed', 'Please enter your name!')
            res.redirect('/')
        } else if (typeof name !== 'string') {
            req.flash('failed', 'Invalid input type!!')
            res.redirect('/')
        } else {
            const existUser = await expenseDb.getUserByName(name)
            req.session.code = uid()
            if (existUser) {
                await expenseDb.storeCode(name, req.session.code)
                res.redirect(`/api/get_code/${name}`)
            } else if (existUser == undefined) {
                res.redirect('/api/signup')
            }
        }
    }

    const getCode = async (req, res) => {
        const { name } = req.params
        let user = await expenseDb.getUserByName(name)
        req.session.code = uid()
        const messages = req.flash()
        const failed = messages ? messages?.failed : ''
        if (user == undefined) {
            res.redirect('/api/signup')
        }
        res.render('get_code', {
            user,
            failed,
            uid: user.code,
        })
    }


    const postCode = async (req, res) => {
        const { name } = req.params
        const { code } = req.body
        if (!name) {
            res.redirect('/signup')
        }
        else {
            let [userByCode] = await expenseDb.findUserByCode(code)
            const storedCode = userByCode.code
            if (!code) {
                req.flash('failed', `${name} enter given code!`)
                res.redirect(`${name}`)
            } else if (code !== storedCode) {
                req.flash('failed', `${name} incorrect code entered!`)
                res.redirect(`${name}`)
            } else if (code == storedCode) {
                res.redirect(`/api/expenses/${name}`)
            }
        }
    }

    const getSignup = async (req, res) => {
        const messages = req.flash()
        const failed = messages ? messages?.failed : ''
        res.render('signup', {
            failed
        })
    }
    const postSignup = async (req, res) => {
        const { first_name, last_name, email } = req.body

        if (!first_name) {
            req.flash('failed', 'Please enter your name!!')
            res.redirect('signup')
        } else if (!last_name) {
            req.flash('failed', 'Please enter your last name!!')
            res.redirect('signup')
        } else if (!email) {
            req.flash('failed', 'Please enter your email!!')
            res.redirect('signup')
        }
        expensesFE.setName(first_name)
        expensesFE.setLastName(last_name)
        expensesFE.setEmail(email)
        const name = expensesFE.getName()
        const lastName = expensesFE.getLastName()
        const userEmail = expensesFE.getEmail()
        await expenseDb.storeUser(name, lastName, userEmail)
        const user = await expenseDb.getUserByName(name)
        req.session.code = uid()
        await expenseDb.storeCode(user.first_name, req.session.code)
        res.redirect(`/api/get_code/${user.first_name}`)
    }


    const getExpenses = async (req, res) => {
        const { name } = req.params
        const user = await expenseDb.getUserByName(name)
        if (!user) {
            res.redirect(`/api/signup`)
        }

        const user_day = await expenseDb.getCurrentDay()
        const current_day = user_day?.current_day
        current_day ? current_day : 1
        const categories = await expenseDb.getCategories()
        const expenses = await expenseDb.getUserExpenses(name)
        const totalAmount = await expenseDb.getTotalAmount(name)

        const credit = {}
        const income = await expenseDb.userIncome(name)
        for (let cred of income.map(obj => obj.credit)) {
            const allCredits = await expenseDb.incomeByName(name, cred)
            credit[cred] = [... new Set(allCredits.map(obj => obj))]
        }
        const daysDuration = await expenseDb.expensesByDuration(user.first_name, current_day)
        const credits = await expenseDb.getCredits()
        const getAmounts = []
        const expensesAmounts = []
        for (let x in credit) {
            for (let y in credit[x]) {
                getAmounts.push(Number(credit[x][y]['amount']))
            }
        }
        for (let x in expenses) {
            expensesAmounts.push(Number(expenses[x]['amount']))
        }
        const total = getAmounts.reduce((acc, tot) => acc + tot, 0)
        const totalExpenses = expensesAmounts.reduce((acc, tot) => acc + tot, 0)
        const messages = req.flash()
        const failed = messages ? messages?.failed : ''
        res.render('post_expenses', {
            failed,
            name,
            categories,
            totalAmount,
            expenses,
            credit,
            credits,
            income,
            total,
            totalExpenses,
            days: current_day,
            daysDuration,
            helpers: {
                dateFormatter: (date) => {
                    return moment(date).format("ddd-DD-MMM")
                },
            },
        })
    }
    const postExpenses = async (req, res) => {
        let categoryResult = 0
        const { name } = req.params
        const { price, date, new_category, category } = req.body

        if (!price) {
            req.flash('failed', `${name} please enter price!`)
            res.redirect(`${name}`)
        } else if (!date) {
            req.flash('failed', `${name} please enter date!`)
            res.redirect(`${name}`)
        } else if (!category && !new_category) {
            req.flash('failed', `${name} please add new or select category!`)
            res.redirect(`${name}`)
        } else {
            const user = await expenseDb.getUserByName(name)
            if (!user) {
                res.redirect(`/api/signup`)
            }
            const { id } = user
            expensesFE.setPrice(price)
            expensesFE.setDate(date)

            if (category) {
                categoryResult = category
            } else if (new_category) {
                await expenseDb.storeCategory(new_category)
            } else if (category && new_category) {
                categoryResult = category
            } else if (!category && !new_category) {
                res.redirect(`/api/expenses/${name}`)
            }
            await expenseDb.getCategories()
            const dateResult = expensesFE.getDate()
            const priceResult = expensesFE.getPrice()
            const result = await expenseDb.categoryByName(new_category)
            categoryResult = categoryResult ? categoryResult : result?.id
            await expenseDb.storeExpenses(id, categoryResult, dateResult, priceResult)
            res.redirect(`${name}`)
        }
    }

    const postIncome = async (req, res) => {
        let incomesResult = 0
        const { name } = req.params
        const { incomeAmount, incomeDate, newIncome, incomes } = req.body
        if (!incomeAmount) {
            req.flash('failed', `${name} please enter income amount!`)
            res.redirect(`/api/expenses/${name}`)
        } else if (!newIncome && !incomes) {
            req.flash('failed', `${name} please add new or select source of income!`)
            res.redirect(`/api/expenses/${name}`)
        } else if (incomes && !newIncome || newIncome && !incomes) {
            const user = await expenseDb.getUserByName(name)
            if (!user) {
                res.redirect(`/api/signup`)
            }
            const { id } = user
            expensesFE.setPrice(incomeAmount)
            expensesFE.setDate(incomeDate)

            if (incomes) {
                incomesResult = incomes
            } else if (!incomes && newIncome) {
                await expenseDb.storeIncomesCategory(newIncome)
            } else if (incomes && newIncome) {
                incomesResult = incomes
            } else if (!incomes && !newIncome) {
                res.redirect(`/api/expenses/${name}`)
            }
            const result = await expenseDb.incomesByName(newIncome)
            await expenseDb.getCredits()
            const dateResult = expensesFE.getDate()
            const amountResult = expensesFE.getPrice()
            incomesResult = incomesResult ? incomesResult : result?.id
            await expenseDb.storeIncome(id, incomesResult, dateResult, amountResult)
            res.redirect(`/api/expenses/${name}`)
        }
    }
    const postByDate = async (req, res) => {
        const { name } = req.params
        const { searchDate } = req.body

        if (!searchDate) {
            res.redirect(`/api/expenses/category/${name}`)
        }
        const user = await expenseDb.getUserByName(name)
        if (!user) {
            res.redirect(`/api/signup`)
        }
        expensesFE.setDate(searchDate)
        const dateResult = expensesFE.getDate()
        await expenseDb.expensesByDate(user.first_name, dateResult)
        res.redirect(`/api/expenses/category/${user.first_name}`)
    }

    const postByDay = async (req, res) => {
        const { name } = req.params
        let { duration } = req.body
        const user = await expenseDb.getUserByName(name)
        if (!user) {
            res.redirect(`/api/signup`)
        } else if (!duration) {
            req.flash('failed', `${name} enter duration!`)
            res.redirect(`/api/expenses/${user.first_name}`)
        } else {
            await expenseDb.currentDay(duration)
            res.redirect(`/api/expenses/${user.first_name}`)
        }
    }

    return {
        getWelcome,
        postWelcome,
        postCode,
        getCode,
        getSignup,
        postSignup,
        postExpenses,
        getExpenses,
        postIncome,
        postByDate,
        postByDay
    }
}

module.exports = Routes