const Express = require('express');
const Route = Express.Router();
let credentials = [
    { username: "demo", password: 'secret' },
    { username: "dev", password: 'secret' }
]
Route.post('/login', (req, res) => { // Login Check
    const username = req.body?.username
    const password = req.body?.password
    if (username && password) {
        const isValidUserName = credentials.filter((element) => element.username === username)
        if (!isValidUserName?.length) {
            res.json({
                error: "Please check the username!",
            }).status(5001)
        } else if (isValidUserName?.length) {
            if (isValidUserName[0].password === password) {
                res.json({
                    message: `Welcome ${username}`,
                }).status(200)
            } else {
                res.json({
                    message: `Incorrect Password`,
                }).status(4001)
            }
        } else {
            res.json({
                error: `Something went wrong!`,
            }).status(500)
        }
    } else {
        res.json({
            error: "Username or Passoword is missing!",
        }).status(4001)
    }
})
module.exports = Route;