const express = require('express')
const {createReadStream} = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { randomBytes } = require('crypto')

const COOKIE_SECRET = 'tayhohiteaihuo'

const USERS ={ alice: 'password', bob: 'hunter2'}
const BALANCES ={alice: 500, bob: 100}

let nextSessionId = 0
const SESSIONS ={} //sessionId -> username

const app = express()
app.use(cookieParser(COOKIE_SECRET))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    const sessionId = req.cookies.sessionId
    const username = SESSIONS[sessionId]
    const source = req.query.source // 行を追加して、Hiのあとに続けたい。3行下に ${source} 追記した
    if (username) {
        res.send(`
            <h1>Hi <span id='username'></span>.
            Your balance is $${BALANCES[username]}.
            </h1>
            <form method='POST' action='/transfer'>
            Send amount:
            <input name='amount' />
            To user:
            <input name='to' />
            <input type='submit' value='Send' />
            </form>            
        `)
    } else{
        res.send(`
        <h1>
        ${source} Hi ${source} reader!
        Login to your bank account
        </h1>
        <form method='POST' action='/login'>
            Username: <input name='username' />
            Password: <input name='password' type='password' />
            <input type='submit' value='Login' />
        </form>
        `)
    }
})

app.post('/login', (req, res)=>{
    const username = req.body.username
    const password = USERS[username]
    if (req.body.password === password){
        const sessionId = randomBytes(16).toString('base64')
        SESSIONS[sessionId] = username
        res.cookie('sessionId',sessionId, {
            //secure: true, // localhostで通信するのでhttpsが使えない。
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })
        res.redirect('/')
    } else {
        res.send('Fail!')
    }
})

app.get('/logout',(req, res)=>{
    const sessionId = req.cookies.sessionId
    res.clearCookie('sessionId', {
        //secure: true, // localhostで通信するのでhttpsが使えない。
        httpOnly: true,
        sameSite: 'lax'
    })
    delete SESSIONS[sessionId]
    res.redirect('/')
})

app.post('/transfer', (req,res) =>{
    const sessionId = req.cookies.sessionId
    const username = SESSIONS[sessionId]
    
    if(!username){
        res.send('Fail!')
        return
    }

    const amount = Number(req.body.amount)
    const to = req.body.to

    BALANCES[username] -= amount
    BALANCES[to] += amount

    res.redirect('/')
})

app.listen(4000)