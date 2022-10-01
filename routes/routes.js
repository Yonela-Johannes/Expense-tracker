const moment = require("moment")
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 8 });

const Routes = (expenseDb, expensesFE) => {
    const getWelcome = async (req, res) => {
        res.render('welcome', {

        })
    }
    const postWelcome = async (req, res) => {
        const { name } = req.body
        const existUser = await expenseDb.getUserByName(name)
        if (existUser == undefined) {
            res.redirect('api/signup')
        }
        res.redirect(`/get_code/${name}`)
    }

    const getCode = async (req, res) => {
        const { name } = req.params
        let user = await expenseDb.getUserByName(name)
        if (user == undefined) {
            res.redirect('/api/signup')
        }
        // const getCode = ()
        res.render('get_code', {
            user,

        })
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
        res.redirect(`/get_code/${name}`)
    }

    const getSignin = async (req, res) => {
        res.render('signin', {

        })
    }
    const postSignin = async (req, res) => {
        const { email } = req.body
        console.log(req.params)
        // console.log(req.body)
        
        // const user = await expenseDb.getUser(email)
        // if (user == undefined) {
        //     res.redirect('/api/signup')
        // }
        // const user_name = user.first_name.toLowerCase()
        // res.redirect(`/api/expenses/${user_name}`)
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
        let categoryResult = 0
        const { name } = req.params
        const { price, date, new_category, category } = req.body
        const user = await expenseDb.getUserByName(name)
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
        res.redirect('/api/expenses/yonela')
    }
    const getAllExpenses = async (req, res) => {
        const { name } = req.params
        const categories = await expenseDb.getCategories()
        const expenses = await expenseDb.getUserExpenses(name)
        const totalAmount = await expenseDb.getTotalAmount(name)
        res.render('all_expenses', {
            name,
            categories,
            totalAmount,
            expenses,
            helpers: {
                dateFormatter: (date) => {
                    let setDate = ''
                    if (date.split('-')[0].length > 2) {
                        setDate = date.split('-').reverse().join().replaceAll(',', '-')
                    } else {
                        setDate = date
                    }
                    return moment(setDate, 'DD-MM-YYYY').format("ddd-DD-MMM")
                },
                setActive: (cat) => {
                    const active = ''
                    // if (category.includes(cat)) {
                    //     active = 'active'
                    // }
                    return active
                },
            },
        })
    }
    const postAllExpenses = async (req, res) => {
        const { name } = req.params
        const { category } = req.body
        let getCategory = []
        if (category == '') {
            getCategory = await expenseDb.getCategories()
        }
        const categories = await expenseDb.getCategories()
        const expenses = await expenseDb.getUserExpenses(name)
        getCategory = expenses.filter(cat => cat.category == category)
        const totalAmount = await expenseDb.getTotalAmount(name)
        // console.log(expenses)

        res.render('all_expenses', {
            name,
            categories,
            getCategory,
            totalAmount,
            expenses,
            helpers: {
                dateFormatter: (date) => {
                    let setDate = ''
                    if (date.split('-')[0].length > 2) {
                        setDate = date.split('-').reverse().join().replaceAll(',', '-')
                    } else {
                        setDate = date
                    }
                    return moment(setDate, 'DD-MM-YYYY').format("ddd-DD-MMM")
                },
                setActive: (cat) => {
                    let active = ''
                    if (category.includes(cat)) {
                        active = 'active'
                    }
                    return active
                }
            }
        })
    }
    return {
        getWelcome,
        postWelcome,
        getCode,
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