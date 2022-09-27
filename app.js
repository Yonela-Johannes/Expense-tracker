const moment = require('moment')
const ExpensesFE = () => {
    let dateTime, category = ''
    let price = 0
    let name, lastName, email = ''

    const setName = (nameInput) => name = nameInput.toLowerCase()
    const setLastName = (lName) => lastName = lName
    const setEmail = (uEmail) => email = uEmail

    const setPrice = (priceInput) => {
        price = priceInput
    }

    const setDate = (date) => {
        const today = new Date()
        if (date) {
            dateTime = date
        } else {
            dateTime = moment(today).format("DD-MM-YYYY")
        }
    }
    const setCategory = (category_input, new_category) => {
        if (category_input) {
            category = category_input
        } else if (!category_input) {
            category = new_category
        }
    }

    const getName = () => name
    const getLastName = () => lastName
    const getEmail = () => email
    const getPrice = () => price
    const getDate = () => dateTime
    const getCategory = () => category

    return {
        setName,
        setLastName,
        setEmail,
        setPrice,
        getPrice,
        setDate,
        getDate,
        getName,
        getLastName,
        getEmail,
        setCategory,
        getCategory
    }
}

module.exports = ExpensesFE