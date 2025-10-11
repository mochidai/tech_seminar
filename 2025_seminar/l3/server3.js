const express = require('express')
const {creatReadStream, createReadStream} = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { randomBytes } = require('crypto')

const COOKIE_SECRET = 'tayhohiteaihuo'

const USERS ={
    alice: 'password',
    bob: 'hunter2'
}
const BALANCES ={
    alice: 500, bob: 100
}

let nextSessionId = 0
const SESSIONS ={} //sessionId -> username

const app = express()
app.use(cookieParser(COOKIE_SECRET))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    const sessionId = req.cookies.sessionId
    const username = SESSIONS[sessionId]
    if (username) {
        const balance  =BALANCES[username]
        res.send(`Hi ${username}. Your balance is $${balance}.`)
    } else {
    createReadStream('index.html').pipe(res)
    }
})

app.post('/login', (req, res)=>{
    const username = req.body.username
    const password = USERS[username]
    if (req.body.password === password){
        nextSessionId = randomBytes(16).toString('base64')
        res.cookie('sessionId',nextSessionId)
        SESSIONS[nextSessionId] = username
        res.redirect('/')
    } else {
        res.send('Fail!')
    }
})

app.get('/logout',(req, res)=>{
    const sessionId = req.cookies.sessionId
    res.clearCookie('username')
    delete SESSIONS[sessionId]
    res.redirect('/')
})
app.listen(4000)