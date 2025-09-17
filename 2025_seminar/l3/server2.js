const express = require('express')
const {creatReadStream, createReadStream} = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const COOKIE_SECRET = 'tayhohiteaihuo'

const USERS ={
    alice: 'password',
    bob: 'hunter2'
}
const BALANCES ={
    alice: 500, bob: 100
}

const app = express()
app.use(cookieParser(COOKIE_SECRET))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    const username  = req.signedCookies.username
    const balance  =BALANCES[username]
    if (username) {
        res.send(`Hi ${username}. Your balance is $${balance}.`)

    } else {
    createReadStream('index.html').pipe(res)
    }
})

app.post('/login', (req, res)=>{
    const username = req.body.username
    const password = USERS[username]
    if (req.body.password === password){
        res.cookie('username', username, { signed: true})
        res.send('Nice!')
    } else {
        res.send('Fail!')
    }
})

app.get('/logout',(req, res)=>{
    res.clearCookie('username')
    res.redirect('/')
})
app.listen(4000)