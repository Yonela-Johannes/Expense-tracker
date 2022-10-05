const moment = require("moment")
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 5 });

const Routes = (expenseDb, expensesFE) => {
    const getWelcome = async (req, res) => {
        res.render('welcome')
    }
    const postWelcome = async (req, res) => {
        const { name } = req.body
        const existUser = await expenseDb.getUserByName(name)
        req.session.code = uid()
        if (existUser) {
            await expenseDb.storeCode(name, req.session.code)
            res.redirect(`/api/get_code/${name}`)
        } else if (existUser == undefined) {
            res.redirect('/api/signup')
        }
    }

    const getCode = async (req, res) => {
        const { name } = req.params
        let user = await expenseDb.getUserByName(name)
        req.session.code = uid()
        if (user == undefined) {
            res.redirect('/api/signup')
        }
        res.render('get_code', {
            user,
            uid: user.code,
        })
    }


    const postCode = async (req, res) => {
        const { name } = req.params
        const { code } = req.body
        let user = await expenseDb.getUserByName(name)
        let userByCode = await expenseDb.findUserByCode(code)
        if (!code || !name || !userByCode) {
            res.redirect(`${name}`)
        }
        else if (code == userByCode.code) {
            res.redirect(`/api/expenses/${name}`)
        } else if (code !== userByCode.code) {
            res.redirect(`${name}`)
        }
    }

    const getSignup = async (req, res) => {
        res.render('signup', {

        })
    }
    const postSignup = async (req, res) => {
        const { first_name, last_name, email } = req.body
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

        const { current_day } = await expenseDb.getCurrentDay()
        const categories = await expenseDb.getCategories()
        const expenses = await expenseDb.getUserExpenses(name)
        const totalAmount = await expenseDb.getTotalAmount(name)

        const credit = {}
        const income = await expenseDb.userIncome(name)
        for (let cred of income.map(obj => obj.credit)) {
            const allCredits = await expenseDb.incomeByName(name, cred)
            credit[cred] = [... new Set(allCredits.map(obj => obj))]
        }
        // const daysDuration = await expenseDb.expensesByDuration(user.first_name, count)
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
        res.render('post_expenses', {
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
            daysDuration: 0,
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

        if (!price || !date) {
            res.redirect(`${name}`)
        } else if (!category && !new_category) {
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
            } else if (!category) {
                await expenseDb.storeCategory(new_category)
                const result = await expenseDb.getCategoryByName(new_category)
                const cat_id = result.id
                categoryResult = cat_id
            } else if (category && new_category) {
                categoryResult = category
            }
            await expenseDb.getCategories()
            const dateResult = expensesFE.getDate()
            const priceResult = expensesFE.getPrice()
            await expenseDb.storeExpenses(id, categoryResult, dateResult, priceResult)
            res.redirect(`${name}`)
        }
    }

    const getCategory = async (req, res) => {
        const { catId, searchDate } = req.body
        const { name } = req.params
        const categories = await expenseDb.getCategories()
        const user = await expenseDb.getUserByName(name)
        if (!user) {
            res.redirect(`/api/signup`)
        }
        const catExpenses = await expenseDb.expByCategory(name, catId)
        expensesFE.setDate(searchDate)
        const dateResult = expensesFE.getDate()
        const expenses = await expenseDb.getUserExpenses(user.first_name)
        const getByDate = {}
        for (let date of expenses.map(obj => obj.date)) {
            const byDate = await expenseDb.expensesByDate(user.first_name, dateResult)
            getByDate[date] = [...new Set(byDate.map(obj => obj))]
        }
        // console.log('DATE ====: ==" ', dateResult)
        // console.log(getByDate)

        res.render('category', {
            getByDate,
            name,
            categories,
            catExpenses,
            helpers: {
                dateFormatter: (date) => {
                    // console.log(date)
                    // return moment(date).format("ddd-DD-MMM")
                    return date
                },
            }
        })
    }
    const postCategory = async (req, res) => {
        const { catId } = req.body
        const { name } = req.params
        const categories = await expenseDb.getCategories()
        const catExpenses = await expenseDb.expByCategory(name, catId)
        res.redirect(`/api/expenses/${name}`)
        res.render('category', {
            name,
            categories,
            catExpenses,
            helpers: {
                dateFormatter: (date) => {
                    // return moment(date).format("ddd-DD-MMM")
                    return date
                },
            }
        })
    }
    const postIncome = async (req, res) => {
        let incomesResult = 0
        const { name } = req.params
        const { incomeAmount, incomeDate, newIncome, incomes } = req.body
        if (!incomeAmount) {
            res.redirect(`/api/expenses/${name}`)
        } else if (!newIncome && !incomes) {
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
                const result = await expenseDb.incomesByName(newIncome)
                const income_id = result.id
                categoryResult = income_id
            } else if (incomes && newIncome) {
                incomesResult = incomes
            } else if (!incomes && !newIncome) {
                res.redirect(`/api/expenses/${name}`)
            }
            await expenseDb.getCredits()
            const dateResult = expensesFE.getDate()
            const amountResult = expensesFE.getPrice()
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
        getCategory,
        postCategory,
        postIncome,
        postByDate,
        postByDay
    }
}

module.exports = Routes