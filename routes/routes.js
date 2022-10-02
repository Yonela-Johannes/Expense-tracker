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
        res.redirect(`${name}`)
    }


    const getExpenses = async (req, res) => {
        const { name } = req.params
        const categories = await expenseDb.getCategories()
        const expenses = await expenseDb.getUserExpenses(name)
        const totalAmount = await expenseDb.getTotalAmount(name)
        res.render('post_expenses', {
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
    const postExpenses = async (req, res) => {
        let categoryResult = 0
        const { name } = req.params
        const { price, date, new_category, category } = req.body

        if (!price) {
            res.redirect(`${name}`)
        } else if (!category && new_category) {
            res.redirect(`${name}`)
        } else {
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
            res.redirect(`${name}`)
        }
    }

    const getCategory = async (req, res) => {
        const { catId } = req.body
        const { name } = req.params
        const categories = await expenseDb.getCategories()
        const catExpenses = await expenseDb.expByCategory(name, catId)
        res.render('category', {
            name,
            categories,
            catExpenses,
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
    const postCategory = async (req, res) => {
        const { catId } = req.body
        const { name } = req.params
        const categories = await expenseDb.getCategories()
        const catExpenses = await expenseDb.expByCategory(name, catId)
        console.log(catExpenses)

        res.render('category', {
            name,
            categories,
            catExpenses,
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
        postCategory
    }
}

module.exports = Routes