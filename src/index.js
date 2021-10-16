const express = require('express')
const socket = require('socket.io')
const {fetch} = require('./lib/postgres.js')
const app = express()
const cookieParser = require('cookie-parser')
const server = require('http').createServer(app)
const {PORT} = require('./config.js')
const path = require('path')
const io = socket(server)


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



app.use((req,res,next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
    })
    next()
}) 

// Postgres Query
const get = `
select 
u.name,
m.message,
m.created_at as date
from message m
join users u on u.user_id = m.id
`

const add = `
    insert into message (id,message) 
    values ($1 , $2)
`
const MESSAGE = `
    select 
        u.name,
        m.message,
        m.created_at as date,
        m.message_id
    from users u
    join message m on m.id = u.user_id
    order by message_id desc   
    limit 1
`   
const LOGIN = `
select
*
from users u
where u.name = $1 and u.password = $2
`
const REGISTER = `
    insert into 
    users (name, password)
    values ($1, $2)
    returning *
`

// router
app.get('/', (req,res) => {
    if(!req.cookies.userId) res.redirect('/login')
    else res.sendFile(path.join(process.cwd(), 'public', 'views', 'index.html'))
})
app.get('/logout', (req,res) => {
    res.clearCookie('userId')
    res.redirect('/login')
})
app.get('/login', (req,res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'views', 'login.html'))
})
app.get('/register', (req,res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'views', 'register.html'))
})
app.post('/login', async (req,res) => {
    try {
        let {user_name, password} = req.body
        let user = await fetch(LOGIN, [user_name, password])

                if(user.length){
                    res.cookie('userId', user[0].user_id)
                    res.redirect('/')
                }

    } catch (error) {
        console.log(error);
    }    
})

app.post('/register', async (req,res) => {
    try {
        let {user_name, password} = req.body
        let user = await fetch(REGISTER, [user_name, password])
        if(user.length){
            res.cookie('userId', user[0].user_id)
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
    }    
})

// on new connection
io.on('connection', async client =>  {
    let messages = await fetch(get)
    client.emit('init', JSON.stringify(messages))
    client.on('new_message', data => {
        fetch(add,[data[0],data[1]]).then( answer => {
            if(answer){
                fetch(MESSAGE).then((result) => {
                    client.emit('receive_message', result)
                    client.broadcast.emit('receive_message',result)
                })  
            }
        })
    })
    
})

app.use(express.static('public'))

// run server
server.listen(PORT, () => console.log(PORT))