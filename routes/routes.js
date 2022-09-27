const Routes = (expenseDb, expensesFE) => {
    const getWelcome = async (req, res) => {
        res.render('welcome', {

        })
    }
    const postWelcome = async (req, res) => {
        const { name } = req.body
        console.log(req.body)
        res.redirect('welcome')
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
        res.redirect('/api/signup')
    }

    const getSignin = async (req, res) => {
        res.render('signin', {

        })
    }
    const postSignin = async (req, res) => {
        const { email } = req.body
        const user = await expenseDb.getUser(email)
        const user_name = user.first_name.toLowerCase()
        res.redirect(`/api/expenses/${user_name}`)
    }
    const getExpenses = async (req, res) => {
        const { name } = req.params
        const categories = await expenseDb.getCategories()
        res.render('post_expenses', {
            name,
            categories
        })
    }
    const postExpenses = async (req, res) => {
        const { name } = req.params
        const { price, date, new_category, category } = req.body
        const user = await expenseDb.getUserByName(name)
        const { id } = user
        expensesFE.setPrice(price)
        expensesFE.setDate(date)
        expensesFE.setCategory(category, new_category)
        const dateResult = expensesFE.getDate()
        const priceResult = expensesFE.getPrice()
        const categoryResult = expensesFE.getCategory()
        await expenseDb.storeExpenses(id, categoryResult, dateResult, priceResult)
        res.redirect('/api/expenses/yonela')
    }
    const getAllExpenses = async (req, res) => {
        const { name } = req.params
        const categories = await expenseDb.getCategories()
        const expenses = await expenseDb.getUserExpenses(name)
        console.log(expenses)

        res.render('all_expenses', {
            name,
            categories
        })
    }
    const postAllExpenses = async (req, res) => {
        const { name } = req.params
        const categories = await expenseDb.getCategories()
        res.render('post_expenses', {
            name,
            categories
        })
    }
    return {
        getWelcome,
        postWelcome,
        getSignup,
        postSignup,
        getSignin,
        postSignin,
        postExpenses,
        getExpenses,
        getAllExpenses,
        postAllExpenses
    }
}

module.exports = Routes