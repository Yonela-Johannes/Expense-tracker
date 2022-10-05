const ExpensesDb = (db) => {
    const storeCode = async (name, code) => {
        return await db.oneOrNone('update users set code = $2 where first_name = $1', [name, code])
    }
    const findUserByCode = async (code) => {
        const result = await db.oneOrNone('select * from users where code = $1', [code])
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

    // const getUserExpenses = async (name) => {
    //     return await db.manyOrNone('SELECT first_name, last_name, user_id, amount, date, email, SUM(amount) FROM expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1 GROUP BY first_name, last_name, user_id, amount, date, email;', [name])
    // }
    const getUserExpenses = async (name) => {
        return await db.manyOrNone('SELECT *, (SELECT SUM(expenses.amount) as total FROM expenses) FROM expenses LEFT JOIN categories ON categories_id = categories.id LEFT JOIN users on user_id = users.id WHERE first_name = $1;', [name])
    }

    const expByCategory = async (name, categoryId) => {
        return await db.manyOrNone('SELECT * FROM expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1 AND categories_id = $2;', [name, categoryId])
    }

    const byCategoryName = async (name, category) => {
        return await db.manyOrNone('SELECT * from expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1 AND category = $2;', [name, category])
    }
    const getTotalAmount = async (name) => {
        return await db.oneOrNone('SELECT SUM(amount) AS total_amount FROM expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1;', [name])
    }

    const expensesByDate = async (name, date) => {
        return await db.manyOrNone('SELECT * FROM expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1 AND date = $2;', [name, date])
    }

    const expensesByDuration = async (name, duration) => {
        return await db.manyOrNone('SELECT * FROM expenses left join users on user_id = users.id JOIN categories ON categories_id = categories.id where first_name = $1 AND date > (current_date - $2);', [name, Number(duration)])
    }

    const currentDay = async (duration) => {
        const count = await db.manyOrNone('select current_day from expenses')
        console.log("count bro", !count)
        if (!count) {
            return await db.manyOrNone('insert into expenses(current_day) values(7);')
        }
        return await db.manyOrNone('update expenses set current_day = $1;', duration)
    }

    const getCurrentDay = async () => {
        const [count] = await db.manyOrNone('select current_day from expenses')
        return count
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

    const userIncome = async (name) => {
        const tables = await db.manyOrNone('SELECT * FROM income LEFT JOIN credits ON credits_id = credits.id JOIN users on user_id = users.id WHERE first_name = $1;', [name])
        return tables
    }
    const incomeByName = async (name, income) => {
        return tables = await db.manyOrNone('SELECT * FROM income LEFT JOIN credits ON credits_id = credits.id JOIN users on user_id = users.id WHERE first_name = $1 AND credit = $2;', [name, income])
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
        incomesByName,
        userIncome,
        incomeByName,
        expensesByDate,
        expensesByDuration,
        currentDay,
        getCurrentDay,
    }
}

module.exports = ExpensesDb