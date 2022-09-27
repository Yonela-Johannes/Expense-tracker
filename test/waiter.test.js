const { WaitersDb } = require('../config/waiters.js')
const assert = require('assert')
const pgp = require('pg-promise')();

const local = 'postgres://postgres:juanesse123@localhost:5432/waiters_availability_tests';
const connectionString = process.env.DATABASE_URL || local
const config = {
    connectionString,
    max: 20
}

const db = pgp(config)
const waitersDb = WaitersDb(db)


describe('Registration Test', () => {
    beforeEach(async () => {
        await waitersDb.deleteWaiters()
        await waitersDb.resetDays()
    })
    describe("Login", () => {
        it('should store and fetch name from database', async () => {
            const username = 'Yonela'
            await waitersDb.storeName(username)
            const getWaiter = await waitersDb.getUser(username)
            const { name } = getWaiter
            assert.equal('Yonela', name)
        })
    });
    describe("Schedule One Day", () => {
        it('should schedule waiter availabity[name & day(s)', async () => {
            const username = 'Luks'
            const day = 2
            await waitersDb.storeName(username)
            const getWaiter = await waitersDb.getUser(username)
            const { id } = getWaiter
            await waitersDb.storeWaiterAvailabilty(id, day)
            const days_available = await waitersDb.getDay(id)
            const waiter = [
                [
                    { name: 'Luks', day: 'Tuesday' },
                ]
            ]
            assert.deepEqual(waiter, days_available)
        })
    });
    describe("Schedule", () => {
        it('should schedule waiter availabity[name & day(s)]', async () => {
            const username = 'Walter'
            const day = [2, 5, 7]
            await waitersDb.storeName(username)
            const getWaiter = await waitersDb.getUser(username)
            const { id } = getWaiter
            await waitersDb.storeWaiterAvailabilty(id, day)
            const [days_available] = await waitersDb.getDay(id)

            const [waiter] = [
                [
                    { name: 'Walter', day: 'Friday' },
                    { name: 'Walter', day: 'Sunday' },
                    { name: 'Walter', day: 'Tuesday' }
                ]
            ]
            assert.deepEqual(waiter, days_available)
        })
    })
    describe("Delete Waiters", () => {
        it('should delete all names and available days in database', async () => {
            let username = 'Yonela'
            let day = [1, 2, 3, 4]
            await waitersDb.storeName(username)
            username = 'Okuhle'
            await waitersDb.storeName(username)
            let getWaiter = await waitersDb.getUser(username)
            let id = getWaiter.id
            await waitersDb.storeWaiterAvailabilty(id, day)
            username = 'Avee'
            await waitersDb.storeName(username)
            getWaiter = await waitersDb.getUser(username)
            id = getWaiter.id
            await waitersDb.storeWaiterAvailabilty(id, day)
            await waitersDb.deleteWaiters()
            const waiters_available = await waitersDb.getWaiters()
            assert.deepEqual([], waiters_available)
        })
    });
    describe("Delete All Days", () => {
        it('should delete all days in database', async () => {
            const username = 'Luks'
            const day = [1, 2, 3, 4, 5, 6]
            await waitersDb.storeName(username)
            const getWaiter = await waitersDb.getUser(username)
            const { id } = getWaiter
            await waitersDb.storeWaiterAvailabilty(id, day)
            await waitersDb.resetDays()
            const days_available = await waitersDb.getAvailableDays()
            assert.deepEqual([], days_available)
        })
    });
})
