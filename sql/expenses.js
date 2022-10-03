const ExpensesDb = (db) => {
    const storeCode = async (name, code) => {
        return await db.oneOrNone('update users set code = $2 where first_name = $1', [name, code])
    }
    const findUserByCode = async (code) => {
        const result = await db.oneOrNone('select * from users where code = $1', [code])
        console.log(result)
        return result
    }
    const storeCategory = async (category) => {
        const result = await db.manyOrNone('INSERT INTO categories(category) VALUES ($1);', [category])
        return [result]
    }
    const storeUser = async (name, last_name, email,) => {
        const result = await db.manyOrNone('INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3);', [name, last_name, email])
        return [result]
    }
    const getCategoryByName = async (category) => {
        const [result] = await db.manyOrNone('SELECT * FROM categories WHERE category = $1;', [category])
        return result
    }
    const getUserByName = async (name) => {
        const [result] = await db.manyOrNone('SELECT * FROM users WHERE first_name = $1;', [name])
        return result
    }
    const getUser = async (email) => {
        const [result] = await db.manyOrNone('SELECT * FROM users WHERE email = $1;', [email])
        return result
    }

    const storeExpenses = async (userId, categoriesId, date, amount) => {
        await db.oneOrNone('INSERT INTO expenses (user_id, categories_id, date, amount) VALUES ($1, $2, $3, $4);', [userId, categoriesId, date, amount])
    }

    const getUserExpenses = async (name) => {
        const tables = await db.manyOrNone('SELECT * FROM expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1;', [name])
        return tables
    }

    const expByCategory = async (name, categoryId) => {
        return tables = await db.manyOrNone('SELECT * FROM expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1 AND categories_id = $2;', [name, categoryId])
    }

    const byCategoryName = async (name, category) => {
        return tables = await db.manyOrNone('SELECT * FROM expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1 AND category = $2;', [name, category])
    }
    const getTotalAmount = async (name) => {
        const tables = await db.oneOrNone('SELECT SUM(amount) AS total_amount FROM expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1;', [name])
        return tables
    }

    const getCategories = async () => {
        return await db.manyOrNone('select * from categories')
    }
    const getCredits = async () => {
        return await db.manyOrNone('select * from credits')
    }
    const storeIncome = async (userId, creditsId, date, amount) => {
        await db.oneOrNone('INSERT INTO income (user_id, credits_id, date, amount) VALUES ($1, $2, $3, $4);', [userId, creditsId, date, amount])
    }
    const storeIncomesCategory = async (incomes) => {
        const result = await db.manyOrNone('INSERT INTO credits(credit) VALUES ($1);', [incomes])
        return [result]
    }
    const incomesByName = async (income) => {
        const [result] = await db.manyOrNone('SELECT * FROM credits WHERE credit = $1;', [income])
        return result
    }
    return {
        storeCode,
        storeCategory,
        findUserByCode,
        storeUser,
        getUser,
        getUserByName,
        getCategories,
        storeExpenses,
        getUserExpenses,
        getCategoryByName,
        getTotalAmount,
        expByCategory,
        byCategoryName,
        getCredits,
        storeIncome,
        storeIncomesCategory,
        incomesByName
    }
}

module.exports = ExpensesDb