const moment = require('moment')

const ExpensesFE = () => {
    let dateTime = ''
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

    const getName = () => name
    const getLastName = () => lastName
    const getEmail = () => email
    const getPrice = () => price
    const getDate = () => dateTime

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
    }
}

module.exports = ExpensesFE