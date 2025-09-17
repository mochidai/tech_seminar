const express = require('express')
const {creatReadStream, createReadStream} = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const USERS ={
    alice: 'password',
    bob: 'hunter2'
}

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', (req, res) => {
    const username  = req.cookies.username
    if (username) {
        res.send(`Hi ${username}!`)
    } else {
    createReadStream('index.html').pipe(res)
    }
})

app.post('/login', (req, res)=>{
    const username = req.body.username
    const password = USERS[username]
    if (req.body.password === password){
        res.cookie('username', username)
        res.send('Nice!')
    } else {
        res.send('Fail!')
    }
})
app.listen(4000)