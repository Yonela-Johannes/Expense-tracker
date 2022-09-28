const ExpensesDb = (db) => {
    const storeCategory = async (category) => {
        const result = await db.manyOrNone('INSERT INTO categories(category) VALUES ($1);', [category])
        return [result]
    }
    const storeUser = async (name, last_name, email,) => {
        const result = await db.manyOrNone('INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3);', [name, last_name, email])
        return [result]
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
        let result = ''
        result = await db.oneOrNone('INSERT INTO expenses (user_id, categories_id, date, amount) VALUES ($1, $2, $3, $4);', [userId, categoriesId, date, amount])
        return result
    }
    const getUserExpenses = async (name) => {
        const tables = await db.manyOrNone('SELECT * FROM expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1;', [name])
        return tables
    }
    const getTotalAmount = async (name) => {
        const tables = await db.oneOrNone('SELECT SUM(amount) AS total_amount FROM expenses LEFT JOIN categories ON categories_id = categories.id JOIN users on user_id = users.id WHERE first_name = $1;', [name])
        return tables
    }

    const getCategories = async () => {
        return await db.manyOrNone('select * from categories')
    }
    return {
        storeCategory,
        storeUser,
        getUser,
        getUserByName,
        getCategories,
        storeExpenses,
        getUserExpenses,
        getTotalAmount
    }
}

module.exports = ExpensesDb