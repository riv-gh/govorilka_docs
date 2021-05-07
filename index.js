const express = require('express')
const path = require('path')
const fs = require('fs')
const { networkInterfaces } = require('os')

const {FOLDER, ACCESS_IP_SUBSTR, PORT, UPDATE_INTERVAL} = require('./config')

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')

app.use((req, res, next) => {
    console.log('Date', new Date(), 'Method', req.method, 'URL', req.originalUrl, 'IP', req.ip)
    if ((''+req.ip).indexOf(ACCESS_IP_SUBSTR)>-1)
        next()
    else {
        fs.appendFileSync('access.log', ('Date: ' + new Date()+ '\tIP: ' + req.ip + '\tMethod: ' + req.method + '\tURL: ' + req.originalUrl))
        res.status(403).send('Access Denied!')
    }
    
})

console.log(path.resolve(FOLDER))
app.use('/files_pdf', express.static(path.resolve(FOLDER)))

app.get('/', (req, res, next) => {
    console.log(new Date(), 'перегляд списку документів з пристрою', req.ip)
    fs.readdir(path.resolve(FOLDER), (err, items) => {
        const fileArray = items
            .filter( (item) => {
                return path.extname(item).toLocaleLowerCase() === '.pdf'
            } )
        res.render('index', { fileArray, UPDATE_INTERVAL })
    })
})

app.get('/json', (req, res, next) => {

    fs.readdir(path.resolve(FOLDER), (err, items) => {
        const fileArray = items
            .filter( (item) => {
                return path.extname(item).toLocaleLowerCase() === '.pdf'
            } )
        res.json(JSON.stringify(fileArray))
    })
})

app.get('/document/:file', (req, res, next) => {
    const file = req.params.file
    console.log(new Date(), 'перегляд документу', '\x1b[32m', file, '\x1b[0m', 'з пристрою', req.ip)
    res.render('document', { file })
})

app.listen(PORT, () => {
    const nets = networkInterfaces()
    const interfaces = {}
    for (const name of Object.keys(nets)) {
        for(const net of nets[name]) {
            if(net.family === 'IPv4' && !net.internal) {
                if(!interfaces[name]) {
                    interfaces[name] = []
                }
                interfaces[name].push(net.address)
            }
        }
    }
    console.log(new Date(), 'сервіс запущено на', PORT,'порті та доступно за наступними адрессами:')
    console.log(interfaces)
})